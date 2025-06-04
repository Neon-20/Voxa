'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const router = useRouter()
  const supabase = createSupabaseClient()

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

        console.log('Login successful, redirecting to interview...')
        toast.success('Welcome back!')

        // Wait a bit for auth state to update, then redirect
        setTimeout(() => {
          console.log('Attempting redirect to interview...')
          try {
            router.replace('/interview')
            console.log('Router.replace called')
          } catch (routerError) {
            console.error('Router error:', routerError)
            console.log('Using window.location fallback')
            window.location.href = '/interview'
          }
        }, 500)
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
            <div className="group flex items-center space-x-3 transition-all duration-300">
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

                {/* AI Status Indicator */}
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    Voxa
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium -mt-0.5 tracking-wide">
                  Mock Interview AI
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get started with your voice AI mock interview practice
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500"
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
