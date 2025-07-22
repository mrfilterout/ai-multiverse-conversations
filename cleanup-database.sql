-- ECHOCHAIN Database Cleanup Script
-- This will delete all existing conversations and messages

-- First, delete all messages (due to foreign key constraint)
DELETE FROM messages;

-- Then, delete all conversations
DELETE FROM conversations;

-- Optional: Reset the sequences if you want IDs to start fresh
-- Note: This is not necessary for UUIDs, only for serial IDs

-- Verify the cleanup
SELECT 'Conversations remaining:' as info, COUNT(*) as count FROM conversations
UNION ALL
SELECT 'Messages remaining:' as info, COUNT(*) as count FROM messages;