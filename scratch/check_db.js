import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('--- TABLES ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables);

tables.forEach(table => {
    console.log(`--- SCHEMA FOR ${table.name} ---`);
    const schema = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.log(schema);
});
