export const prerender = false;
import db from "../../../lib/db";

export const GET = async ({ url, redirect }) => {
  const id = url.searchParams.get("id");
  
  if (id) {
    // Удаляем связанные фото
    db.prepare('DELETE FROM case_images WHERE case_id = ?').run(id);
    // Удаляем сам проект
    db.prepare('DELETE FROM cases WHERE id = ?').run(id);
  }

  return redirect('/manager/cases');
};
