import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const redirectTo = requestUrl.searchParams.get('redirectTo')
  const origin = requestUrl.origin

  console.log('OAuth callback received:', {
    url: requestUrl.toString(),
    code: code ? 'present' : 'missing',
    error: error || 'none',
    redirectTo: redirectTo || 'none'
  })

  if (error) {
    console.error('OAuth error from provider:', error)
    return NextResponse.redirect(`${origin}/auth?error=${error}`)
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()

      console.log('Attempting to exchange code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(`${origin}/auth?error=oauth_error&details=${encodeURIComponent(error.message)}`)
      }

      console.log('OAuth success, session created:', data.session ? 'yes' : 'no')

      // Determine redirect destination
      const destination = redirectTo && redirectTo !== '/auth' ? redirectTo : '/interview'
      console.log('Redirecting to:', destination)

      // Add a flag to indicate this is coming from OAuth callback
      const redirectUrl = new URL(destination, origin)
      redirectUrl.searchParams.set('oauth_success', 'true')

      // Create response with redirect
      const response = NextResponse.redirect(redirectUrl)

      // Set session cookies manually to ensure they're available immediately
      if (data.session) {
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      }

      return response
    } catch (error) {
      console.error('OAuth callback exception:', error)
      return NextResponse.redirect(`${origin}/auth?error=oauth_exception&details=${encodeURIComponent(String(error))}`)
    }
  }

  // No code parameter - redirect to auth page
  console.log('No code parameter found, redirecting to auth')
  return NextResponse.redirect(`${origin}/auth`)
}
