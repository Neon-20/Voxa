import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Sessions API: Request received', {
      url: request.url,
      cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
      cookieNames: request.cookies.getAll().map(c => c.name)
    })

    // Get user from Supabase
    const supabase = createSupabaseServerClient(request)

    // Try both getUser and getSession methods
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    console.log('Sessions API: Auth check result', {
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError?.message || null,
      session: session ? { user: session.user?.email, expires: session.expires_at } : null,
      sessionError: sessionError?.message || null
    })

    // TEMPORARY: For debugging, return empty array if no auth
    if ((authError || !user) && (sessionError || !session)) {
      console.log('Sessions API: No auth found, returning empty array for debugging')
      return NextResponse.json([])
    }

    // Use user from either method
    const finalUser = user || session?.user
    if (!finalUser) {
      console.log('Sessions API: No user found in either method')
      return NextResponse.json(
        { error: 'No user found' },
        { status: 401 }
      )
    }

    // Fetch user's interview sessions
    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('user_id', finalUser.id)
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
