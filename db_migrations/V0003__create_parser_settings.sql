CREATE TABLE parser_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO parser_settings (setting_key, setting_value, description) VALUES
('auto_parse_enabled', 'false', 'Автоматический парсинг каналов'),
('parse_interval_minutes', '5', 'Интервал парсинга в минутах'),
('messages_per_parse', '50', 'Количество сообщений за один парсинг'),
('keywords_filter', '', 'Ключевые слова для фильтрации (через запятую)'),
('priority_keywords', '', 'Ключевые слова для высокого приоритета'),
('min_message_length', '10', 'Минимальная длина сообщения для сохранения');
