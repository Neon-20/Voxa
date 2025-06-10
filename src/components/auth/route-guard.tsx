'use client'

import { useAuth } from '@/components/providers'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Mic } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function RouteGuard({
  children,
  requireAuth = true,
  redirectTo = '/auth'
}: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    // Check if this is an OAuth success redirect
    const isOAuthSuccess = searchParams.get('oauth_success') === 'true'

    // Add a longer delay for OAuth success to allow auth state to settle
    const delay = isOAuthSuccess ? 300 : 100

    const timer = setTimeout(() => {
      setInitialCheckDone(true)

      // Clean up OAuth success parameter
      if (isOAuthSuccess) {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('oauth_success')
        window.history.replaceState({}, '', newUrl.toString())
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [searchParams])

  useEffect(() => {
    if (!loading && initialCheckDone) {
      if (requireAuth && !user) {
        // User needs to be authenticated but isn't
        console.log('RouteGuard: Redirecting unauthenticated user to auth')
        setIsRedirecting(true)
        const redirectUrl = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`
        router.push(redirectUrl)
      } else if (!requireAuth && user && pathname.startsWith('/auth')) {
        // User is authenticated but on auth page
        console.log('RouteGuard: Redirecting authenticated user away from auth')
        setIsRedirecting(true)

        // Check for redirect destination in URL params
        const redirectDestination = searchParams.get('redirectTo')
        const destination = redirectDestination && redirectDestination !== '/auth' ? redirectDestination : '/interview'

        router.push(destination)
      }
    }
  }, [user, loading, requireAuth, redirectTo, pathname, router, searchParams, initialCheckDone])

  // Show loading state while checking authentication or during redirects
  if (loading || !initialCheckDone || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mic className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {isRedirecting ? 'Redirecting...' : 'Loading Voxa'}
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render children
  // (redirect will happen in useEffect)
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mic className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">Redirecting...</div>
          <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Render children if all checks pass
  return <>{children}</>
}
