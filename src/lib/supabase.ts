import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createSupabaseClient = () => createClientComponentClient()

// Server component client - will be used in API routes and server components
export const createSupabaseServerClient = async () => {
  const { cookies } = await import('next/headers')
  return createServerComponentClient({ cookies })
}

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
