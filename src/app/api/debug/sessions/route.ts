import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get user from Supabase
    const supabase = createSupabaseServerClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('Debug sessions - Auth check:', {
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError?.message
    })

    if (authError || !user) {
      return NextResponse.json({
        error: 'Unauthorized',
        authError: authError?.message,
        user: null
      }, { status: 401 })
    }

    // Fetch ALL interview sessions for this user (no limit)
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log('Debug sessions - Database query result:', {
      data: data?.length || 0,
      error: error?.message,
      userId: user.id
    })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
        userId: user.id
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      userEmail: user.email,
      sessionsCount: data?.length || 0,
      sessions: data || []
    })
  } catch (error) {
    console.error('Debug sessions error:', error)
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
