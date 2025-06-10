'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/components/providers'

export function AuthDebug() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [currentUrl, setCurrentUrl] = useState<string>('Loading...')
  const [mounted, setMounted] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Set mounted flag to avoid hydration issues
    setMounted(true)

    const getSessionInfo = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({ session, error })
    }

    // Set current URL on client side only
    setCurrentUrl(window.location.href)

    getSessionInfo()
  }, [supabase])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? 'Authenticated' : 'Not authenticated'}</div>
        <div>Email: {user?.email || 'None'}</div>
        <div>Session: {sessionInfo?.session ? 'Active' : 'None'}</div>
        <div>Current URL: {currentUrl}</div>
        <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</div>
        {sessionInfo?.error && (
          <div className="text-red-300">Error: {sessionInfo.error.message}</div>
        )}
      </div>
    </div>
  )
}
