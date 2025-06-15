'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const supabase = createSupabaseClient()

  // Check for OAuth errors and redirect parameters
  useEffect(() => {
    const error = searchParams.get('error')
    const details = searchParams.get('details')

    if (error) {
      console.error('OAuth error from URL:', { error, details })
      let errorMessage = 'Authentication failed'

      switch (error) {
        case 'oauth_error':
          errorMessage = 'OAuth authentication failed'
          break
        case 'oauth_exception':
          errorMessage = 'OAuth authentication exception'
          break
        default:
          errorMessage = `Authentication error: ${error}`
      }

      if (details) {
        errorMessage += `: ${decodeURIComponent(details)}`
      }

      toast.error(errorMessage)

      // Clean up URL parameters
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('details')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  // Get redirect destination
  const getRedirectDestination = () => {
    const redirectTo = searchParams.get('redirectTo')
    return redirectTo && redirectTo !== '/auth' ? redirectTo : '/interview'
  }

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setSocialLoading(provider)

    try {
      console.log(`Starting ${provider} OAuth flow...`)
      const redirectDestination = getRedirectDestination()
      const callbackUrl = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectDestination)}`
      console.log('Redirect URL:', callbackUrl)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
        },
      })

      console.log('OAuth response:', { data, error })

      if (error) throw error

      // The redirect will happen automatically, so we don't need to handle success here
    } catch (error: unknown) {
      console.error('OAuth error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast.error(`Failed to sign in with ${provider}: ${errorMessage}`)
      setSocialLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Auth form submitted:', { email, isSignUp })

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        
        if (error) throw error

        toast.success('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        console.log('Login successful, letting middleware handle redirect')
        toast.success('Welcome back!')

        // Let middleware handle the redirect after auth state updates
        // No manual redirect needed
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Voxa Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="group flex items-center space-x-3 transition-all duration-300 cursor-pointer">
              <div className="relative">
                {/* Modern Geometric Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Sound wave pattern */}
                  <div className="relative flex items-center space-x-0.5">
                    <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-0.5 h-4 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-0.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                    <div className="w-0.5 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                  </div>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 group-hover:from-purple-300/30 group-hover:to-indigo-500/30 transition-all duration-500"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    Voxa
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium -mt-0.5 tracking-wide">
                  AI Mock Interviewer
                </span>
              </div>
            </Link>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get started with your voice AI mock interview practice
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={socialLoading !== null || isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {socialLoading === 'google' ? (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('github')}
            disabled={socialLoading !== null || isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {socialLoading === 'github' ? (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required={isSignUp}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-200"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
