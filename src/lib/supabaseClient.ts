import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      accreditation_nodes: {
        Row: {
          id: string;
          framework_type: string;
          academic_year: string;
          node_id: string;
          status: 'pending' | 'ongoing' | 'completed';
          user_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          framework_type: string;
          academic_year: string;
          node_id: string;
          status?: 'pending' | 'ongoing' | 'completed';
          user_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          framework_type?: string;
          academic_year?: string;
          node_id?: string;
          status?: 'pending' | 'ongoing' | 'completed';
          user_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      node_resources: {
        Row: {
          id: string;
          node_uuid: string | null;
          resource_type: string;
          title: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          node_uuid?: string | null;
          resource_type: string;
          title: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          node_uuid?: string | null;
          resource_type?: string;
          title?: string;
          url?: string;
          created_at?: string;
        };
      };
      dynamic_tables: {
        Row: {
          id: string;
          node_uuid: string | null;
          table_id: string;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          node_uuid?: string | null;
          table_id: string;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          node_uuid?: string | null;
          table_id?: string;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      node_status: 'pending' | 'ongoing' | 'completed';
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Check your environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
