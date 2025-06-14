'use client'

import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useState } from 'react'

export default function AuthTestPage() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [cookieInfo, setCookieInfo] = useState<string>('')

  const checkSession = async () => {
    const supabase = createSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    setSessionInfo({ session, error })
  }

  const checkCookies = () => {
    setCookieInfo(document.cookie)
  }

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/debug/sessions')
      const data = await response.json()
      console.log('API Response:', response.status, data)
    } catch (error) {
      console.error('API Error:', error)
    }
  }

  const signOut = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Auth Context (Client-side)</h2>
          <pre className="text-sm bg-white p-2 rounded">
            {JSON.stringify({ user: user ? { id: user.id, email: user.email } : null }, null, 2)}
          </pre>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Supabase Session</h2>
          <button 
            onClick={checkSession}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Check Session
          </button>
          {sessionInfo && (
            <pre className="text-sm bg-white p-2 rounded">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Browser Cookies</h2>
          <button 
            onClick={checkCookies}
            className="bg-yellow-500 text-white px-4 py-2 rounded mb-2"
          >
            Check Cookies
          </button>
          {cookieInfo && (
            <pre className="text-sm bg-white p-2 rounded break-all">
              {cookieInfo || 'No cookies found'}
            </pre>
          )}
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">API Test</h2>
          <button
            onClick={testApiCall}
            className="bg-red-500 text-white px-4 py-2 rounded mb-2"
          >
            Test API Call (Check Console)
          </button>
          <p className="text-sm text-gray-600">
            This will call /api/debug/sessions and log the result to console
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Authentication Actions</h2>
          <button
            onClick={signOut}
            className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
          >
            Sign Out & Go to Auth
          </button>
          <p className="text-sm text-gray-600">
            This will sign you out and redirect to the auth page to log in again
          </p>
        </div>
      </div>
    </div>
  )
}
