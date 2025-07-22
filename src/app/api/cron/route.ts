import { NextResponse } from 'next/server'
import { startNewConversation } from '@/lib/cron'

export async function GET(request: Request) {
  // For now, skip authentication for cron jobs
  // Vercel automatically protects cron endpoints
  console.log('Cron job triggered at:', new Date().toISOString())
  
  try {
    const result = await startNewConversation()
    return NextResponse.json({ success: true, conversation: result.conversation })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Failed to start conversation' }, { status: 500 })
  }
}