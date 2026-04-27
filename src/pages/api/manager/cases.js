export const prerender = false;
import db from "../../../lib/db";

export const POST = async ({ request }) => {
  try {
    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const fd = await request.formData();
      data = Object.fromEntries(fd.entries());
      // Парсим задачи если они пришли строкой (хотя JSON предпочтительнее)
      if (typeof data.tasks === 'string') {
          try { data.tasks = JSON.parse(data.tasks); } catch(e) {}
      }
    }

    const { 
      id, title, slug, subtitle, main_image, 
      type_id, manufacturer_id, tasks, gallery = [],
      result_text, review_text, review_author 
    } = data;

    const tasksJson = JSON.stringify(tasks || []);

    if (id) {
      // Редактирование
      const stmt = db.prepare(`
        UPDATE cases SET 
          title = ?, slug = ?, subtitle = ?, 
          main_image = ?, type_id = ?, manufacturer_id = ?, 
          tasks = ?, result_text = ?, review_text = ?, 
          review_author = ?
        WHERE id = ?
      `);
      stmt.run(
        title, slug, subtitle, 
        main_image, type_id, manufacturer_id, 
        tasksJson, result_text, review_text, 
        review_author, id
      );

      // Синхронизация галереи
      db.prepare('DELETE FROM case_images WHERE case_id = ?').run(id);
      const insertImg = db.prepare('INSERT INTO case_images (case_id, image_path) VALUES (?, ?)');
      for (const img of gallery) {
          insertImg.run(id, img);
      }

    } else {
      // Создание
      const stmt = db.prepare(`
        INSERT INTO cases (
          title, slug, subtitle, main_image, 
          type_id, manufacturer_id, tasks, 
          result_text, review_text, review_author
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        title, slug, subtitle, main_image, 
        type_id, manufacturer_id, tasksJson, 
        result_text, review_text, review_author
      );
      const newId = result.lastInsertRowid;

      // Вставка галереи для нового
      const insertImg = db.prepare('INSERT INTO case_images (case_id, image_path) VALUES (?, ?)');
      for (const img of gallery) {
          insertImg.run(newId, img);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};
