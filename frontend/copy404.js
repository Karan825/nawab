import fs from 'node:fs';
try {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  console.log('✅ Generated dist/404.html for GitHub Pages SPA routing');
} catch (e) {
  console.warn('Note on 404 copy:', e);
}
