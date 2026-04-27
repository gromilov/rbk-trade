import Database from 'better-sqlite3';
import { join } from 'path';

// Соединение с базой данных
const dbPath = join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Auto-seed basic data if empty
const typeCount = db.prepare('SELECT count(*) as count FROM types').get().count;
if (typeCount === 0) {
    const types = ['Квартиры', 'Загородные дома', 'Офисы', 'Коммерческая недвижимость'];
    const insert = db.prepare('INSERT INTO types (name) VALUES (?)');
    types.forEach(t => insert.run(t));
}

const manCount = db.prepare('SELECT count(*) as count FROM manufacturers').get().count;
if (manCount === 0) {
    const manufacturers = ['KZTO', 'Arbonia', 'Zehnder', 'Guardo', 'Irsap'];
    const insert = db.prepare('INSERT INTO manufacturers (name) VALUES (?)');
    manufacturers.forEach(m => insert.run(m));
}

db.pragma('foreign_keys = ON');

export default db;
