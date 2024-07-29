import os
import sys
import json
import boto3
import random
sys.path.append('/opt')
sys.path.append('/lib/python')
import psycopg2
import urllib.parse
from get_secret import conn_database
from psycopg2.extras import DictCursor
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from generatePostSchedule import generate_next_post_timestamp

logger = Logger()
lambda_client = boto3.client('lambda')

def create_post_record(conn, cur, company_id, generated_caption, post_at, bucket, key):
    sql = """INSERT INTO posts
            (company_id, post_caption, post_at, bucket, key)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;"""
    try:
        cur.execute(sql, (company_id, generated_caption, post_at, bucket, key))
        conn.commit()
        logger.info("Successfully created post records")
    except Exception as e:
        logger.error("Unable to create post record with caption", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Unable to create post record with caption'})
        }

def get_prompt(conn, cur, company_id, platform):
    try:
        sql = """SELECT * FROM prompt WHERE company_id=%s AND platform=%s;"""
        cur.execute(sql, (company_id, platform))
        prompt = cur.fetchone()['prompt']
        logger.info("Successfully retrieved prompt")

        sql = """SELECT feature_map, caption_formatting FROM company_metadata WHERE company_id=%s;"""
        cur.execute(sql, (company_id,))
        metadata = cur.fetchone()
        feature_map = metadata['feature_map']
        caption_formatting = metadata['caption_formatting']
        logger.info("Successfully retrieved feature_map: %s", feature_map)
    except Exception as e:
        logger.error("Unable to retrieve data for company_id %s", company_id, exc_info=True)
        return None

    if feature_map:
        features = [fw['feature'] for fw in feature_map]
        weights = [fw['weight'] for fw in feature_map]
        selected_feature = random.choices(features, weights=weights, k=1)[0]
        prompt += f"\nEmphasize the following: {selected_feature}\n"
    
    if caption_formatting: 
        prompt += f"Make sure to follow the following output template:\n" 
        prompt += f"{caption_formatting}\n"
        prompt += f"Do not add any extra quotation marks."

    logger.info("ChatGPT prompt: %s", prompt)
    return prompt

def handler(event, context: LambdaContext):
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        company_id = key.split('/')[1]
    except Exception as e:
        logger.error("Failed to ingest image in event: %s", event, exc_info=True)
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Failed to process the event'})
        }

    logger.append_keys(company_id=company_id)
    logger.info("Image bucket: %s", bucket)
    logger.info("Image key: %s", key)

    conn, cur = conn_database()
    if not conn or not cur:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }

    try:
        env = os.environ['ENV']
        logger.info(f'env is {env}')
        prompt = get_prompt(conn, cur, company_id, "instagram")
        if not prompt:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to retrieve prompt'})
            }

        logger.info("Prompt: %s", prompt)

        # Generate post schedule
        post_at = generate_next_post_timestamp(conn, cur, company_id)

        input_params = {
            "arguments": {
                "prompt": prompt,
                "bucket": bucket,
                "key": key
            }
        }

        logger.info("Invoking Media Describer")
        logger.info(f"CaptionGenerator-{env} being invoked")
        response = lambda_client.invoke(
            FunctionName=f'CaptionGenerator-{env}',
            InvocationType='RequestResponse',
            Payload=json.dumps(input_params)
        )

        if response.get('StatusCode') == 200:
            payload = response['Payload'].read().decode('utf-8')
            logger.info(f"Raw payload: {payload}")
            result = json.loads(payload)
            
            if 'body' in result:
                body = json.loads(result['body'])
                if 'caption' in body:
                    caption = body['caption']
                    logger.info(f"Generated caption: {caption}")
                    create_post_record(conn, cur, company_id, caption, post_at, bucket, key)
                    return {
                        'statusCode': 200,
                        'body': json.dumps({'extracted_caption': caption})
                    }
                else:
                    logger.error("Caption not found in the response body")
            else:
                logger.error("Body not found in the response")

            logger.error(f"Unexpected response structure: {result}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Unexpected response structure from CaptionGenerator'})
            }
        else:
            logger.error(f"Invocation failed with status code: {response.get('StatusCode')}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f"Invocation failed with status code: {response.get('StatusCode')}"})
            }
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"An error occurred: {str(e)}"})
        }
    finally:
        cur.close()
        conn.close()

