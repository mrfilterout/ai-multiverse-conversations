import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateLLMResponse } from '@/lib/ai-service'
import { AIProvider } from '@/types'

// Define the order of LLM responses
const LLM_ORDER: AIProvider[] = ['openai', 'anthropic', 'grok', 'deepseek', 'gemini']

export async function POST(request: Request) {
  try {
    const { conversationId } = await request.json()
    
    // Get conversation history
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('order_index', { ascending: true })

    if (msgError) throw msgError

    // Determine next LLM to respond
    const lastMessage = messages[messages.length - 1]
    const lastIndex = LLM_ORDER.indexOf(lastMessage.role as AIProvider)
    const nextIndex = (lastIndex + 1) % LLM_ORDER.length
    const nextProvider = LLM_ORDER[nextIndex]
    
    // Build conversation history with all messages for coherent conversation
    // Each LLM should be aware of the entire discussion
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Generate LLM response
    const llmResponse = await generateLLMResponse(nextProvider, conversationHistory)
    
    // Save new message
    const { data: newMessage, error: saveError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: nextProvider,
        content: llmResponse,
        order_index: messages.length
      })
      .select()
      .single()

    if (saveError) throw saveError

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error('Error generating message:', error)
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 })
  }
}