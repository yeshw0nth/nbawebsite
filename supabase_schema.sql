-- supabase_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Table: accreditation_nodes
-- Acts as the single source of truth for UI states, status, and notes.
CREATE TABLE accreditation_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    node_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    introductory_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(framework, academic_year, node_id)
);
ALTER TABLE accreditation_nodes DISABLE ROW LEVEL SECURITY;

-- 2. Evidence Links
-- Stores URLs and titles associated with specific nodes.
CREATE TABLE evidence_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_uuid UUID NOT NULL REFERENCES accreditation_nodes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE evidence_links DISABLE ROW LEVEL SECURITY;

-- 3. Evidence Files
-- Stores metadata and URLs for files uploaded to Supabase Storage.
CREATE TABLE evidence_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_uuid UUID NOT NULL REFERENCES accreditation_nodes(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT,
    public_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE evidence_files DISABLE ROW LEVEL SECURITY;

-- 4. Dynamic Spreadsheets
-- Stores JSONB representations of the react-datasheet-grid arrays.
CREATE TABLE dynamic_spreadsheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_uuid UUID NOT NULL REFERENCES accreditation_nodes(id) ON DELETE CASCADE,
    table_identifier TEXT NOT NULL,
    grid_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(node_uuid, table_identifier)
);
ALTER TABLE dynamic_spreadsheets DISABLE ROW LEVEL SECURITY;
