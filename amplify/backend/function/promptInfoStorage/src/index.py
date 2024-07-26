import os
import sys
import json
import logging
sys.path.append('/opt')
sys.path.append('/lib/python')
import psycopg2
from psycopg2.extras import DictCursor
from get_secret import conn_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

def generate_prompt(details):
    logger.info('Generating prompt with details: %s', details)
    prompt = (
        f"Write an Instagram caption for a {details['industry']} specifically focused on {details['niche']}. "
        f"The vibe we want for the captions is {details['captionTone']}. The {details['industry']} should evoke "
        f"a feeling of {details['brandAssociation']}.\n\n"
        f"Generate an Instagram caption and hashtags with the following requirements:\n"
        f"1. Caption followed by #{details['companyName']}\n"
        f"2. Up to 10 hashtags optimized to appear on Instagram feeds that will target the {details['targetAudience']} target audience.\n"
        f"3. 200 characters or less\n"
        f"4. Follow the following output template: {details['captionFormatting']}"
    )
    return prompt

def normalize_weights(unique_selling_points):
    logger.info('Normalizing weights for unique selling points: %s', unique_selling_points)
    total_importance = sum(usp['importance'] for usp in unique_selling_points) + 5
    
    # Add "what's happening in the image" point
    unique_selling_points.append({'description': "what's happening in the image", 'importance': 5})
    
    for usp in unique_selling_points:
        usp['weight'] = usp['importance'] / total_importance
    logger.info('Normalized weights: %s', unique_selling_points)
    return unique_selling_points

def create_entry(details):
    logger.info('Starting create entry with details: %s', details)
    try:
        conn, cur = conn_database()
        logger.info('Connected to database')
    except Exception as e: 
        logger.error('Cannot connect to database: %s', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }

    details['uniqueSellingPoints'] = normalize_weights(details['uniqueSellingPoints'])
    prompt = generate_prompt(details)
    
    sql = """
    INSERT INTO company_metadata (
        company_id, company_name, industry, niche, location, target_audience, 
        feature_map, caption_tone, caption_formatting, brand_association, prompt
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    prompt_sql = """
    INSERT INTO prompt (
        company_id, platform, prompt
    ) VALUES (%s, %s, %s)
    """
    
    try:
        cur.execute(sql, (
            details['companyID'], details['companyName'], details['industry'], 
            details['niche'], details['location'], details['targetAudience'],
            json.dumps(details['uniqueSellingPoints']), details['captionTone'], 
            details['captionFormatting'], details['brandAssociation'], prompt
        ))

        cur.execute(prompt_sql, (
            details['companyID'], 'instagram', prompt
        ))

        conn.commit()
        logger.info('User details and prompt saved successfully')
        return {
            'statusCode': 200,
            'body': json.dumps('User details and prompt saved successfully')
        }
    except Exception as e:
        logger.error('Failed to insert data: %s', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()


def update_entry(details):
    logger.info('Starting update entry with details: %s', details)
    try:
        conn, cur = conn_database()
        logger.info('Connected to database')
    except Exception as e: 
        logger.error('Cannot connect to database: %s', str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to connect to the database'})
        }

    details['uniqueSellingPoints'] = normalize_weights(details['uniqueSellingPoints'])
    prompt = generate_prompt(details)
    
    sql = """
    UPDATE company_metadata SET 
        company_name=%s, industry=%s, niche=%s, location=%s, target_audience=%s, 
        feature_map=%s, caption_tone=%s, caption_formatting=%s, brand_association=%s, prompt=%s
    WHERE company_id=%s
    """
    prompt_sql = """
    UPDATE prompt SET 
        prompt=%s
    WHERE company_id=%s AND platform='instagram'
    """

    try:
        cur.execute(sql, (
            details['companyName'] or None, 
            details['industry'] or None, 
            details['niche'] or None, 
            details['location'] or None, 
            details['targetAudience'] or None, 
            json.dumps(details['uniqueSellingPoints']) if details['uniqueSellingPoints'] else None, 
            details['captionTone'] or None, 
            details['captionFormatting'] or None, 
            details['brandAssociation'] or None, 
            prompt or None, 
            details['companyID']
        ))

        cur.execute(prompt_sql, (
            prompt, details['companyID']
        ))

        conn.commit()
        logger.info('User details and prompt updated successfully')
        return {
            'statusCode': 200,
            'body': json.dumps('User details and prompt updated successfully')
        }
    except Exception as e:
        logger.error('Failed to update data: %s', str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()


def get_table(company_id):
    logger.info('Starting get table for company_id: %s', company_id)
    try:
        conn, cur = conn_database()
        logger.info('Connected to database')
    except Exception as e: 
        logger.error('Cannot connect to database: %s', e)
        if not conn or not cur:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Failed to connect to the database'})
            }
    logger.info('Got database connection')
    sql = """SELECT company_name, industry, niche, location, target_audience, 
            feature_map, caption_tone, caption_formatting, brand_association, prompt 
            FROM company_metadata WHERE company_id=%s"""
    try:
        cur.execute(sql, (company_id,))
        result = cur.fetchone()
        if result:
            logger.info('User details found: %s', result)
            return {
                'statusCode': 200,
                'body': json.dumps(result)
            }
        else:
            logger.info('User details not found for company_id: %s', company_id)
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'User details not found'})
            }
    except Exception as e:
        logger.error('Failed to fetch data: %s', e)
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
    logger.info('Received event: %s', event)
    try:
        method = event.get('requestContext', {}).get('http', {}).get('method')
        logger.info('HTTP Method: %s', method)

        if method == 'GET':
            logger.info(f'method is {method}')
            company_id = event.get('queryStringParameters', {}).get('company_id')
            if not company_id:
                logger.error('company_id is required for GET request')
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'company_id is required'})
                }
            response = get_table(company_id)
        elif method in ['POST', 'PUT']:
            logger.info(f'method is {method}')
            body = json.loads(event['body'])
            details = {
                'companyID': body.get('company_id'),
                'companyName': body.get('companyName', ''),
                'industry': body.get('industry', ''),
                'niche': body.get('niche', ''),
                'location': body.get('location', ''),
                'targetAudience': body.get('targetAudience', ''),
                'uniqueSellingPoints': body.get('uniqueSellingPoints', []),
                'captionTone': body.get('captionTone', ''),
                'captionFormatting': body.get('captionFormatting', ''),
                'brandAssociation': body.get('brandAssociation', '')
            }
            logger.info('Parsed details from request body: %s', details)

            if method == 'POST':
                response = create_entry(details)
            elif method == 'PUT':
                response = update_entry(details)
        else:
            logger.error('Method not allowed: %s', method)
            return {
                'statusCode': 405,
                'body': json.dumps('Method not allowed')
            }
    except Exception as e:
        logger.error('Error in request: %s', str(e))
        return {
            'statusCode': 400,
            'body': json.dumps(f'Error in request. Specific error: {str(e)}')
        }
    
    return response
