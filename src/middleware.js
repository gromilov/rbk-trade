import fs from 'node:fs/promises';
import path from 'node:path';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  
  // Если запрос идет к /uploads/
  if (url.pathname.startsWith('/uploads/')) {
    const fileName = url.pathname.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
      };

      return new Response(data, {
        headers: {
          'Content-Type': mimeTypes[ext] || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    } catch (e) {
      // Если файла нет, просто идем дальше (выдаст 404 стандартно)
      return new Response('Not found', { status: 404 });
    }
  }

  // Для всех остальных запросов продолжаем выполнение
  return next();
});
