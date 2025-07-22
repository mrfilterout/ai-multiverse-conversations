import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Add cache headers for conversation list
    const response = NextResponse.json({ conversations })
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
    return response
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}