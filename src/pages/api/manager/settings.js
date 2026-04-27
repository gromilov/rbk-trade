export const prerender = false;
import db from "../../../lib/db";

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    
    // Используем транзакцию для надежности
    const transaction = db.transaction((dataObj) => {
      for (const [key, value] of Object.entries(dataObj)) {
        upsert.run(key, value?.toString() || "");
      }
    });

    transaction(data);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Settings API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
