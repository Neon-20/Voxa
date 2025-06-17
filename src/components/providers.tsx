'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Check for guest mode first
    const checkGuestMode = () => {
      if (typeof window !== 'undefined') {
        const guestMode = localStorage.getItem('voxa_guest_mode')
        console.log('Checking guest mode:', guestMode)
        if (guestMode === 'true') {
          console.log('Guest mode detected, setting isGuest to true')
          setIsGuest(true)
          setLoading(false)
          return true
        }
      }
      return false
    }

    // If in guest mode, skip Supabase auth
    if (checkGuestMode()) {
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        console.log('Initial session check:', session ? 'authenticated' : 'not authenticated', {
          user: session?.user?.email || 'none',
          expires: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none'
        })
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Session check failed:', error)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'authenticated' : 'not authenticated', {
          user: session?.user?.email || 'none',
          timestamp: new Date().toISOString()
        })
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle automatic redirects after authentication
        if (event === 'SIGNED_IN' && session) {
          console.log('Sign in detected, handling redirect')

          // Check if we're on the auth page (but not callback)
          if (window.location.pathname.startsWith('/auth') && window.location.pathname !== '/auth/callback') {
            // Get redirect destination from URL params
            const urlParams = new URLSearchParams(window.location.search)
            const redirectTo = urlParams.get('redirectTo')
            const destination = redirectTo && redirectTo !== '/auth' ? redirectTo : '/interview'

            console.log('Redirecting authenticated user to:', destination)
            // Use replace instead of href to avoid history entry
            window.location.replace(destination)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Listen for guest mode changes
  useEffect(() => {
    const handleStorageChange = () => {
      const guestMode = localStorage.getItem('voxa_guest_mode')
      console.log('Storage change detected, guest mode:', guestMode)
      if (guestMode === 'true' && !isGuest) {
        console.log('Setting guest mode to true')
        setIsGuest(true)
        setUser(null)
        setLoading(false)
      } else if (guestMode !== 'true' && isGuest) {
        console.log('Setting guest mode to false')
        setIsGuest(false)
      }
    }

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isGuest])

  const signOut = async () => {
    try {
      if (isGuest) {
        // Clear guest mode
        localStorage.removeItem('voxa_guest_mode')
        document.cookie = 'voxa_guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        setIsGuest(false)
      } else {
        await supabase.auth.signOut()
        // Clear user state immediately
        setUser(null)
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isGuest,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
