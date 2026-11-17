const fs = require('fs');
const path = require('path');

const srcRoot = 'C:/Users/Elmasrypc/Desktop/signature-wep/DIOR';
const destRoot = 'C:/Users/Elmasrypc/signature-app/public/products/DIOR';

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
      console.log(`Copied ${entry.name}`);
    }
  }
}

if (fs.existsSync(srcRoot)) {
  copyRecursive(srcRoot, destRoot);
  console.log('Successfully copied all DIOR images!');
} else {
  console.log('Source DIOR folder not found.');
}
