import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для работы с событиями из Telegram каналов"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            limit = int(params.get('limit', 50))
            priority = params.get('priority')
            
            query = """
                SELECT id, channel_id, channel_name, event_type, 
                       title, description, priority, message_id, detected_at
                FROM events
            """
            query_params = []
            
            if priority:
                query += " WHERE priority = %s"
                query_params.append(priority)
            
            query += " ORDER BY detected_at DESC LIMIT %s"
            query_params.append(limit)
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, query_params)
                events = cur.fetchall()
                
                for evt in events:
                    if evt['detected_at']:
                        evt['detected_at'] = evt['detected_at'].isoformat()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'events': events})
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO events (channel_id, channel_name, event_type, title, description, priority, message_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, channel_name, event_type, title, priority, detected_at
                """, (
                    data.get('channel_id'),
                    data.get('channel_name'),
                    data.get('event_type'),
                    data.get('title'),
                    data.get('description'),
                    data.get('priority', 'medium'),
                    data.get('message_id')
                ))
                new_event = cur.fetchone()
                
                if new_event['detected_at']:
                    new_event['detected_at'] = new_event['detected_at'].isoformat()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'event': new_event})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
