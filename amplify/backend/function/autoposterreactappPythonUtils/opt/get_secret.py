import json
import boto3 
import logging
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