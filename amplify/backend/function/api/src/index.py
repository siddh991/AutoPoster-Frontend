import json
import psycopg2
import os

def handler(event, context):
  print('received event:')
  print(event)
  print(event['arguments']['id'])

  try:
    conn = psycopg2.connect(database = os.environ['database'], 
                            user = os.environ['user'], 
                            host= os.environ['host'],
                            password = os.environ['password'],
                            port = int(os.environ['port']))
    
    cur = conn.cursor()

    sql = """SELECT * FROM posts WHERE company_id=%s AND post_at >= NOW();"""

    cur.execute(sql, (event['arguments']['id'],))

    results = cur.fetchall()

    ret = []

    for item in results:
        data_dict = {
            "storageUrl": item[7],
            "postAt": item[4].strftime("%Y-%m-%d %H:%M:%S %Z"),
            "caption": item[3],
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