"""
Скрипт для генерации Telegram Session String
Запустите локально на своём компьютере для получения session_string

Требования:
1. Python 3.8+
2. pip install telethon

Инструкция:
1. Установите библиотеку: pip install telethon
2. Запустите скрипт: python generate_telegram_session.py
3. Введите API_ID и API_HASH из https://my.telegram.org
4. Введите номер телефона в международном формате (+7...)
5. Введите код из Telegram
6. Скопируйте полученный SESSION_STRING в секреты проекта
"""

from telethon.sync import TelegramClient
from telethon.sessions import StringSession

print("=" * 60)
print("Генератор Telegram Session String")
print("=" * 60)
print()

# Запрос учетных данных
api_id = input("Введите TELEGRAM_API_ID: ").strip()
api_hash = input("Введите TELEGRAM_API_HASH: ").strip()

if not api_id or not api_hash:
    print("\n❌ Ошибка: API_ID и API_HASH обязательны!")
    print("Получите их на https://my.telegram.org/auth")
    exit(1)

print("\n📱 Начинаем авторизацию...")
print("Будет запрошен номер телефона и код из Telegram")
print()

try:
    # Создаём клиент с пустой сессией
    with TelegramClient(StringSession(), api_id, api_hash) as client:
        # Запрашиваем авторизацию
        print("✅ Авторизация прошла успешно!")
        print()
        
        # Получаем session string
        session_string = client.session.save()
        
        print("=" * 60)
        print("🎉 SESSION STRING УСПЕШНО СОЗДАН!")
        print("=" * 60)
        print()
        print("📋 Скопируйте этот SESSION_STRING:")
        print()
        print(session_string)
        print()
        print("=" * 60)
        print()
        print("📝 Что делать дальше:")
        print("1. Скопируйте строку выше")
        print("2. Откройте https://poehali.dev в редакторе проекта")
        print("3. Попросите Юру: 'Добавь секрет TELEGRAM_SESSION_STRING'")
        print("4. Вставьте скопированную строку в секрет")
        print("5. Парсер готов к работе! 🚀")
        print()

except Exception as e:
    print(f"\n❌ Ошибка: {e}")
    print("\nПроверьте:")
    print("- Правильность API_ID и API_HASH")
    print("- Интернет соединение")
    print("- Что библиотека telethon установлена (pip install telethon)")
