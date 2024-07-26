import json
import boto3 
import logging
import psycopg2
from psycopg2.extras import DictCursor
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret():
    print('starting secret')
    secret_name = "deepwork-db-secret"
    region_name = "us-east-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    print('got secret manager')

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        print('invalid secret value')
        print(e)
        raise e

    if 'SecretString' in get_secret_value_response:
        secret = json.loads(get_secret_value_response['SecretString'])
    else:
        raise Exception("Secret does not contain a 'SecretString' field")
    print(secret)
    print('done secret function')
    return secret

def conn_database():
    conn = None
    cur = None
    logger.info('starting conn database')
    try: 
        secret = get_secret()
        username = secret['username']
        password = secret['password']
        host = secret['host']
        dbname = secret['dbname']
        conn_string = f"dbname={dbname} user={username} password={password} host={host}"
        conn = psycopg2.connect(conn_string)
        cur = conn.cursor(cursor_factory=DictCursor)
        return conn, cur

    except Exception as e: 
        logger.error(f"Error connecting to database: {e}")
        return None, None

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
