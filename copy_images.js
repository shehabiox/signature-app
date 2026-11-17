const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Elmasrypc/Desktop/signature-wep';
const destDir = 'C:/Users/Elmasrypc/signature-app/public/products';

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'New folder' && entry.name !== '.git') {
        copyRecursive(srcPath, destPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg') || entry.name.endsWith('.png') || entry.name.endsWith('.webp'))) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

copyRecursive(srcDir, destDir);
console.log('Image copy complete!');
