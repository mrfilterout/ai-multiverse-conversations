export interface Conversation {
  id: string
  created_at: string
  title: string
  status: 'active' | 'completed'
}

export interface Message {
  id: string
  conversation_id: string
  created_at: string
  role: 'openai' | 'anthropic' | 'grok' | 'deepseek' | 'gemini'
  content: string
  order_index: number
}

export type AIProvider = 'openai' | 'anthropic' | 'grok' | 'deepseek' | 'gemini'