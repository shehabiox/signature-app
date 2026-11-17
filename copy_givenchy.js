const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Elmasrypc/Desktop/signature-wep/GIVENCHY/01-maroon-solid-classic-silk-tie';
const destDir = 'C:/Users/Elmasrypc/signature-app/public/products/GIVENCHY/01-maroon-solid-classic-silk-tie';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  if (fs.statSync(srcPath).isFile()) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file}`);
  }
}
console.log('Done copying Givenchy files.');
