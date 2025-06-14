import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton client to prevent multiple instances
let clientInstance: ReturnType<typeof createClient> | null = null

// Client component client (singleton pattern)
export const createSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    if (!clientInstance) {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    }
    return clientInstance
  }

  // For SSR, create new instance each time
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server client for API routes - requires request object
export const createSupabaseServerClient = (request: NextRequest) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(_cookiesToSet) {
        // For API routes, we can't set cookies directly in the request
        // The middleware should handle cookie setting
        // This is a no-op for API routes
      },
    },
  })
}

// Service client for admin operations (bypasses RLS)
export const createSupabaseServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Legacy export for backward compatibility
export const supabase = createSupabaseClient()

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          original_content: string
          improved_content: string | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_content: string
          improved_content?: string | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          improved_content?: string | null
          feedback?: string | null
          updated_at?: string
        }
      }
      mock_interviews: {
        Row: {
          id: string
          user_id: string
          role: string
          transcript: string | null
          feedback: string | null
          score: number | null
          duration: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          transcript?: string | null
          feedback?: string | null
          score?: number | null
          duration?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          transcript?: string | null
          feedback?: string | null
          score?: number | null
          duration?: number | null
          status?: string
        }
      }
      career_qas: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          answer: string
          category?: string | null
          created_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
        }
      }
      voice_sessions: {
        Row: {
          id: string
          user_id: string
          session_type: string
          transcript: string | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_type: string
          transcript?: string | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          transcript?: string | null
          duration?: number | null
        }
      }
      roadmaps: {
        Row: {
          id: string
          user_id: string | null
          role: string
          content: string
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          role: string
          content: string
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          is_featured?: boolean
          updated_at?: string
        }
      }
    }
  }
}
