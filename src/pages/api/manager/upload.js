export const prerender = false;
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const POST = async ({ request }) => {
  try {
    // Читаем тело как текст, чтобы избежать ошибок автоматического парсинга JSON для больших объемов
    const bodyText = await request.text();
    
    if (!bodyText) {
      console.error('❌ Upload failed: Empty body text');
      return new Response(JSON.stringify({ error: 'Empty request body' }), { status: 400 });
    }

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      console.error('❌ JSON Parse Error. Text length:', bodyText.length);
      return new Response(JSON.stringify({ error: 'Invalid JSON or truncated data: ' + e.message }), { status: 400 });
    }

    const base64 = data.base64 || data.image;
    const filename = data.filename || data.name;

    if (!base64) {
      console.error('❌ No base64 data received. Keys present:', Object.keys(data));
      return new Response(JSON.stringify({ error: 'No image data received in JSON' }), { status: 400 });
    }

    // Декодируем Base64
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length === 0) {
      throw new Error('Decoded buffer is empty');
    }

    console.log(`📸 Received via Text/Base64: ${filename} (${buffer.length} bytes)`);

    const originalName = filename || "upload.jpg";
    const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '-').toLowerCase()}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    try {
      // Даже если мы уже сжали на фронте, на бэкенде тоже прогоним через sharp для гарантии формата
      await sharp(buffer)
        .jpeg({ quality: 80 })
        .toFile(filePath);
      console.log('✅ DB Image Saved');
    } catch (sharpError) {
      await fs.writeFile(filePath, buffer);
      console.log('✅ Raw Image Saved (sharp failed)');
    }

    return new Response(JSON.stringify({ 
      url: `/uploads/${fileName}`,
      path: `/uploads/${fileName}` 
    }), { status: 200 });

  } catch (error) {
    console.error('❌ Absolute Upload API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
