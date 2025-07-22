import { NextResponse } from 'next/server'
import { startNewConversation } from '@/lib/cron'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const result = await startNewConversation()
    return NextResponse.json({ success: true, conversation: result.conversation })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Failed to start conversation' }, { status: 500 })
  }
}