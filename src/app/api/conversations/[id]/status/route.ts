import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation: data })
  } catch (error) {
    console.error('Error updating conversation status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}