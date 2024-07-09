import boto3
import json
import requests
import sys
import os
sys.path.append('/opt')
sys.path.append('/lib/python')
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext

logger = Logger()


def generate_presigned_url(bucket_name, object_name, expiration=600):
    """
    Generate a pre-signed URL to share an S3 object.
    
    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the pre-signed URL to remain valid
    :return: Pre-signed URL as string, or None if error
    """
    s3_client = boto3.client('s3')

    try:
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )
    except NoCredentialsError:
        logger.error("Credentials not available.")
        return None
    except PartialCredentialsError:
        logger.error("Incomplete credentials provided.")
        return None
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return None

    # The response contains the pre-signed URL
    return presigned_url


def generate_caption(image_presigned_url, prompt):
    try:
        api_key = os.environ['api_key']
    except:
        logger.error("ChatGPT api key not found.")
        return 401
    
    header = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    model = "gpt-4o"
    endpoint = "https://api.openai.com/v1/chat/completions"
    
    logger.info('this is the final prompt going into GPT-4o: %s', prompt)
    data = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                    "type": "image_url",
                    "image_url": {
                        "url": image_presigned_url,
                    },
                    },
                ]
            }
        ],
        "max_tokens": 500
    }
        
    try:
        response = requests.post(endpoint, headers=header, data=json.dumps(data))
        response = response.json()
        message = response['choices'][0]['message']
        generated_caption = message['content']
        
        if len(generated_caption) == 0:
            logger.error("Generated caption has length 0.")
            return 500
        else:
            logger.info("Generated caption: %s", generated_caption)
            
    except requests.exceptions.RequestException as e:
        logger.error("Request Exception: %s", str(e))
        return 500
    except KeyError:
        logger.error("Key Error: " + str(response))
        return 500
    except (json.JSONDecodeError, ValueError):
        logger.error("JSON Error: Error decoding JSON response.")
        return 500
    
    return generated_caption


def update_caption(image_presigned_url, previous_caption, feedback):
    prompt = "You are a social media caption generator. The current caption you generated for the image generated is: {}. \n Our customer wants this caption modified by following this feedback: {} \nOnly return the caption, nothing else.".format(previous_caption, feedback)
    return generate_caption(image_presigned_url, prompt)


def handler(event, context: LambdaContext):
    caption = ''
    logger.info(event)
    try:
        bucket = event["arguments"]['bucket']
        logger.info("Media bucket: %s", bucket)
        key = event["arguments"]['key']
        logger.info("Media key: %s", key)
        prompt = event["arguments"]['prompt']
        logger.info("Prompt is: %s", prompt)
        
    except:
        logger.error("Unable to extract properties from event")
        return 500

    image_presigned_url = generate_presigned_url(bucket, key)
    
    if 'previous_caption' in event["arguments"]:
        caption = update_caption(image_presigned_url, event["arguments"]['previous_caption'], prompt)
        
    else:
        caption = generate_caption(image_presigned_url, prompt)

    return {
        'statusCode': 200,
        'caption': caption
    }