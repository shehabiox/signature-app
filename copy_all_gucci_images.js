const fs = require('fs');
const path = require('path');

const srcRoot = 'C:/Users/Elmasrypc/Desktop/signature-wep/GUCCI';
const destRoot = 'C:/Users/Elmasrypc/signature-app/public/products/GUCCI';

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
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcRoot)) {
  copyRecursive(srcRoot, destRoot);
  console.log('Successfully copied all GUCCI images!');
} else {
  console.log('Source GUCCI folder not found.');
}
