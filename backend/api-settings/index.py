import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления настройками парсера Telegram'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute('SELECT setting_key, setting_value, description FROM parser_settings ORDER BY id')
            rows = cur.fetchall()
            
            settings = {}
            for key, value, description in rows:
                settings[key] = {
                    'value': value,
                    'description': description
                }

            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'settings': settings})
            }

        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            updates = body.get('settings', {})

            if not updates:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No settings provided'})
                }

            for key, value in updates.items():
                cur.execute(
                    'UPDATE parser_settings SET setting_value = %s, updated_at = CURRENT_TIMESTAMP WHERE setting_key = %s',
                    (str(value), key)
                )

            conn.commit()
            cur.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'updated': len(updates)})
            }

        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }

    except Exception as e:
        if conn:
            conn.rollback()
            cur.close()
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
