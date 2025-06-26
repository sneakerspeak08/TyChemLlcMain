import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          description: string
          quantity: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          quantity: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          quantity?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}