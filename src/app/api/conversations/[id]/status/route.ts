import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation: data })
  } catch (error) {
    console.error('Error updating conversation status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}