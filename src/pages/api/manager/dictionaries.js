export const prerender = false;
import db from "../../../lib/db";

export const POST = async ({ request }) => {
  try {
    const { table, id, name, image_path, direction, action } = await request.json();
    
    if (table !== 'manufacturers' && table !== 'types') {
       return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400 });
    }

    if (action === 'delete' && id) {
       db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
       return new Response(JSON.stringify({ success: true }));
    }

    if (action === 'reorder' && id && direction) {
       const current = db.prepare(`SELECT id, sort_order FROM ${table} WHERE id = ?`).get(id);
       let neighbor;
       if (direction === 'up') {
         neighbor = db.prepare(`SELECT id, sort_order FROM ${table} WHERE sort_order < ? ORDER BY sort_order DESC LIMIT 1`).get(current.sort_order);
       } else {
         neighbor = db.prepare(`SELECT id, sort_order FROM ${table} WHERE sort_order > ? ORDER BY sort_order ASC LIMIT 1`).get(current.sort_order);
       }

       if (neighbor) {
         const update = db.transaction(() => {
           db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).run(neighbor.sort_order, current.id);
           db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).run(current.sort_order, neighbor.id);
         });
         update();
       }
       return new Response(JSON.stringify({ success: true }));
    }

    if (id) {
       // UPDATE
       if (table === 'manufacturers') {
         db.prepare('UPDATE manufacturers SET name = ?, image_path = ? WHERE id = ?').run(name, image_path, id);
       } else {
         db.prepare('UPDATE types SET name = ? WHERE id = ?').run(name, id);
       }
    } else {
       // INSERT
       const maxS = db.prepare(`SELECT MAX(sort_order) as s FROM ${table}`).get().s || 0;
       if (table === 'manufacturers') {
         db.prepare('INSERT INTO manufacturers (name, image_path, sort_order) VALUES (?, ?, ?)').run(name, image_path || null, maxS + 1);
       } else {
         db.prepare('INSERT INTO types (name, sort_order) VALUES (?, ?)').run(name, maxS + 1);
       }
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('❌ Dictionaries API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
