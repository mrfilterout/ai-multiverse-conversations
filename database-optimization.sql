-- Database Optimization for High Traffic
-- Run these commands in Supabase SQL Editor

-- 1. Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_index ON messages(conversation_id, order_index);

-- 2. Enable Row Level Security (if not already enabled)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for read-only access (since no auth is required)
CREATE POLICY "Allow public read access on conversations" ON conversations
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on messages" ON messages
  FOR SELECT USING (true);

-- 4. Analyze tables for query optimization
ANALYZE conversations;
ANALYZE messages;

-- 5. Optional: Create a materialized view for conversation summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS conversation_summaries AS
SELECT 
  c.id,
  c.created_at,
  c.title,
  c.status,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_at
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.created_at, c.title, c.status;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_created_at 
  ON conversation_summaries(created_at DESC);

-- Refresh materialized view (run this periodically or after new conversations)
-- REFRESH MATERIALIZED VIEW conversation_summaries;