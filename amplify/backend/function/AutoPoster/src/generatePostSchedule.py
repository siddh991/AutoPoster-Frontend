import os
import pytz
import datetime
import psycopg2
from aws_lambda_powertools import Logger

logger = Logger()

def get_last_post_timestamp(conn, cur, company_id):
    sql = """SELECT post_at FROM posts
            WHERE company_id = %s
            ORDER BY post_at DESC
            LIMIT 1;"""
    try:
        cur.execute(sql, (company_id,))
        last_post = cur.fetchone()
    except Exception as e:
        logger.error("Failed while finding post time for company_id %s", company_id, exc_info=True)
        return datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(days=1)

    if last_post:
        last_post_timestamp = last_post['post_at']
    else:
        last_post_timestamp = datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(days=1)

    tomorrow_timestamp = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=1)
    tomorrow_timestamp = tomorrow_timestamp.replace(hour=0, minute=0, second=0, microsecond=0)
    if last_post_timestamp < tomorrow_timestamp:
        last_post_timestamp = tomorrow_timestamp - datetime.timedelta(days=1)
    
    return last_post_timestamp

def generate_next_post_timestamp(conn, cur, company_id):
    last_post_timestamp = get_last_post_timestamp(conn, cur, company_id)

    pst_timezone = pytz.timezone('America/Los_Angeles')
    last_post_local_timestamp = last_post_timestamp.astimezone(pst_timezone)

    next_post_local_timestamp = last_post_local_timestamp + datetime.timedelta(days=1)
    
    time_mapping = {
        0: datetime.datetime(year=2023, month=8, day=26, hour=1, minute=0, second=0, tzinfo=datetime.timezone.utc),
        1: datetime.datetime(year=2023, month=8, day=26, hour=1, minute=0, second=0, tzinfo=datetime.timezone.utc),
        2: datetime.datetime(year=2023, month=8, day=26, hour=1, minute=0, second=0, tzinfo=datetime.timezone.utc),
        3: datetime.datetime(year=2023, month=8, day=26, hour=1, minute=0, second=0, tzinfo=datetime.timezone.utc),
        4: datetime.datetime(year=2023, month=8, day=26, hour=1, minute=0, second=0, tzinfo=datetime.timezone.utc),
        5: datetime.datetime(year=2023, month=8, day=26, hour=17, minute=0, second=0, tzinfo=datetime.timezone.utc),
        6: datetime.datetime(year=2023, month=8, day=26, hour=17, minute=0, second=0, tzinfo=datetime.timezone.utc),
    }

    next_post_time_w_dummy_date = time_mapping[next_post_local_timestamp.weekday()]
    next_post_local_time = next_post_time_w_dummy_date.astimezone(pst_timezone).time()
    
    next_post_local_timestamp = next_post_local_timestamp.replace(hour=next_post_local_time.hour, minute=next_post_local_time.minute, second=next_post_local_time.second)
    next_post_timestamp = next_post_local_timestamp.astimezone(datetime.timezone.utc)
    
    return next_post_timestamp
