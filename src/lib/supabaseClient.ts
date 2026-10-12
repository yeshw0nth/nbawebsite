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
          framework: string;
          academic_year: string;
          quarter: string | null;
          node_id: string;
          status: 'pending' | 'ongoing' | 'completed';
          introductory_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          framework: string;
          academic_year: string;
          quarter?: string | null;
          node_id: string;
          status?: 'pending' | 'ongoing' | 'completed';
          introductory_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          framework?: string;
          academic_year?: string;
          quarter?: string | null;
          node_id?: string;
          status?: 'pending' | 'ongoing' | 'completed';
          introductory_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence_links: {
        Row: {
          id: string;
          node_uuid: string;
          title: string;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          node_uuid: string;
          title: string;
          url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          node_uuid?: string;
          title?: string;
          url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence_files: {
        Row: {
          id: string;
          node_uuid: string;
          file_name: string;
          storage_path: string | null;
          public_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          node_uuid: string;
          file_name: string;
          storage_path?: string | null;
          public_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          node_uuid?: string;
          file_name?: string;
          storage_path?: string | null;
          public_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      dynamic_spreadsheets: {
        Row: {
          id: string;
          node_uuid: string;
          table_identifier: string;
          grid_payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          node_uuid: string;
          table_identifier: string;
          grid_payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          node_uuid?: string;
          table_identifier?: string;
          grid_payload?: Json;
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
