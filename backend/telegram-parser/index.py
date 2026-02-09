import json
import os
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для парсинга сообщений из Telegram каналов в реальном времени'''
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

    api_id = os.environ.get('TELEGRAM_API_ID')
    api_hash = os.environ.get('TELEGRAM_API_HASH')
    session_string = os.environ.get('TELEGRAM_SESSION_STRING', '')
    db_url = os.environ.get('DATABASE_URL')

    if method == 'GET':
        action = event.get('queryStringParameters', {}).get('action', 'status')

        if action == 'status':
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            cur.execute('SELECT COUNT(*) FROM channels WHERE status = %s', ('active',))
            active_count = cur.fetchone()[0]
            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'status': 'configured' if session_string else 'not_configured',
                    'active_channels': active_count,
                    'has_credentials': bool(api_id and api_hash),
                    'has_session': bool(session_string)
                })
            }

        elif action == 'parse':
            if not api_id or not api_hash:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Telegram API credentials not configured'})
                }

            channel_id = event.get('queryStringParameters', {}).get('channel_id')
            if not channel_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'channel_id required'})
                }

            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            cur.execute('SELECT username FROM channels WHERE id = %s', (channel_id,))
            result = cur.fetchone()
            
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Channel not found'})
                }

            username = result[0]

            if not session_string:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Session not configured. Please authorize first.'})
                }

            try:
                client = TelegramClient(StringSession(session_string), int(api_id), api_hash)
                client.connect()

                if not client.is_user_authorized():
                    client.disconnect()
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Session expired. Please re-authorize.'})
                    }

                messages = client.get_messages(username, limit=10)
                parsed_count = 0

                for msg in messages:
                    if msg.text:
                        cur.execute('''
                            INSERT INTO events (channel_id, channel_name, event_type, title, description, priority, message_id, detected_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (channel_id, message_id) DO NOTHING
                        ''', (
                            channel_id,
                            username,
                            'Сообщение',
                            msg.text[:100],
                            msg.text if len(msg.text) > 100 else None,
                            'medium',
                            msg.id,
                            msg.date
                        ))
                        parsed_count += 1

                cur.execute(
                    'UPDATE channels SET last_parsed_at = %s, total_messages = total_messages + %s WHERE id = %s',
                    (datetime.now(), parsed_count, channel_id)
                )
                conn.commit()
                cur.close()
                conn.close()
                client.disconnect()

                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'parsed_messages': parsed_count,
                        'channel': username
                    })
                }

            except Exception as e:
                if conn:
                    conn.rollback()
                    cur.close()
                    conn.close()
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Failed to parse: {str(e)}'})
                }

    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')

        if action == 'auth':
            phone = body.get('phone')
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone number required'})
                }

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Authorization requires interactive session. Please use local script to generate session string.',
                    'instructions': 'Run: python generate_session.py'
                })
            }

    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }