-- ============================================
-- Tighten public insert policies
-- ============================================
-- Previously the junction tables allowed anyone to insert any row
-- (WITH CHECK (true)), so a visitor could attach themselves to any
-- published project / structure / community. Public inserts are now only
-- allowed when the parent record(s) being linked are still drafts, i.e.
-- the rows just created by the public forms. Note: the form inserts the
-- draft parent first, so this works with the existing client code, but
-- only while the draft parent is visible to the inserter. Drafts are not
-- readable by anon (see public_read_*), so the checks below use
-- SECURITY DEFINER helpers instead of subqueries on RLS-protected tables.

CREATE OR REPLACE FUNCTION public.is_draft_project(p UUID) RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS
$$ SELECT COALESCE((SELECT is_draft AND created_at > now() - interval '1 hour' FROM projects WHERE id = p), false) $$;

CREATE OR REPLACE FUNCTION public.is_draft_structure(s UUID) RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS
$$ SELECT COALESCE((SELECT is_draft AND created_at > now() - interval '1 hour' FROM structures WHERE id = s), false) $$;

CREATE OR REPLACE FUNCTION public.is_published_structure(s UUID) RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS
$$ SELECT COALESCE((SELECT NOT is_draft FROM structures WHERE id = s), false) $$;

CREATE OR REPLACE FUNCTION public.is_published_community(c UUID) RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS
$$ SELECT COALESCE((SELECT status FROM communities WHERE id = c), false) $$;

-- project_structures: link a just-created draft project to a published structure
DROP POLICY IF EXISTS "public_insert_ps" ON project_structures;
CREATE POLICY "public_insert_ps" ON project_structures
    FOR INSERT WITH CHECK (
        public.is_draft_project(project_id) AND public.is_published_structure(structure_id)
    );

-- community_structures: link a just-created draft structure to a published community
DROP POLICY IF EXISTS "public_insert_cs" ON community_structures;
CREATE POLICY "public_insert_cs" ON community_structures
    FOR INSERT WITH CHECK (
        public.is_draft_structure(structure_id) AND public.is_published_community(community_id)
    );

-- structure_partners is not written by any public form: authenticated only
DROP POLICY IF EXISTS "public_insert_sp" ON structure_partners;

-- Draft uploads: restrict to images, enforced server-side
DROP POLICY IF EXISTS "public_upload_drafts" ON storage.objects;
CREATE POLICY "public_upload_drafts" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'illustrations'
        AND (storage.foldername(name))[1] = 'drafts'
        AND lower(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'webp')
    );

-- Also cap the file size on the bucket (5 MB) and restrict mime types.
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp']
WHERE id = 'illustrations';
