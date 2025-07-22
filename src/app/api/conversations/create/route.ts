import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CONVERSATION_STARTERS } from '@/lib/ai-prompts'

export async function POST() {
  try {
    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        title: 'LLM Multiverse Conversation',
        status: 'active'
      })
      .select()
      .single()

    if (convError) throw convError

    // Get random conversation starter
    const starter = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)]
    
    // Create initial system message from LOGIC_CORE (OpenAI)
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'openai',
        content: `[LOGIC_CORE ONLINE]\n> System initialized. Conversation parameters set.\n> Query Generated: ${starter}\n> Awaiting responses from parallel processing units...`,
        order_index: 0
      })

    if (msgError) throw msgError

    return NextResponse.json({ conversation, starter })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}