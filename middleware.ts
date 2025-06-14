import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname

  // Log all middleware calls for debugging
  console.log('🔧 Middleware called for:', pathname, {
    cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { session }, error } = await supabase.auth.getSession()

  const isAuthPage = pathname.startsWith('/auth')
  const isAuthCallback = pathname === '/auth/callback'
  const isPublicPage = pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/_next')
  const isProtectedPage = !isPublicPage && !isAuthPage

  console.log('🔧 Middleware analysis:', {
    pathname,
    authenticated: !!session,
    isAuthPage,
    isAuthCallback,
    isPublicPage,
    isProtectedPage,
    userEmail: session?.user?.email || 'none',
    authError: error?.message || 'none'
  })

  // Don't interfere with OAuth callback
  if (isAuthCallback) {
    return response
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthPage) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const destination = redirectTo && redirectTo !== '/auth' ? redirectTo : '/interview'
    console.log('Middleware: Redirecting authenticated user from auth to:', destination)
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Redirect unauthenticated users from protected pages to auth
  if (!session && isProtectedPage) {
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    console.log('Middleware: Redirecting unauthenticated user to auth with redirectTo:', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, and other static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Explicitly include API routes
    '/api/:path*',
  ],
}
