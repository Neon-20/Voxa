'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mic } from 'lucide-react'

export function OAuthLoading() {
  const searchParams = useSearchParams()
  const [isOAuthFlow, setIsOAuthFlow] = useState(false)

  useEffect(() => {
    // Check if we're in an OAuth flow
    const hasOAuthSuccess = searchParams.get('oauth_success') === 'true'
    const hasHash = window.location.hash.length > 0
    const isAuthPage = window.location.pathname.startsWith('/auth')
    
    if ((hasOAuthSuccess || hasHash) && isAuthPage) {
      setIsOAuthFlow(true)
      
      // Hide the loading after a short delay
      const timer = setTimeout(() => {
        setIsOAuthFlow(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!isOAuthFlow) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mic className="h-8 w-8 text-white animate-pulse" />
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-2">Completing Sign In...</div>
        <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
        <p className="text-sm text-gray-600 mt-4">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
