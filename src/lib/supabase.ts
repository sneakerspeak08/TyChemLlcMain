import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we're in development and missing env vars
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback mode.')
  
  // Create a mock client for development
  const mockClient = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error('Supabase not connected') }),
      update: () => ({ data: null, error: new Error('Supabase not connected') }),
      delete: () => ({ error: new Error('Supabase not connected') }),
      eq: () => ({ data: null, error: new Error('Supabase not connected') }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: new Error('Supabase not connected') })
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
    })
  }
  
  export const supabase = mockClient as any
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Types for our database
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          description: string
          quantity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          name: string
          description: string
          quantity: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          name?: string
          description?: string
          quantity?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']