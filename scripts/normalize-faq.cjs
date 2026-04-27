const Database = require('better-sqlite3');
const path = require('path');

async function normalize() {
  console.log('🌱 Normalizing FAQ sort order...');
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);

  const faqs = db.prepare('SELECT id FROM faqs ORDER BY id ASC').all();
  const update = db.prepare('UPDATE faqs SET sort_order = ? WHERE id = ?');

  const trans = db.transaction((items) => {
    items.forEach((item, index) => {
      update.run(index + 1, item.id);
    });
  });

  trans(faqs);
  db.close();
  console.log('✅ FAQ sort_order normalized! You can now reorder them in the manager.');
}

normalize();
