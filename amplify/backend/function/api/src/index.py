import json
import psycopg2
from psycopg2.extras import DictCursor
import os

def handler(event, context):
  print('received event:')
  print(event)
  print(event['arguments']['company_id'])

  try:
    conn = psycopg2.connect(database = os.environ['database'], 
                            user = os.environ['user'], 
                            host= os.environ['host'],
                            password = os.environ['password'],
                            port = int(os.environ['port']))
    
    cur = conn.cursor(cursor_factory=DictCursor)

    sql = """SELECT id, post_at, post_caption, bucket, key  FROM posts WHERE company_id=%s AND post_at >= NOW();"""

    cur.execute(sql, (event['arguments']['company_id'],))

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

    print("return value: ", ret)

    return ret

  except Exception as e:
     return {
         'statusCode': 500,
         'body': json.dumps({'error': str(e)})
         }
  
  finally:
        # Close the cursor and the connection
        if cur:
            cur.close()
        if conn:
            conn.close()

# resp = [
#     {
#       "storageUrl": "https://example.com/sample.jpg",
#       "postAt": "2023-09-18T12:00:00Z",
#       "caption": "Sample Caption"
#     }
#     ]