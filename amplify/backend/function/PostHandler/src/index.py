import os
import sys
import json
import logging
sys.path.append('/opt')
sys.path.append('/lib/python')
import psycopg2
from psycopg2.extras import DictCursor
from get_secret import get_secret

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

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


def get_table(company_id):
    logger.info('starting get table')
    conn, cur = conn_database()
    logger.info('connected to database')
    if not conn or not cur:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }
    logger.info('got database connection')
    sql = """SELECT id, post_at, post_caption, bucket, key FROM posts WHERE company_id=%s AND post_at >= NOW();"""
    try:
        cur.execute(sql, (company_id,))
        results = cur.fetchall()
        ret = []
        for item in results:
            data_dict = {
                "id": item['id'],
                "postAt": item['post_at'].strftime("%Y-%m-%d %H:%M:%S %Z"),
                "caption": item['post_caption'],
                "bucket": item['bucket'],
                "key": item['key']
            }
            ret.append(data_dict)
            logger.info('got values')
        return {
            'statusCode': 200,
            'body': json.dumps(ret)
        }

    except Exception as e:
        logger.error(f"Failed to fetch data: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def update_post(post_id, caption):
    conn, cur = conn_database()
    if not conn or not cur:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }
    sql = """UPDATE posts SET post_caption=%s WHERE id=%s"""
    try:
        cur.execute(sql, (caption, post_id))
        conn.commit()
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'Post {post_id} updated successfully'})
        }

    except Exception as e:
        logger.error(f"Failed to update post: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def delete_post(post_id):
    conn, cur = conn_database()
    if not conn or not cur:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }

    sql = """DELETE FROM posts WHERE id=%s"""
    try:
        cur.execute(sql, (post_id,))
        conn.commit()
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'Post {post_id} deleted successfully'})
        }

    except Exception as e:
        logging.error(f"Failed to delete post: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


def handler(event, context):
    logger.info(event);
    try:
        method = event.get('requestContext', {}).get('http', {}).get('method')

        
        if method == 'GET':
            company_id = event.get('queryStringParameters', {}).get('company_id')
            if not company_id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'company_id is required'})
                }
            response = get_table(company_id)
        elif method in ['POST', 'DELETE']:
            # For POST and DELETE, parse the body
            body = json.loads(event['body'])
            if method == 'POST':
                caption = body.get('caption')
                post_id = body.get('post_id')
                response = update_post(post_id, caption)
            elif method == 'DELETE':
                post_id = body.get('post_id')
                response = delete_post(post_id)
        else:
            return {
                'statusCode': 405,
                'body': json.dumps('Method not allowed')
            }
    
    except Exception as e: 
        logger.error(f"400 error: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps(f'Error in request. Specific error: {e}')
        }
    
    return response
