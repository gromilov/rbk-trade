const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

const types = ['Квартиры', 'Загородные дома', 'Офисы', 'Коммерческая недвижимость'];
const manufacturers = ['KZTO', 'Arbonia', 'Zehnder', 'Guardo', 'Irsap'];

const insertType = db.prepare('INSERT OR IGNORE INTO types (name) VALUES (?)');
types.forEach(t => insertType.run(t));

const insertMan = db.prepare('INSERT OR IGNORE INTO manufacturers (name) VALUES (?)');
manufacturers.forEach(m => insertMan.run(m));

console.log('✅ Базовые данные (типы и производители) добавлены!');
