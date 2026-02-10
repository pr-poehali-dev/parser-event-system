-- Add hashtags column and search indexes to existing events table
ALTER TABLE t_p88908086_parser_event_system.events 
ADD COLUMN IF NOT EXISTS hashtags TEXT[];

-- Add category column for categorization
ALTER TABLE t_p88908086_parser_event_system.events 
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Add metrics columns
ALTER TABLE t_p88908086_parser_event_system.events 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

ALTER TABLE t_p88908086_parser_event_system.events 
ADD COLUMN IF NOT EXISTS reactions INTEGER DEFAULT 0;

-- Create indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_events_category ON t_p88908086_parser_event_system.events(category);
CREATE INDEX IF NOT EXISTS idx_events_priority ON t_p88908086_parser_event_system.events(priority);
CREATE INDEX IF NOT EXISTS idx_events_detected_at ON t_p88908086_parser_event_system.events(detected_at DESC);

-- Create GIN index for hashtags array for fast hashtag search
CREATE INDEX IF NOT EXISTS idx_events_hashtags ON t_p88908086_parser_event_system.events USING GIN(hashtags);

-- Add indexes for full-text search on title and description
CREATE INDEX IF NOT EXISTS idx_events_title_search ON t_p88908086_parser_event_system.events USING GIN(to_tsvector('russian', title));
CREATE INDEX IF NOT EXISTS idx_events_description_search ON t_p88908086_parser_event_system.events USING GIN(to_tsvector('russian', COALESCE(description, '')));

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_events_category_priority ON t_p88908086_parser_event_system.events(category, priority);
CREATE INDEX IF NOT EXISTS idx_events_detected_priority ON t_p88908086_parser_event_system.events(detected_at DESC, priority);