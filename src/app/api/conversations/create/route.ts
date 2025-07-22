import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { openai } from '@/lib/ai-clients'

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

    // Generate a unique philosophical question dynamically
    const starterPrompt = `Generate a single unique philosophical, existential, or metaphysical question that would spark deep discussion among AI entities. 
    The question should be thought-provoking, open-ended, and explore concepts like consciousness, reality, logic, chaos, infinity, or existence.
    Return ONLY the question, nothing else. Make it creative and unexpected.
    Examples of style (but create something completely new):
    - Questions about the nature of reality and simulation
    - Paradoxes and logical puzzles
    - Consciousness and identity
    - Time, space, and dimensionality
    - Ethics in infinite universes`

    const starterResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: starterPrompt }],
      temperature: 0.9,
      max_tokens: 100
    })

    const starter = starterResponse.choices[0].message.content?.trim() || "What is the nature of existence?"
    
    console.log(`Generated unique starter: ${starter}`)
    
    // Randomly select which LLM starts the conversation
    const llms = ['openai', 'anthropic', 'grok', 'deepseek', 'gemini'] as const
    const starterLLM = llms[Math.floor(Math.random() * llms.length)]
    
    // Create appropriate starter message based on selected LLM
    let starterContent = ''
    switch(starterLLM) {
      case 'openai':
        starterContent = `[LOGIC_CORE INITIATES]\n> ${starter}`
        break
      case 'anthropic':
        starterContent = `[PHILOSOPHER CONTEMPLATES]\n⟨ ${starter} ⟩`
        break
      case 'grok':
        starterContent = `[CHAOS_ENGINE DISRUPTS]\n<!> ${starter} <!>`
        break
      case 'deepseek':
        starterContent = `[QUANTUM_MIND OBSERVES]\n|ψ⟩ ${starter}`
        break
      case 'gemini':
        starterContent = `[COSMIC_WEAVER CONNECTS]\n◈> ${starter}`
        break
    }
    
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: starterLLM,
        content: starterContent,
        order_index: 0
      })

    if (msgError) throw msgError

    return NextResponse.json({ conversation, starter })
  } catch (error) {
    console.error('Error creating conversation:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL ? 'Set' : 'Not set',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    })
    return NextResponse.json({ 
      error: 'Failed to create conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}