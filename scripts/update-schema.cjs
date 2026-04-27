const Database = require('better-sqlite3');
const path = require('path');

async function update() {
  console.log('🌱 Updating database schema...');
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);

  // Добавляем sort_order
  try {
    db.prepare('ALTER TABLE manufacturers ADD COLUMN sort_order INTEGER DEFAULT 0').run();
    console.log('✅ Added sort_order to manufacturers');
  } catch(e) {}

  try {
    db.prepare('ALTER TABLE types ADD COLUMN sort_order INTEGER DEFAULT 0').run();
    console.log('✅ Added sort_order to types');
  } catch(e) {}

  // Добавляем image_path для логотипов брендов
  try {
    db.prepare('ALTER TABLE manufacturers ADD COLUMN image_path TEXT').run();
    console.log('✅ Added image_path to manufacturers');
  } catch(e) {}

  // Нормализуем текущие записи
  const mans = db.prepare('SELECT id FROM manufacturers').all();
  mans.forEach((m, i) => db.prepare('UPDATE manufacturers SET sort_order = ? WHERE id = ?').run(i + 1, m.id));

  const types = db.prepare('SELECT id FROM types').all();
  types.forEach((t, i) => db.prepare('UPDATE types SET sort_order = ? WHERE id = ?').run(i + 1, t.id));

  db.close();
  console.log('✅ Schema update complete!');
}

update();
