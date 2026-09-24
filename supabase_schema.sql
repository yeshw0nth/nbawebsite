-- Enum for node status
CREATE TYPE node_status AS ENUM ('pending', 'ongoing', 'completed');

-- 1. accreditation_nodes table
CREATE TABLE accreditation_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    framework_type TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    node_id TEXT NOT NULL,
    status node_status DEFAULT 'pending',
    user_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(framework_type, academic_year, node_id)
);

-- 2. node_resources table
CREATE TABLE node_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    node_uuid UUID REFERENCES accreditation_nodes(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'link')),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. dynamic_tables table (JSONB storage for varying grid types)
CREATE TABLE dynamic_tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    node_uuid UUID REFERENCES accreditation_nodes(id) ON DELETE CASCADE,
    table_id TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(node_uuid, table_id)
);

-- Setup updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accreditation_nodes_modtime
    BEFORE UPDATE ON accreditation_nodes
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_dynamic_tables_modtime
    BEFORE UPDATE ON dynamic_tables
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


-- Enable Row Level Security (RLS)
ALTER TABLE accreditation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_tables ENABLE ROW LEVEL SECURITY;

-- Explicit Public Policies (Read & Write for all, assuming Next.js middleware handles gating)
CREATE POLICY "Enable read access for all users" ON accreditation_nodes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON accreditation_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON accreditation_nodes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON accreditation_nodes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON node_resources FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON node_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON node_resources FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON node_resources FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON dynamic_tables FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON dynamic_tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON dynamic_tables FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON dynamic_tables FOR DELETE USING (true);
