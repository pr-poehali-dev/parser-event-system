import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для работы с каналами Telegram парсера"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT id, name, username, status, category, 
                           total_messages, last_parsed_at, created_at
                    FROM channels 
                    ORDER BY total_messages DESC
                """)
                channels = cur.fetchall()
                
                for channel in channels:
                    if channel['last_parsed_at']:
                        channel['last_parsed_at'] = channel['last_parsed_at'].isoformat()
                    if channel['created_at']:
                        channel['created_at'] = channel['created_at'].isoformat()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'channels': channels})
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO channels (name, username, status, category)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, name, username, status, category, total_messages, created_at
                """, (
                    data.get('name'),
                    data.get('username'),
                    data.get('status', 'active'),
                    data.get('category')
                ))
                channel = cur.fetchone()
                
                if channel['created_at']:
                    channel['created_at'] = channel['created_at'].isoformat()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'channel': channel})
                }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            channel_id = data.get('id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    UPDATE channels 
                    SET status = %s, updated_at = NOW()
                    WHERE id = %s
                    RETURNING id, name, status
                """, (data.get('status'), channel_id))
                channel = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'channel': channel})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
