import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single()

    if (convError) throw convError

    // Get messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('order_index', { ascending: true })

    if (msgError) throw msgError

    // Add cache headers for individual conversations
    const response = NextResponse.json({ conversation, messages })
    // Cache completed conversations longer than active ones
    if (conversation.status === 'completed') {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=10')
    }
    return response
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}