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

        sql = """SELECT feature_map FROM company_metadata WHERE company_id=%s;"""
        cur.execute(sql, (company_id,))
        feature_map = cur.fetchone()['feature_map']
        logger.info("Successfully retrieved feature_map: %s", feature_map)
    except Exception as e:
        logger.error("Unable to retrieve data for company_id %s", company_id, exc_info=True)
        return None

    if feature_map:
        features = [fw['feature'] for fw in feature_map]
        weights = [fw['weight'] for fw in feature_map]
        selected_feature = random.choices(features, weights=weights, k=1)[0]
        prompt += f"\nEmphasize the following: {selected_feature}"

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
            logger.info(payload)
            result = json.loads(payload)
            caption = result['caption']

            logger.info("Generated caption: %s", caption)
            create_post_record(conn, cur, company_id, caption, post_at, bucket, key)

            return {
                'statusCode': 200,
                'body': json.dumps({'extracted_caption': caption})
            }
        else:
            logger.error("Invocation failed with status code: %s", response.get('StatusCode'))
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f"Invocation failed with status code: {response.get('StatusCode')}"})
            }
    finally:
        cur.close()
        conn.close()
