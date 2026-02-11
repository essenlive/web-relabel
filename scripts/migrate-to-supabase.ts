/**
 * One-time migration script: SQLite (Airtable export) → Supabase
 *
 * Usage:
 *   npm install better-sqlite3 --save-dev --legacy-peer-deps
 *   npx tsx --env-file=.env.local scripts/migrate-to-supabase.ts
 *   npm uninstall better-sqlite3 --legacy-peer-deps
 *
 * Prerequisites:
 *   - Supabase tables created (run supabase/migrations/001_initial.sql first)
 *   - SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL set in .env.local
 *   - SQLite export at data_exports/airtable-export.sqlite
 */

// @ts-ignore - better-sqlite3 installed temporarily for migration
import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin access (bypasses RLS)
);

const dbPath = path.join(process.cwd(), 'data_exports', 'airtable-export.sqlite');
const exportDir = path.join(process.cwd(), 'data_exports');
const db = new Database(dbPath, { readonly: true });

// --- Field metadata ---
interface FieldMapping {
    table_name: string;
    field_name: string;
    field_type: string;
}

interface TableMeta {
    arrayFields: string[];
    attachmentFields: string[];
    booleanFields: string[];
}

interface AirtableAttachment {
    id?: string;
    url: string;
    filename: string;
    type?: string;
    localPath?: string;
}

// --- Valid Supabase columns per table (excludes relationship arrays and Airtable-specific fields) ---
const validColumns: Record<string, Set<string>> = {
    communities: new Set(['name', 'year', 'description', 'cities', 'website', 'status', 'rgpd', 'colors', 'contact']),
    structures: new Set(['name', 'description', 'illustrations', 'status', 'typologies', 'adress', 'longitude', 'latitude', 'website', 'contact', 'colors', 'rgpd']),
    projects: new Set(['name', 'typology', 'description', 'illustrations', 'team', 'website', 'contact', 'date', 'duration', 'colors', 'fab_expertise', 'fab_local', 'fab_social', 'fab_tools', 'material_origin', 'material_leftovers', 'material_source', 'material_quality', 'design_durability', 'design_reparable', 'design_replicability', 'design_sharable', 'rgpd']),
};

// --- MIME type mapping ---
const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

const fieldMappings = db.prepare('SELECT * FROM _field_mappings').all() as FieldMapping[];
const tableMetadata: Record<string, TableMeta> = {};

for (const mapping of fieldMappings) {
    if (!tableMetadata[mapping.table_name]) {
        tableMetadata[mapping.table_name] = { arrayFields: [], attachmentFields: [], booleanFields: [] };
    }
    if (['multipleSelects', 'multipleRecordLinks'].includes(mapping.field_type)) {
        tableMetadata[mapping.table_name].arrayFields.push(mapping.field_name);
    }
    if (mapping.field_type === 'multipleAttachments') {
        tableMetadata[mapping.table_name].attachmentFields.push(mapping.field_name);
    }
    if (mapping.field_type === 'checkbox') {
        tableMetadata[mapping.table_name].booleanFields.push(mapping.field_name);
    }
}

// --- Image upload ---
async function uploadImage(localPath: string, tableName: string, filename: string): Promise<string | null> {
    const fullPath = path.join(exportDir, localPath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`    Image not found: ${fullPath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(filename).toLowerCase() || '.jpg';
    const contentType = mimeTypes[ext] || 'image/jpeg';

    // Generate a unique storage path: tableName/hash-filename
    const hash = crypto.randomBytes(6).toString('hex');
    const safeName = filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_');
    const storagePath = `${tableName}/${hash}-${safeName}${safeName.includes('.') ? '' : ext}`;

    const { data, error } = await supabase.storage
        .from('illustrations')
        .upload(storagePath, fileBuffer, { contentType, upsert: false });

    if (error) {
        console.warn(`    Upload error for ${storagePath}: ${error.message}`);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('illustrations')
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

async function processAttachments(value: string, tableName: string): Promise<string[]> {
    const attachments = JSON.parse(value) as AirtableAttachment[];
    const urls: string[] = [];

    for (const att of attachments) {
        if (att.localPath) {
            const url = await uploadImage(att.localPath, tableName, att.filename);
            if (url) {
                urls.push(url);
                continue;
            }
        }
        // Fallback: keep original Airtable URL (may be expired)
        urls.push(att.url);
    }

    return urls;
}

// --- Row transform ---
async function transformRow(row: Record<string, unknown>, tableName: string): Promise<Record<string, unknown>> {
    const meta = tableMetadata[tableName] || { arrayFields: [], attachmentFields: [], booleanFields: [] };
    const result: Record<string, unknown> = { legacy_id: row.airtable_id };

    const allowed = validColumns[tableName];
    for (const [key, value] of Object.entries(row)) {
        if (key === 'airtable_id') continue;
        if (allowed && !allowed.has(key)) continue; // Skip relationship arrays and Airtable-specific columns

        if (meta.attachmentFields.includes(key)) {
            if (value) {
                result[key] = await processAttachments(value as string, tableName);
            } else {
                result[key] = [];
            }
        } else if (meta.arrayFields.includes(key)) {
            result[key] = value ? JSON.parse(value as string) : [];
        } else if (meta.booleanFields.includes(key)) {
            result[key] = value === 1;
        } else {
            result[key] = value;
        }
    }

    return result;
}

// --- ID mapping ---
const idMap: Record<string, string> = {}; // legacy_id -> new UUID

async function migrateTable(tableName: string) {
    console.log(`\nMigrating ${tableName}...`);
    const rows = db.prepare(`SELECT * FROM "${tableName}"`).all() as Record<string, unknown>[];
    console.log(`  Found ${rows.length} records`);

    for (const row of rows) {
        const transformed = await transformRow(row, tableName);
        const legacyId = transformed.legacy_id as string;

        // Set non-draft for existing data
        transformed.is_draft = false;
        if (tableName === 'communities') {
            transformed.status = true;
        }

        const { data, error } = await supabase
            .from(tableName)
            .insert(transformed)
            .select('id')
            .single();

        if (error) {
            console.error(`  Error inserting ${legacyId}:`, error.message);
            continue;
        }

        idMap[legacyId] = data.id;
        console.log(`  ${legacyId} -> ${data.id}`);
    }
}

// --- Insert junction table relationships ---
async function insertRelationships() {
    console.log('\nInserting relationships into junction tables...');

    function remapId(legacyId: string): string | null {
        return idMap[legacyId] || null;
    }

    // Read raw rows from SQLite to get relationship arrays
    const communities = db.prepare('SELECT * FROM communities').all() as Record<string, unknown>[];
    const structures = db.prepare('SELECT * FROM structures').all() as Record<string, unknown>[];
    const projects = db.prepare('SELECT * FROM projects').all() as Record<string, unknown>[];

    // --- community_structures ---
    let csCount = 0;
    for (const community of communities) {
        const communityId = remapId(community.airtable_id as string);
        if (!communityId) continue;

        const structureIds = community.structures ? JSON.parse(community.structures as string) as string[] : [];
        for (const legacyStructureId of structureIds) {
            const structureId = remapId(legacyStructureId);
            if (!structureId) continue;

            const { error } = await supabase.from('community_structures').insert({
                community_id: communityId,
                structure_id: structureId,
            });
            if (error && !error.message.includes('duplicate')) {
                console.error(`  Error: community_structures ${communityId} -> ${structureId}:`, error.message);
            } else {
                csCount++;
            }
        }
    }
    console.log(`  Inserted ${csCount} community_structures links`);

    // --- structure_partners ---
    let spCount = 0;
    for (const structure of structures) {
        const structureId = remapId(structure.airtable_id as string);
        if (!structureId) continue;

        const partnerIds = structure.partners ? JSON.parse(structure.partners as string) as string[] : [];
        for (const legacyPartnerId of partnerIds) {
            const partnerId = remapId(legacyPartnerId);
            if (!partnerId) continue;

            const { error } = await supabase.from('structure_partners').insert({
                structure_id: structureId,
                partner_id: partnerId,
            });
            if (error && !error.message.includes('duplicate')) {
                console.error(`  Error: structure_partners ${structureId} -> ${partnerId}:`, error.message);
            } else {
                spCount++;
            }
        }
    }
    console.log(`  Inserted ${spCount} structure_partners links`);

    // --- project_structures (from projects side: designers, workshops, suppliers, others) ---
    let psCount = 0;
    const roleMap: Record<string, string> = {
        designers: 'designer',
        workshops: 'workshop',
        suppliers: 'supplier',
        others: 'other',
    };

    for (const project of projects) {
        const projectId = remapId(project.airtable_id as string);
        if (!projectId) continue;

        for (const [field, role] of Object.entries(roleMap)) {
            const structureIds = project[field] ? JSON.parse(project[field] as string) as string[] : [];
            for (const legacyStructureId of structureIds) {
                const structureId = remapId(legacyStructureId);
                if (!structureId) continue;

                const { error } = await supabase.from('project_structures').insert({
                    project_id: projectId,
                    structure_id: structureId,
                    role,
                });
                if (error && !error.message.includes('duplicate')) {
                    console.error(`  Error: project_structures ${projectId} -> ${structureId} (${role}):`, error.message);
                } else {
                    psCount++;
                }
            }
        }
    }
    console.log(`  Inserted ${psCount} project_structures links`);
}

async function main() {
    console.log('=== Re-Label: SQLite → Supabase Migration ===');
    console.log(`SQLite: ${dbPath}`);
    console.log(`Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

    if (!fs.existsSync(dbPath)) {
        console.error('SQLite database not found. Run the airtable export first.');
        process.exit(1);
    }

    // Migrate in order: communities first, then structures, then projects
    await migrateTable('communities');
    await migrateTable('structures');
    await migrateTable('projects');

    // Insert relationships into junction tables
    await insertRelationships();

    console.log('\n=== Migration complete! ===');
    console.log(`Total records: ${Object.keys(idMap).length}`);
    console.log('Review your data in the Supabase dashboard.');

    db.close();
}

main().catch(console.error);
