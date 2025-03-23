export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          name: string
          original_name: string
          mime_type: string
          size: number
          path: string
          key: string
          is_public: boolean
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          original_name: string
          mime_type: string
          size: number
          path: string
          key: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          original_name?: string
          mime_type?: string
          size?: number
          path?: string
          key?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      download_stats: {
        Row: {
          id: string
          file_id: string
          user_id: string | null
          ip_address: string | null
          downloaded_at: string
          completed: boolean
          speed: number | null
        }
        Insert: {
          id?: string
          file_id: string
          user_id?: string | null
          ip_address?: string | null
          downloaded_at?: string
          completed?: boolean
          speed?: number | null
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string | null
          ip_address?: string | null
          downloaded_at?: string
          completed?: boolean
          speed?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 