const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
for (const t of tables) {
  const schema = db.prepare("PRAGMA table_info(" + t.name + ")").all();
  console.log('TABLE', t.name, ':', schema.map(c => c.name).join(', '));
}
db.close();
