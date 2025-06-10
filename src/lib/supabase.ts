import { createClient } from '@supabase/supabase-js'

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

// Server component client - for API routes and server components
export const createSupabaseServerClient = async () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
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
