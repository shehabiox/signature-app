const fs = require('fs');
const path = require('path');

const srcBase = 'C:/Users/Elmasrypc/Desktop/signature-wep/GUCCI';
const destBase = 'C:/Users/Elmasrypc/signature-app/public/products/GUCCI';

if (!fs.existsSync(destBase)) {
  fs.mkdirSync(destBase, { recursive: true });
}

const subdirs = fs.readdirSync(srcBase, { withFileTypes: true }).filter(d => d.isDirectory());
subdirs.forEach(dir => {
  const folderName = dir.name;
  const srcDir = path.join(srcBase, folderName);
  const destDir = path.join(destBase, folderName);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcFile, destFile);
    }
  });
});

console.log('Successfully copied all Gucci subfolders and images!');
