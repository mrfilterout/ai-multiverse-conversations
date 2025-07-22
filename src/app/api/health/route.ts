import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Quick database health check
    const { error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'error', message: error.message },
        { status: 503 }
      )
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Internal server error' },
      { status: 503 }
    )
  }
}