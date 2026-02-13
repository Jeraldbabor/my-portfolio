-- Add source column to distinguish AI auto-replies from admin (Telegram) replies
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS source TEXT DEFAULT NULL;

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_source ON chat_messages(source);
