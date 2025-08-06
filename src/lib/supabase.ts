import { createClient } from '@supabase/supabase-js'

// Supabase configuration - NEW PROJECT
const supabaseUrl = 'https://pxfxpbobbhfwfxshokho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTMzNzAsImV4cCI6MjA3MDA4OTM3MH0.F3twFsyaEXUYflg0-jFJ49vnBe_KTUL7208xwV3bWZU'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (you can generate these from Supabase CLI)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'student' | 'admin' | 'instructor'
          department?: string
          employee_id?: string
          phone?: string
          is_active: boolean
          last_login?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'student' | 'admin' | 'instructor'
          department?: string
          employee_id?: string
          phone?: string
          is_active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'student' | 'admin' | 'instructor'
          department?: string
          employee_id?: string
          phone?: string
          is_active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title: string
          description?: string
          instructions?: string
          category_id?: string
          duration: number
          passing_score: number
          max_attempts?: number
          is_active: boolean
          is_published: boolean
          shuffle_questions: boolean
          shuffle_options: boolean
          show_results_immediately: boolean
          allow_review: boolean
          start_date?: string
          end_date?: string
          created_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          instructions?: string
          category_id?: string
          duration?: number
          passing_score?: number
          max_attempts?: number
          is_active?: boolean
          is_published?: boolean
          shuffle_questions?: boolean
          shuffle_options?: boolean
          show_results_immediately?: boolean
          allow_review?: boolean
          start_date?: string
          end_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructions?: string
          category_id?: string
          duration?: number
          passing_score?: number
          max_attempts?: number
          is_active?: boolean
          is_published?: boolean
          shuffle_questions?: boolean
          shuffle_options?: boolean
          show_results_immediately?: boolean
          allow_review?: boolean
          start_date?: string
          end_date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
  }
}

// Helper functions for common operations
export const authHelpers = {
  // Sign up new user
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database helpers
export const dbHelpers = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Get published exams
  getPublishedExams: async () => {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get exam by ID
  getExamById: async (examId: string) => {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        questions (
          *,
          question_options (*)
        )
      `)
      .eq('id', examId)
      .single()
    return { data, error }
  }
}

export default supabase