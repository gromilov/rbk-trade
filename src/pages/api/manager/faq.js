export const prerender = false;
import db from "../../../lib/db";

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, question, answer } = data;
    
    if (id) {
      // UPDATE
      db.prepare('UPDATE faqs SET question = ?, answer = ? WHERE id = ?').run(question, answer, id);
    } else {
      // INSERT
      const maxSort = db.prepare('SELECT MAX(sort_order) as maxS FROM faqs').get().maxS || 0;
      db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)')
        .run(question, answer, maxSort + 1);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ FAQ Save API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH = async ({ request }) => {
  try {
    const { id, direction } = await request.json();
    
    // Получаем текущий элемент
    const current = db.prepare('SELECT id, sort_order FROM faqs WHERE id = ?').get(id);
    if (!current) throw new Error('Not found');

    // Ищем соседа для обмена
    let neighbor;
    if (direction === 'up') {
      neighbor = db.prepare('SELECT id, sort_order FROM faqs WHERE sort_order < ? ORDER BY sort_order DESC LIMIT 1').get(current.sort_order);
    } else {
      neighbor = db.prepare('SELECT id, sort_order FROM faqs WHERE sort_order > ? ORDER BY sort_order ASC LIMIT 1').get(current.sort_order);
    }

    if (neighbor) {
      const update = db.transaction(() => {
        db.prepare('UPDATE faqs SET sort_order = ? WHERE id = ?').run(neighbor.sort_order, current.id);
        db.prepare('UPDATE faqs SET sort_order = ? WHERE id = ?').run(current.sort_order, neighbor.id);
      });
      update();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE = async ({ request }) => {
  try {
    const data = await request.json();
    const { id } = data;
    
    db.prepare('DELETE FROM faqs WHERE id = ?').run(id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ FAQ Delete API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
