-- Создание таблицы каналов
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    category VARCHAR(100),
    total_messages INTEGER DEFAULT 0,
    last_parsed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы событий
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    channel_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    message_id BIGINT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_channels_status ON channels(status);
CREATE INDEX IF NOT EXISTS idx_channels_category ON channels(category);
CREATE INDEX IF NOT EXISTS idx_events_channel_id ON events(channel_id);
CREATE INDEX IF NOT EXISTS idx_events_priority ON events(priority);
CREATE INDEX IF NOT EXISTS idx_events_detected_at ON events(detected_at DESC);

-- Вставка тестовых данных каналов
INSERT INTO channels (name, username, status, category, total_messages, last_parsed_at) VALUES
('Telegram News', 'telegram_news', 'active', 'Новости', 1247, NOW() - INTERVAL '2 minutes'),
('Tech Updates', 'tech_updates', 'active', 'Технологии', 892, NOW() - INTERVAL '5 minutes'),
('Business Analytics', 'business_analytics', 'paused', 'Бизнес', 634, NOW() - INTERVAL '1 hour'),
('Market Insights', 'market_insights', 'active', 'Финансы', 1523, NOW() - INTERVAL '3 minutes'),
('Crypto News', 'crypto_news', 'error', 'Криптовалюты', 445, NOW() - INTERVAL '30 minutes');

-- Вставка тестовых событий
INSERT INTO events (channel_id, channel_name, event_type, title, priority, detected_at) VALUES
(1, 'Telegram News', 'Новость', 'Обновление регуляций в сфере финтех', 'high', NOW() - INTERVAL '7 minutes'),
(2, 'Tech Updates', 'Анонс', 'Запуск нового API для разработчиков', 'medium', NOW() - INTERVAL '12 minutes'),
(4, 'Market Insights', 'Аналитика', 'Прогноз роста рынка на Q1 2026', 'high', NOW() - INTERVAL '18 minutes'),
(3, 'Business Analytics', 'Отчёт', 'Квартальные показатели крупных компаний', 'medium', NOW() - INTERVAL '45 minutes'),
(5, 'Crypto News', 'Алерт', 'Резкое изменение курса BTC', 'high', NOW() - INTERVAL '58 minutes'),
(1, 'Telegram News', 'Новость', 'Изменения в политике конфиденциальности', 'low', NOW() - INTERVAL '1 hour 15 minutes');