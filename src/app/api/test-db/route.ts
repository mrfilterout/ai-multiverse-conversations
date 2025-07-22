import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false,
        error: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL ? 'Set' : 'Not set',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful',
      hasData: data && data.length > 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL ? 'Set' : 'Not set',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}