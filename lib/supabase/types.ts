// lib/supabase/types.ts
// Manually typed to match schema.sql — regenerate with:
//   npx supabase gen types typescript --project-id gflyiytagaulfyackemh > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_profiles: {
        Row: {
          id: string
          full_name: string
          company: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          company?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          company?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          status: 'active' | 'paused' | 'completed'
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          client_id: string
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          client_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          client_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          client_id: string
          title: string
          meeting_date: string
          duration_min: number | null
          notes: string | null
          recording_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          meeting_date: string
          duration_min?: number | null
          notes?: string | null
          recording_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          meeting_date?: string
          duration_min?: number | null
          notes?: string | null
          recording_url?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          invoice_number: string
          title: string
          amount: number
          currency: string
          status: 'draft' | 'pending' | 'paid' | 'overdue'
          issued_date: string
          due_date: string | null
          paid_date: string | null
          pdf_url: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          invoice_number: string
          title: string
          amount: number
          currency?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue'
          issued_date: string
          due_date?: string | null
          paid_date?: string | null
          pdf_url?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          invoice_number?: string
          title?: string
          amount?: number
          currency?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue'
          issued_date?: string
          due_date?: string | null
          paid_date?: string | null
          pdf_url?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          category: 'contract' | 'brief' | 'asset' | 'report' | 'proposal' | 'general'
          storage_path: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          category?: 'contract' | 'brief' | 'asset' | 'report' | 'proposal' | 'general'
          storage_path: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          category?: 'contract' | 'brief' | 'asset' | 'report' | 'proposal' | 'general'
          storage_path?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
