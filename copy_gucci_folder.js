const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Elmasrypc/Desktop/signature-wep/GUCCI';
const dest = 'C:/Users/Elmasrypc/signature-app/public/products/GUCCI';

function copyRecursive(s, d) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
  const entries = fs.readdirSync(s, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(s, entry.name);
    const destPath = path.join(d, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(src)) {
  copyRecursive(src, dest);
  console.log('Successfully copied GUCCI folder structure.');
} else {
  console.log('Source GUCCI folder not found.');
}
