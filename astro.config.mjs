import { defineConfig } from 'astro/config';
import htmlFormatterPkg from 'html-formatter';
const { format } = htmlFormatterPkg;
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import node from '@astrojs/node';

// Функция для рекурсивного поиска HTML файлов
function findHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [],
  build: {
    assets: 'assets',
    format: 'directory'
  },

  // Хук для форматирования HTML после сборки
  // hooks: {
  //   'astro:build:done': ({ dir }) => {
  //     console.log('📝 Formatting HTML files...');

  //     const distDir = dir.pathname;
  //     console.log('📁 Build directory:', distDir);

  //     const htmlFiles = findHtmlFiles(distDir);
  //     console.log(`📄 Found ${htmlFiles.length} HTML files to format`);

  //     htmlFiles.forEach(filePath => {
  //       try {
  //         // Читаем исходный HTML
  //         const originalHtml = readFileSync(filePath, 'utf8');

  //         // Форматируем HTML
  //         const formattedHtml = format(originalHtml, {
  //           indent_size: 2,
  //           indent_char: ' ',
  //           max_char: 0,
  //           unformatted: ['code', 'pre', 'em', 'strong', 'span'],
  //           indent_inner_html: false,
  //           preserve_newlines: true,
  //           break_chained_methods: false,
  //           extra_liners: []
  //         });

  //         // Записываем отформатированный HTML обратно
  //         writeFileSync(filePath, formattedHtml, 'utf8');
  //         console.log(`✅ Formatted: ${filePath.replace(distDir, '')}`);
  //       } catch (error) {
  //         console.error(`❌ Error formatting ${filePath}:`, error.message);
  //       }
  //     });

  //     console.log(`🎉 Finished formatting ${htmlFiles.length} HTML files`);
  //   }
  // },

  vite: {
    build: {
      minify: false,
      cssCodeSplit: false,
      // rollupOptions: {
      //   output: {
      //     entryFileNames: 'js/[name].js',
      //     assetFileNames: (assetInfo) => {
      //       if (assetInfo.name?.endsWith('.css')) {
      //         return 'css/style.css';
      //       }
      //       return 'images/[name].[ext]';
      //     }
      //   }
      // }
    },
    css: {
      minify: false,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "/src/styles/variables" as *;
          `
        }
      }
    }
  }
});