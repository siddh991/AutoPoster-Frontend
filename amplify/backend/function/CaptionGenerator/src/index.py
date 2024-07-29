import boto3
import json
import requests
import sys
import os
sys.path.append('/opt')
sys.path.append('/lib/python')
from get_secret import generate_presigned_url
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext

logger = Logger()

def call_gpt(data):
    try:
        api_key = os.environ['api_key']
    except KeyError:
        logger.error("ChatGPT api key not found.")
        return 401
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    endpoint = "https://api.openai.com/v1/chat/completions"
    
    try:
        response = requests.post(endpoint, headers=headers, data=json.dumps(data))
        response = response.json()
        message = response['choices'][0]['message']
        generated_text = message['content']
        
        if len(generated_text) == 0:
            logger.error("Generated text has length 0.")
            return 500
        else:
            logger.info("Generated text: %s", generated_text)
            return generated_text
            
    except requests.exceptions.RequestException as e:
        logger.error("Request Exception: %s", str(e))
        return 500
    except KeyError:
        logger.error("Key Error: " + str(response))
        return 500
    except (json.JSONDecodeError, ValueError):
        logger.error("JSON Error: Error decoding JSON response.")
        return 500


def get_caption(image_presigned_url, prompt):
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "user", "content": prompt},
            {"role": "user", "content": image_presigned_url}
        ],
        "max_tokens": 500
    }
    return call_gpt(data)

# def generate_caption(image_presigned_url, prompt):
#     try:
#         api_key = os.environ['api_key']
#     except:
#         logger.error("ChatGPT api key not found.")
#         return 401
    
#     header = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {api_key}"
#     }
#     model = "gpt-4o"
#     endpoint = "https://api.openai.com/v1/chat/completions"
    
#     logger.info('this is the final prompt going into GPT-4o: %s', prompt)
#     data = {
#         "model": model,
#         "messages": [
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": prompt},
#                     {
#                     "type": "image_url",
#                     "image_url": {
#                         "url": image_presigned_url,
#                     },
#                     },
#                 ]
#             }
#         ],
#         "max_tokens": 500
#     }
        
#     try:
#         response = requests.post(endpoint, headers=header, data=json.dumps(data))
#         response = response.json()
#         message = response['choices'][0]['message']
#         generated_caption = message['content']
        
#         if len(generated_caption) == 0:
#             logger.error("Generated caption has length 0.")
#             return 500
#         else:
#             logger.info("Generated caption: %s", generated_caption)
            
#     except requests.exceptions.RequestException as e:
#         logger.error("Request Exception: %s", str(e))
#         return 500
#     except KeyError:
#         logger.error("Key Error: " + str(response))
#         return 500
#     except (json.JSONDecodeError, ValueError):
#         logger.error("JSON Error: Error decoding JSON response.")
#         return 500
    
#     return generated_caption


def update_caption(image_presigned_url, previous_caption, feedback):
    prompt = "You are a social media caption generator. The current caption you generated for the image generated is: {}. \n Our customer wants this caption modified by following this feedback: {} \nOnly return the caption, nothing else.".format(previous_caption, feedback)
    return get_caption(image_presigned_url, prompt)


# def handler(event, context: LambdaContext):
#     caption = ''
#     logger.info(event)
#     try:
#         bucket = event["arguments"]['bucket']
#         logger.info("Media bucket: %s", bucket)
#         key = event["arguments"]['key']
#         logger.info("Media key: %s", key)
#         prompt = event["arguments"]['prompt']
#         logger.info("Prompt is: %s", prompt)
        
#     except:
#         logger.error("Unable to extract properties from event")
#         return 500

#     image_presigned_url = generate_presigned_url(bucket, key)
#     logger.info(image_presigned_url)
    
#     if 'previous_caption' in event["arguments"]:
#         caption = update_caption(image_presigned_url, event["arguments"]['previous_caption'], prompt)
        
#     else:
#         caption = generate_caption(image_presigned_url, prompt)

#     return {
#         'statusCode': 200,
#         'caption': caption
#     }
def handler(event, context: LambdaContext):
    caption = ''
    logger.info(event)

    try:
        # Check if the data is in the 'body' (for regeneration) or 'arguments' (for initial generation)
        if 'body' in event:
            # This is a regeneration request
            body = json.loads(event['body'])
            post_id = body['post_id']
            previous_caption = body['previous_caption']
            feedback = body.get('feedback', '')
            bucket = body['bucket']
            key = body['key']
            
            logger.info(f"Processing regeneration request for post_id: {post_id}")
            image_presigned_url = generate_presigned_url(bucket, key)
            caption = update_caption(image_presigned_url, previous_caption, feedback)
        
        elif 'arguments' in event:
            # This is an initial generation request
            arguments = event['arguments']
            prompt = arguments['prompt']
            bucket = arguments['bucket']
            key = arguments['key']
            
            logger.info(f"Processing initial generation request")
            logger.info(f"Media bucket: {bucket}")
            logger.info(f"Media key: {key}")
            logger.info(f"Prompt: {prompt}")

            image_presigned_url = generate_presigned_url(bucket, key)
            caption = get_caption(image_presigned_url, prompt)
        
        else:
            raise ValueError("Invalid event structure")

        logger.info(f"Generated caption: {caption}")
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    return {
        'statusCode': 200,
        'body': json.dumps({'caption': caption})
    }
