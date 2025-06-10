'use client'

import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function DebugAuthPage() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [cookies, setCookies] = useState<string>('')
  const supabase = createSupabaseClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({ session, error })
    }
    
    checkSession()
    setCookies(document.cookie)
  }, [supabase])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleClearStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Auth Debug Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auth Provider State */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-900 mb-3">Auth Provider State</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                <div><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</div>
                <div><strong>Email:</strong> {user?.email || 'None'}</div>
                <div><strong>User ID:</strong> {user?.id || 'None'}</div>
                <div><strong>Created:</strong> {user?.created_at || 'None'}</div>
              </div>
            </div>

            {/* Supabase Session */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-green-900 mb-3">Supabase Session</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Session:</strong> {sessionInfo?.session ? 'Active' : 'None'}</div>
                <div><strong>Access Token:</strong> {sessionInfo?.session?.access_token ? 'Present' : 'None'}</div>
                <div><strong>Refresh Token:</strong> {sessionInfo?.session?.refresh_token ? 'Present' : 'None'}</div>
                <div><strong>Expires:</strong> {sessionInfo?.session?.expires_at ? new Date(sessionInfo.session.expires_at * 1000).toLocaleString() : 'None'}</div>
                {sessionInfo?.error && (
                  <div className="text-red-600"><strong>Error:</strong> {sessionInfo.error.message}</div>
                )}
              </div>
            </div>

            {/* Browser Info */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="font-semibold text-yellow-900 mb-3">Browser Info</h2>
              <div className="space-y-2 text-sm">
                <div><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
                <div><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}</div>
                <div><strong>Search:</strong> {typeof window !== 'undefined' ? window.location.search : 'SSR'}</div>
                <div><strong>Hash:</strong> {typeof window !== 'undefined' ? window.location.hash : 'SSR'}</div>
              </div>
            </div>

            {/* Cookies */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h2 className="font-semibold text-purple-900 mb-3">Cookies</h2>
              <div className="text-sm">
                <div className="max-h-32 overflow-y-auto bg-white p-2 rounded border">
                  {cookies || 'No cookies found'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={handleClearStorage}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear Storage & Cookies
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Debug Steps:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Check if both "Auth Provider State" and "Supabase Session" show authentication</li>
              <li>Look for any hash (#) in the URL that might be causing issues</li>
              <li>Check browser console for middleware logs</li>
              <li>Try signing out and signing in again</li>
              <li>If issues persist, clear storage and try again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
