import Database from 'better-sqlite3'
import path from 'path'
import Airtable from 'airtable'
import fs from 'fs';

// --- SQLite connection (singleton in dev to avoid too many instances) ---
const dbPath = path.join(process.cwd(), 'data_exports', 'airtable-export.sqlite');
let db;

if (process.env.NODE_ENV === 'production') {
    db = new Database(dbPath, { readonly: true });
} else {
    if (!global.__sqlite_db) {
        global.__sqlite_db = new Database(dbPath, { readonly: true });
        console.log("Instantiate new SQLite connection");
    }
    db = global.__sqlite_db;
}

// --- Load field metadata from _field_mappings table ---
const fieldMappings = db.prepare('SELECT * FROM _field_mappings').all();
const tableMetadata = {};

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

// --- Ensure illustrations output directory exists ---
const illustrationsDir = path.join(process.cwd(), 'public', 'assets', 'illustrations');
if (!fs.existsSync(illustrationsDir)) {
    fs.mkdirSync(illustrationsDir, { recursive: true });
}

// --- Row transformer: maps SQLite row to Prisma-compatible object ---
function transformRow(row, tableName) {
    const meta = tableMetadata[tableName] || { arrayFields: [], attachmentFields: [], booleanFields: [] };
    const result = { id: row.airtable_id };

    for (const [key, value] of Object.entries(row)) {
        if (key === 'airtable_id') continue;

        if (meta.attachmentFields.includes(key)) {
            if (value) {
                const objects = JSON.parse(value);
                result[key] = objects.map(obj =>
                    obj.localPath ? path.join('data_exports', obj.localPath) : obj.url
                );
            } else {
                result[key] = [];
            }
        } else if (meta.arrayFields.includes(key)) {
            result[key] = value ? JSON.parse(value) : [];
        } else if (meta.booleanFields.includes(key)) {
            result[key] = value === 1;
        } else {
            result[key] = value;
        }
    }

    return result;
}

// --- findMany: supports the 3 query patterns used in the app ---
function findMany(tableName, args) {
    const meta = tableMetadata[tableName] || { arrayFields: [], attachmentFields: [], booleanFields: [] };
    let sql = `SELECT * FROM "${tableName}"`;
    const params = [];

    if (args && args.where) {
        const conditions = [];
        for (const [key, value] of Object.entries(args.where)) {
            const column = key === 'id' ? 'airtable_id' : key;
            if (meta.booleanFields.includes(key) && typeof value === 'boolean') {
                conditions.push(`"${column}" = ?`);
                params.push(value ? 1 : 0);
            } else {
                conditions.push(`"${column}" = ?`);
                params.push(value);
            }
        }
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
    }

    const rows = db.prepare(sql).all(...params);
    return rows.map(row => transformRow(row, tableName));
}

// --- Prisma-compatible proxy object ---
const modelToTable = {
    community: 'communities',
    project: 'projects',
    structure: 'structures',
};

const prisma = new Proxy({}, {
    get(_target, modelName) {
        const tableName = modelToTable[modelName];
        if (!tableName) return undefined;
        return { findMany: (args) => findMany(tableName, args) };
    }
});

export default prisma;


// --- Airtable config (unchanged, used for writes) ---
const base = new Airtable({
    apiKey: process.env.AIRTABLE_APIKEY,
    endpointUrl: "https://proxy.syncinc.so/api.airtable.com",
}).base(process.env.AIRTABLE_BASEID);

export function filter(data, filter) {
    if (!Object.keys(filter).length) return data;

    let singleFilter = Object.entries(filter)[0]
    let filteredData = data.filter(el => {
        if (
            typeof singleFilter[1] === 'boolean'
            || singleFilter[1] === 'true'
            || singleFilter[1] === 'false'
        ) {
            if (!!el[singleFilter[0]] === false) { return false }
            else if (el[singleFilter[0]] == false) { return false }
            else { return true }
        }
        else {
            return (el[singleFilter[0]] === singleFilter[1])
        }
    })

    return filteredData
}


export function createApi(type, fields) {
    return new Promise((resolve, reject) => {
        base(type).create(fields, { typecast: true }, function (err, records) {
            if (err) { reject(err); }
            resolve(records);
        });
    });
}

export function serialize(data) {
    return JSON.parse(JSON.stringify(data))
}


export async function manageImages(localPath, name, id) {
    const normalizeName = (name, id) => {
        name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]/g, " ").toLowerCase().replace(/\ /g, "_");
        return `${name}-${id}.png`
    }
    const filename = normalizeName(name, id);
    const destPath = path.join(illustrationsDir, filename);

    if (!fs.existsSync(destPath)) {
        const srcPath = path.join(process.cwd(), localPath);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`copying image ${filename}`);
        } else {
            console.warn(`Source image not found: ${srcPath}`);
        }
    }
    return `/assets/illustrations/${filename}`
}
