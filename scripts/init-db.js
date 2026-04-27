import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'database.sqlite'));

// Включаем поддержку внешних ключей
db.pragma('foreign_keys = ON');

// Создание таблиц
db.exec(`
  -- Типы объектов
  CREATE TABLE IF NOT EXISTS types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  -- Производители
  CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  -- Работы (Кейсы)
  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    main_image TEXT,
    type_id INTEGER,
    manufacturer_id INTEGER,
    tasks TEXT, -- JSON строка
    result_text TEXT,
    review_text TEXT,
    review_author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES types(id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
  );

  -- Галерея кейса
  CREATE TABLE IF NOT EXISTS case_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    image_path TEXT NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
  );

  -- FAQ
  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  -- Магазины
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    map_url TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    work_time TEXT,
    image_path TEXT
  );

  -- Общие настройки
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Начальные данные
const types = ['Квартиры', 'Дома', 'Коммерческие'];
const insertType = db.prepare('INSERT OR IGNORE INTO types (name) VALUES (?)');
types.forEach(t => insertType.run(t));

const manufacturers = ['KZTO', 'Sollira', 'Vasco'];
const insertMan = db.prepare('INSERT OR IGNORE INTO manufacturers (name) VALUES (?)');
manufacturers.forEach(m => insertMan.run(m));

// Пример данных в FAQ
db.exec(`
  INSERT OR IGNORE INTO faqs (question, answer, sort_order) VALUES 
  ('Как выбрать радиатор?', 'Мы поможем подобрать идеальный вариант под ваш интерьер и технические нужды.', 1),
  ('Есть ли доставка?', 'Да, мы осуществляем доставку по городу и области.', 2);
`);

// Начальные настройки
db.exec(`
  INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('phone_1', '+7 (843) 212-13-23'),
  ('phone_2', '+7 (843) 253-38-15'),
  ('telegram', 'https://t.me/your_handle'),
  ('whatsapp', 'https://wa.me/your_number'),
  ('email', 'rbk-treid@mail.ru');
`);

console.log('✅ База данных успешно инициализирована!');
db.close();
