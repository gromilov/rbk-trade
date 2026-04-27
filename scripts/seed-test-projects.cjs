const Database = require('better-sqlite3');
const path = require('path');

async function seed() {
  console.log('🌱 Starting seeding test projects (Direct DB mode)...');
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);

  const types = db.prepare('SELECT id FROM types').all();
  const manufacturers = db.prepare('SELECT id FROM manufacturers').all();
  const img = '/uploads/1777298550630-image.png';

  if (types.length === 0 || manufacturers.length === 0) {
    console.error('❌ Error: Types or Manufacturers tables are empty. Please run init-db first.');
    return;
  }

  const adjectives = ['Современный', 'Уютный', 'Просторный', 'Минималистичный', 'Элитный', 'Технологичный', 'Классический', 'Индустриальный'];
  const nouns = ['лофт', 'офис', 'пентхаус', 'коттедж', 'шоурум', 'ЖК', 'апартаменты', 'кабинет'];

  for (let i = 1; i <= 20; i++) {
    const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} #${i}`;
    const slug = `test-project-${i}`;
    
    // Генерируем описание разной длины
    const baseDesc = `Описание тестового проекта номер ${i}. `;
    const filler = 'Это очень ' + 'интересный и '.repeat(Math.floor(Math.random() * 8)) + 'масштабный объект, над которым мы работали несколько недель. ';
    const subtitle = (baseDesc + filler).substring(0, 200);

    const typeId = types[Math.floor(Math.random() * types.length)].id;
    const manufacturerId = manufacturers[Math.floor(Math.random() * manufacturers.length)].id;
    
    try {
        const res = db.prepare(`
          INSERT INTO cases 
          (title, slug, subtitle, type_id, manufacturer_id, main_image, tasks, result_text, review_text, review_author) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          title, 
          slug, 
          subtitle, 
          typeId, 
          manufacturerId, 
          img, 
          JSON.stringify(["Установка радиаторов", "Проектирование разводки", "Монтаж автоматики", "Пусконаладка"].slice(0, Math.floor(Math.random() * 4) + 1)),
          `В ходе реализации этого проекта №${i} мы достигли отличных результатов, обеспечив комфортную температуру и сохранив эстетику интерьера.`,
          "Работа выполнена в срок, качеством оборудования и монтажа довольны!",
          `Заказчик проекта #${i}`
        );
        
        const caseId = res.lastInsertRowid;
        
        // Разное количество фото в галерее (от 0 до 6)
        const galleryCount = Math.floor(Math.random() * 7);
        for (let g = 0; g < galleryCount; g++) {
          db.prepare('INSERT INTO case_images (case_id, image_path) VALUES (?, ?)').run(caseId, img);
        }
        
        console.log(`✅ Created: ${title}`);
    } catch (err) {
        console.error(`❌ Skip existing or error for #${i}: ${err.message}`);
    }
  }

  db.close();
  console.log('✨ All done! Refresh your /cases page.');
}

seed();
