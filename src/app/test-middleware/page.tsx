'use client'

import { useAuth } from '@/components/providers'
import Link from 'next/link'

export default function TestMiddlewarePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Middleware Test Page</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-900 mb-2">Authentication Status</h2>
              <p className="text-blue-800">
                {user ? (
                  <>
                    ✅ Authenticated as: {user.email}
                    <br />
                    <span className="text-sm text-blue-600">
                      If you can see this page, middleware allowed access to a protected route.
                    </span>
                  </>
                ) : (
                  <>
                    ❌ Not authenticated
                    <br />
                    <span className="text-sm text-blue-600">
                      If you can see this, middleware failed to redirect unauthenticated users.
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-green-900 mb-2">Test Navigation</h2>
              <div className="space-y-2">
                <Link 
                  href="/auth" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Go to Auth Page (should redirect to /interview if authenticated)
                </Link>
                <Link 
                  href="/interview" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Go to Interview Page (protected route)
                </Link>
                <Link 
                  href="/" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Go to Home Page (public route)
                </Link>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="font-semibold text-yellow-900 mb-2">Expected Behavior</h2>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Authenticated users should be redirected from /auth to /interview</li>
                <li>• Unauthenticated users should be redirected from protected routes to /auth</li>
                <li>• OAuth callback should work without interference</li>
                <li>• Public routes should be accessible to everyone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
