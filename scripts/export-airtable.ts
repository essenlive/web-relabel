import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import Airtable from 'airtable';
import Database from 'better-sqlite3';

// ─── Configuration ───────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'data_exports');
const DB_PATH = path.join(OUTPUT_DIR, 'airtable-export.sqlite');
const ATTACHMENTS_DIR = path.join(OUTPUT_DIR, 'attachments');
const CONCURRENT_DOWNLOADS = 5;

// Known tables as fallback if the metadata API is unavailable
const KNOWN_TABLES = ['Creators', 'Creations', 'Events'];

// ─── Env Loading ─────────────────────────────────────────────────────────────

function loadEnv(): void {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local not found. Please create it with AIRTABLE_API_KEY and AIRTABLE_BASE_ID.');
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment.');
  }
  return { apiKey, baseId };
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(message: string): void {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${message}`);
}

// ─── Airtable Metadata API ──────────────────────────────────────────────────

interface FieldMeta {
  id: string;
  name: string;
  type: string;
}

interface TableMeta {
  id: string;
  name: string;
  fields: FieldMeta[];
}

async function fetchTablesMeta(apiKey: string, baseId: string): Promise<TableMeta[]> {
  const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      throw new Error(`Metadata API returned ${response.status}`);
    }
    const data = (await response.json()) as { tables: TableMeta[] };
    return data.tables;
  } catch (err) {
    log(`WARNING: Metadata API unavailable (${err}). Falling back to known tables.`);
    return [];
  }
}

// ─── Schema Inference (fallback) ─────────────────────────────────────────────

function inferFieldType(values: unknown[]): string {
  const samples = values.filter((v) => v != null).slice(0, 10);
  if (samples.length === 0) return 'singleLineText';

  const first = samples[0];

  // Attachment: array of objects with 'url' and 'filename'
  if (
    Array.isArray(first) &&
    first.length > 0 &&
    typeof first[0] === 'object' &&
    first[0] !== null &&
    'url' in first[0] &&
    'filename' in first[0]
  ) {
    return 'multipleAttachments';
  }

  // Linked records: array of strings starting with "rec"
  if (
    Array.isArray(first) &&
    first.length > 0 &&
    typeof first[0] === 'string' &&
    (first[0] as string).startsWith('rec')
  ) {
    return 'multipleRecordLinks';
  }

  // Multi-select: array of strings
  if (Array.isArray(first) && first.length > 0 && typeof first[0] === 'string') {
    return 'multipleSelects';
  }

  // Other array
  if (Array.isArray(first)) return 'multipleSelects';

  if (typeof first === 'number') return 'number';
  if (typeof first === 'boolean') return 'checkbox';

  return 'singleLineText';
}

function inferTableMeta(
  tableName: string,
  records: Array<{ id: string; fields: Record<string, unknown> }>
): TableMeta {
  const fieldMap = new Map<string, unknown[]>();

  for (const record of records) {
    for (const [key, value] of Object.entries(record.fields)) {
      if (!fieldMap.has(key)) fieldMap.set(key, []);
      fieldMap.get(key)!.push(value);
    }
  }

  const fields: FieldMeta[] = [];
  for (const [name, values] of fieldMap) {
    fields.push({ id: name, name, type: inferFieldType(values) });
  }

  return { id: tableName, name: tableName, fields };
}

// ─── SQLite Helpers ──────────────────────────────────────────────────────────

function mapAirtableTypeToSqlite(airtableType: string): string {
  switch (airtableType) {
    case 'number':
    case 'currency':
    case 'percent':
    case 'duration':
      return 'REAL';
    case 'rating':
    case 'count':
    case 'autoNumber':
    case 'checkbox':
      return 'INTEGER';
    default:
      return 'TEXT';
  }
}

function quoteId(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function createMetaTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "_field_mappings" (
      "table_name" TEXT NOT NULL,
      "field_name" TEXT NOT NULL,
      "field_type" TEXT,
      "sqlite_type" TEXT,
      PRIMARY KEY ("table_name", "field_name")
    );
    CREATE TABLE IF NOT EXISTS "_export_meta" (
      "key" TEXT PRIMARY KEY,
      "value" TEXT
    );
  `);
}

function createDataTable(db: Database.Database, meta: TableMeta): void {
  const columns = [
    '"airtable_id" TEXT PRIMARY KEY',
    '"created_time" TEXT',
    ...meta.fields.map(
      (f) => `${quoteId(f.name)} ${mapAirtableTypeToSqlite(f.type)}`
    ),
  ];

  db.exec(
    `CREATE TABLE IF NOT EXISTS ${quoteId(meta.name)} (${columns.join(', ')})`
  );

  // Store field mappings
  const insertMapping = db.prepare(
    `INSERT OR REPLACE INTO "_field_mappings" ("table_name", "field_name", "field_type", "sqlite_type") VALUES (?, ?, ?, ?)`
  );
  for (const f of meta.fields) {
    insertMapping.run(meta.name, f.name, f.type, mapAirtableTypeToSqlite(f.type));
  }
}

// ─── Record Serialization ────────────────────────────────────────────────────

function serializeValue(value: unknown, fieldType: string): string | number | null {
  if (value == null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value;
  // Arrays and objects -> JSON
  return JSON.stringify(value);
}

// ─── Record Fetching ─────────────────────────────────────────────────────────

async function fetchAllRecords(
  base: ReturnType<InstanceType<typeof Airtable>['base']>,
  tableName: string
): Promise<Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>> {
  const records = await base(tableName).select({}).all();
  return records.map((r: any) => ({
    id: r.id,
    createdTime: r._rawJson?.createdTime || '',
    fields: r.fields as Record<string, unknown>,
  }));
}

// ─── Record Insertion ────────────────────────────────────────────────────────

function insertRecords(
  db: Database.Database,
  meta: TableMeta,
  records: Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>
): void {
  const columnNames = ['airtable_id', 'created_time', ...meta.fields.map((f) => f.name)];
  const placeholders = columnNames.map(() => '?').join(', ');
  const quotedColumns = columnNames.map(quoteId).join(', ');

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO ${quoteId(meta.name)} (${quotedColumns}) VALUES (${placeholders})`
  );

  const insertAll = db.transaction(() => {
    for (const record of records) {
      const values = [
        record.id,
        record.createdTime,
        ...meta.fields.map((f) => serializeValue(record.fields[f.name], f.type)),
      ];
      stmt.run(...values);
    }
  });

  insertAll();
}

// ─── Attachment Collection ───────────────────────────────────────────────────

interface AttachmentInfo {
  tableName: string;
  recordId: string;
  fieldName: string;
  url: string;
  filename: string;
  localPath: string;
  originalAttachment: Record<string, unknown>;
}

function collectAttachments(
  meta: TableMeta,
  records: Array<{ id: string; fields: Record<string, unknown> }>
): AttachmentInfo[] {
  const attachmentFields = meta.fields.filter((f) => f.type === 'multipleAttachments');
  if (attachmentFields.length === 0) return [];

  const result: AttachmentInfo[] = [];

  for (const record of records) {
    for (const field of attachmentFields) {
      const attachments = record.fields[field.name];
      if (!Array.isArray(attachments)) continue;

      const usedFilenames = new Set<string>();

      for (const att of attachments) {
        if (!att || typeof att !== 'object' || !att.url || !att.filename) continue;

        let filename = att.filename as string;
        // Handle duplicate filenames within same record+field
        if (usedFilenames.has(filename)) {
          const ext = path.extname(filename);
          const base = path.basename(filename, ext);
          let counter = 1;
          while (usedFilenames.has(`${base}_${counter}${ext}`)) counter++;
          filename = `${base}_${counter}${ext}`;
        }
        usedFilenames.add(filename);

        const localPath = path.join(ATTACHMENTS_DIR, meta.name, record.id, filename);

        result.push({
          tableName: meta.name,
          recordId: record.id,
          fieldName: field.name,
          url: att.url as string,
          filename,
          localPath,
          originalAttachment: att as Record<string, unknown>,
        });
      }
    }
  }

  return result;
}

// ─── Attachment Downloading ──────────────────────────────────────────────────

async function downloadAttachment(info: AttachmentInfo): Promise<void> {
  const dir = path.dirname(info.localPath);
  fs.mkdirSync(dir, { recursive: true });

  const response = await fetch(info.url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${info.url}`);
  }

  const fileStream = fs.createWriteStream(info.localPath);
  const body = Readable.fromWeb(response.body as any);
  await pipeline(body, fileStream);
}

async function downloadAllAttachments(
  attachments: AttachmentInfo[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  let index = 0;

  async function worker() {
    while (index < attachments.length) {
      const current = index++;
      const info = attachments[current];
      log(`  Downloading [${current + 1}/${attachments.length}]: ${info.tableName}/${info.recordId}/${info.filename}`);
      try {
        await downloadAttachment(info);
        success++;
      } catch (err) {
        failed++;
        log(`  WARNING: Failed to download ${info.filename}: ${err}`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENT_DOWNLOADS, attachments.length) }, () => worker());
  await Promise.all(workers);

  return { success, failed };
}

// ─── Update Attachment Refs in SQLite ────────────────────────────────────────

function updateAttachmentRefs(
  db: Database.Database,
  meta: TableMeta,
  records: Array<{ id: string; fields: Record<string, unknown> }>,
  attachments: AttachmentInfo[]
): void {
  const attachmentFields = meta.fields.filter((f) => f.type === 'multipleAttachments');
  if (attachmentFields.length === 0) return;

  // Build lookup: recordId+fieldName -> list of attachments
  const lookup = new Map<string, AttachmentInfo[]>();
  for (const att of attachments) {
    const key = `${att.recordId}:${att.fieldName}`;
    if (!lookup.has(key)) lookup.set(key, []);
    lookup.get(key)!.push(att);
  }

  const update = db.transaction(() => {
    for (const field of attachmentFields) {
      const stmt = db.prepare(
        `UPDATE ${quoteId(meta.name)} SET ${quoteId(field.name)} = ? WHERE "airtable_id" = ?`
      );

      for (const record of records) {
        const rawAttachments = record.fields[field.name];
        if (!Array.isArray(rawAttachments)) continue;

        const key = `${record.id}:${field.name}`;
        const downloadedMap = new Map<string, string>();
        for (const att of lookup.get(key) || []) {
          // Store relative path from exports dir
          downloadedMap.set(att.url, path.relative(OUTPUT_DIR, att.localPath));
        }

        const updated = rawAttachments.map((att: any) => ({
          ...att,
          localPath: downloadedMap.get(att.url) || null,
        }));

        stmt.run(JSON.stringify(updated), record.id);
      }
    }
  });

  update();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  log('Starting Airtable export...');

  // 1. Load config
  loadEnv();
  const { apiKey, baseId } = getConfig();
  log(`Base ID: ${baseId}`);

  // 2. Create output directories
  fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true });

  // 3. Discover tables
  let tablesMeta = await fetchTablesMeta(apiKey, baseId);
  const usedFallback = tablesMeta.length === 0;

  // 4. Set up Airtable client
  const airtable = new Airtable({ apiKey, endpointUrl: 'https://api.airtable.com' });
  const base = airtable.base(baseId);

  // 5. If metadata API failed, fetch records first then infer schema
  if (usedFallback) {
    log(`Using fallback: fetching from known tables [${KNOWN_TABLES.join(', ')}]`);
    tablesMeta = [];
    for (const tableName of KNOWN_TABLES) {
      try {
        const records = await fetchAllRecords(base, tableName);
        const meta = inferTableMeta(tableName, records);
        tablesMeta.push(meta);
        log(`  ${tableName}: inferred ${meta.fields.length} fields from ${records.length} records`);
      } catch (err) {
        log(`  WARNING: Could not fetch table "${tableName}": ${err}`);
      }
    }
  }

  log(`Found ${tablesMeta.length} table(s): ${tablesMeta.map((t) => t.name).join(', ')}`);

  // 6. Create SQLite database
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  createMetaTables(db);

  // Store export metadata
  const metaInsert = db.prepare(`INSERT INTO "_export_meta" ("key", "value") VALUES (?, ?)`);
  metaInsert.run('base_id', baseId);
  metaInsert.run('export_timestamp', new Date().toISOString());
  metaInsert.run('tables', tablesMeta.map((t) => t.name).join(', '));

  // 7. For each table: create schema, fetch records, insert
  const allAttachments: AttachmentInfo[] = [];
  const allRecordsByTable = new Map<string, Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>>();
  let totalRecords = 0;

  for (const meta of tablesMeta) {
    log(`\nProcessing table: ${meta.name} (${meta.fields.length} fields)`);

    // Create SQLite table
    createDataTable(db, meta);

    // Fetch records (skip if already fetched during fallback inference)
    let records: Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>;
    if (usedFallback) {
      // Re-fetch to get createdTime (inference pass might have missed it)
      records = await fetchAllRecords(base, meta.name);
    } else {
      records = await fetchAllRecords(base, meta.name);
    }

    log(`  Fetched ${records.length} records`);
    totalRecords += records.length;

    // Insert records
    insertRecords(db, meta, records);
    log(`  Inserted into SQLite`);

    // Collect attachments
    const attachments = collectAttachments(meta, records);
    if (attachments.length > 0) {
      log(`  Found ${attachments.length} attachment(s)`);
      allAttachments.push(...attachments);
    }

    allRecordsByTable.set(meta.name, records);
  }

  // 8. Download all attachments
  if (allAttachments.length > 0) {
    log(`\nDownloading ${allAttachments.length} attachment(s)...`);
    const result = await downloadAllAttachments(allAttachments);
    log(`Downloads complete: ${result.success} succeeded, ${result.failed} failed`);

    // 9. Update attachment refs in SQLite
    log('Updating attachment references in SQLite...');
    for (const meta of tablesMeta) {
      const records = allRecordsByTable.get(meta.name);
      if (!records) continue;
      const tableAttachments = allAttachments.filter((a) => a.tableName === meta.name);
      if (tableAttachments.length > 0) {
        updateAttachmentRefs(db, meta, records, tableAttachments);
      }
    }
  } else {
    log('\nNo attachments found.');
  }

  // 10. Summary
  db.close();
  const dbSize = fs.statSync(DB_PATH).size;

  log('\n========== Export Summary ==========');
  log(`Tables exported: ${tablesMeta.length}`);
  log(`Total records:   ${totalRecords}`);
  log(`Attachments:     ${allAttachments.length}`);
  log(`Database:        ${DB_PATH} (${(dbSize / 1024).toFixed(1)} KB)`);
  log(`Attachments dir: ${ATTACHMENTS_DIR}`);
  log('====================================');
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
