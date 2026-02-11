-- ============================================
-- Re-Label: Supabase Database Schema
-- ============================================
-- Run this in the Supabase SQL Editor to create all tables,
-- RLS policies, and storage bucket.

-- ============================================
-- Tables
-- ============================================

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    legacy_id TEXT,
    name TEXT NOT NULL,
    year INTEGER,
    description TEXT,
    cities TEXT[] DEFAULT '{}',
    website TEXT,
    status BOOLEAN DEFAULT false,
    rgpd BOOLEAN DEFAULT false,
    colors TEXT[] DEFAULT '{}',
    contact TEXT,
    is_draft BOOLEAN DEFAULT true
);

CREATE TABLE structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    legacy_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    illustrations TEXT[] DEFAULT '{}',
    status TEXT,
    typologies TEXT[] DEFAULT '{}',
    adress TEXT,
    longitude NUMERIC,
    latitude NUMERIC,
    website TEXT,
    contact TEXT,
    colors TEXT[] DEFAULT '{}',
    rgpd BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT true
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    legacy_id TEXT,
    name TEXT NOT NULL,
    typology TEXT,
    description TEXT,
    illustrations TEXT[] DEFAULT '{}',
    team TEXT[] DEFAULT '{}',
    website TEXT,
    contact TEXT,
    date TIMESTAMPTZ,
    duration NUMERIC,
    colors TEXT[] DEFAULT '{}',
    fab_expertise TEXT,
    fab_local TEXT,
    fab_social TEXT,
    fab_tools TEXT,
    material_origin TEXT,
    material_leftovers TEXT,
    material_source TEXT,
    material_quality TEXT,
    design_durability TEXT[] DEFAULT '{}',
    design_reparable TEXT,
    design_replicability TEXT,
    design_sharable TEXT,
    rgpd BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT true
);

-- ============================================
-- Junction Tables (proper foreign keys)
-- ============================================

CREATE TABLE community_structures (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    structure_id UUID NOT NULL REFERENCES structures(id) ON DELETE CASCADE,
    PRIMARY KEY (community_id, structure_id)
);

CREATE TABLE structure_partners (
    structure_id UUID NOT NULL REFERENCES structures(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES structures(id) ON DELETE CASCADE,
    PRIMARY KEY (structure_id, partner_id)
);

CREATE TABLE project_structures (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    structure_id UUID NOT NULL REFERENCES structures(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('designer', 'workshop', 'supplier', 'other')),
    PRIMARY KEY (project_id, structure_id, role)
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_communities_legacy_id ON communities(legacy_id);
CREATE INDEX idx_structures_legacy_id ON structures(legacy_id);
CREATE INDEX idx_projects_legacy_id ON projects(legacy_id);
CREATE INDEX idx_cs_structure ON community_structures(structure_id);
CREATE INDEX idx_sp_partner ON structure_partners(partner_id);
CREATE INDEX idx_ps_structure ON project_structures(structure_id);
CREATE INDEX idx_ps_role ON project_structures(role);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_structures ENABLE ROW LEVEL SECURITY;

-- Public can read published records
CREATE POLICY "public_read_communities" ON communities
    FOR SELECT USING (status = true OR auth.role() = 'authenticated');

CREATE POLICY "public_read_structures" ON structures
    FOR SELECT USING (is_draft = false OR auth.role() = 'authenticated');

CREATE POLICY "public_read_projects" ON projects
    FOR SELECT USING (is_draft = false OR auth.role() = 'authenticated');

-- Junction tables: public read
CREATE POLICY "public_read_cs" ON community_structures FOR SELECT USING (true);
CREATE POLICY "public_read_sp" ON structure_partners FOR SELECT USING (true);
CREATE POLICY "public_read_ps" ON project_structures FOR SELECT USING (true);

-- Public can insert drafts (public forms)
CREATE POLICY "public_insert_communities" ON communities
    FOR INSERT WITH CHECK (is_draft = true);

CREATE POLICY "public_insert_structures" ON structures
    FOR INSERT WITH CHECK (is_draft = true);

CREATE POLICY "public_insert_projects" ON projects
    FOR INSERT WITH CHECK (is_draft = true);

-- Junction tables: public insert (needed for form submissions)
CREATE POLICY "public_insert_cs" ON community_structures FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_sp" ON structure_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_ps" ON project_structures FOR INSERT WITH CHECK (true);

-- Authenticated users have full access
CREATE POLICY "admin_all_communities" ON communities
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_structures" ON structures
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_cs" ON community_structures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_sp" ON structure_partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_ps" ON project_structures FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- Storage: illustrations bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('illustrations', 'illustrations', true);

-- Anyone can view illustrations
CREATE POLICY "public_read_illustrations" ON storage.objects
    FOR SELECT USING (bucket_id = 'illustrations');

-- Authenticated users can upload
CREATE POLICY "auth_upload_illustrations" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'illustrations' AND auth.role() = 'authenticated');

-- Anyone can upload to the drafts folder (public form submissions)
CREATE POLICY "public_upload_drafts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'illustrations' AND (storage.foldername(name))[1] = 'drafts');

-- Authenticated users can update/delete illustrations
CREATE POLICY "auth_manage_illustrations" ON storage.objects
    FOR UPDATE USING (bucket_id = 'illustrations' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_illustrations" ON storage.objects
    FOR DELETE USING (bucket_id = 'illustrations' AND auth.role() = 'authenticated');
