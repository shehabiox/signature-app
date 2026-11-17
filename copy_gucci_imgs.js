const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Elmasrypc/Desktop/signature-wep/GUCCI';
const destDir = 'C:/Users/Elmasrypc/signature-app/public/products/GUCCI';

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

try {
  copyRecursive(srcDir, destDir);
  console.log('Gucci images copied successfully!');
} catch (err) {
  console.error('Error copying Gucci images:', err);
}
