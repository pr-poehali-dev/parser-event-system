from telethon.sync import TelegramClient
from telethon.sessions import StringSession

api_id = input('Введите API ID: ')
api_hash = input('Введите API Hash: ')

with TelegramClient(StringSession(), api_id, api_hash) as client:
    print('\n=== СЕССИЯ СОЗДАНА ===')
    session_string = client.session.save()
    print(f'\nСкопируйте эту строку в секрет TELEGRAM_SESSION_STRING:\n')
    print(session_string)
    print('\n=====================\n')
