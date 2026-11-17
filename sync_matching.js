const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Elmasrypc/Desktop/matching';
const destDir = path.join('public', 'matching');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

try {
  console.log('Syncing matching directory from Desktop...');
  copyRecursive(srcDir, destDir);
  console.log('Successfully synced all matching subfolders and files to public/matching');
} catch (e) {
  console.error('Error syncing matching files:', e);
}
