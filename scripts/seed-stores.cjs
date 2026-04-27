const Database = require('better-sqlite3');
const path = require('path');

async function seed() {
  console.log('🌱 Seeding stores with images...');
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);

  db.prepare('DELETE FROM stores').run();

  const insert = db.prepare('INSERT INTO stores (title, address, phone, email, map_url, image_path, work_time) VALUES (?, ?, ?, ?, ?, ?, ?)');

  const testImg = '/uploads/1777298550630-image.png';

  insert.run(
    'Казань, ТЦ "Савиново"',
    'г. Казань, пр. Ямашева 93, ТЦ "Савиново"',
    '(843) 212-13-23, (843) 253-38-15',
    'rbk-treid@mail.ru',
    'https://yandex.ru/maps/-/CDT6Z-Yn',
    testImg,
    'Пн-Пт: 09:00 - 20:00\nСб-Вс: 10:00 - 18:00'
  );

  insert.run(
    'Казань, пр. Универсиады',
    'г. Казань, пр. Универсиады 10',
    '(843) 212-13-23',
    'info@armobile.net',
    'https://yandex.ru/maps/-/CDT6Z-Yn',
    testImg,
    'Пн-Пт: 10:00 - 19:00\nСб: 11:00 - 16:00\nВс: Выходной'
  );

  db.close();
  console.log('✅ Stores with images seeded successfully!');
}

seed();
