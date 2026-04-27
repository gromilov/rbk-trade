export const prerender = false;
import db from "../../../lib/db";

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, title, address, phone, email, work_time, map_url, image_path } = data;
    
    if (id) {
      // UPDATE
      db.prepare(`
        UPDATE stores SET 
          title = ?, address = ?, phone = ?, 
          email = ?, work_time = ?, map_url = ?, image_path = ? 
        WHERE id = ?
      `).run(title, address, phone, email, work_time, map_url, image_path, id);
    } else {
      // INSERT
      db.prepare(`
        INSERT INTO stores (title, address, phone, email, work_time, map_url, image_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(title, address, phone || "", email || "", work_time || "", map_url || "", image_path || "");
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Store Save API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
