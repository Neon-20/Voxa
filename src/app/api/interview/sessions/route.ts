import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Get user from Supabase
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's interview sessions
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch interview sessions')
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Interview sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview sessions' },
      { status: 500 }
    )
  }
}
