const fs = require('fs');
const path = require('path');

const srcWep = 'C:/Users/Elmasrypc/Desktop/signature-wep';
const publicProductsDir = 'C:/Users/Elmasrypc/signature-app/public/products';

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
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const brands = ['BURBERRY', 'CHANEL', 'DIOR', 'GIVENCHY', 'GUCCI', 'HERMES', 'LOUIS VUITTON', 'Salvatore Ferragamo'];
brands.forEach(b => {
  const brandSrc = path.join(srcWep, b);
  const brandDest = path.join(publicProductsDir, b);
  if (fs.existsSync(brandSrc)) {
    copyRecursive(brandSrc, brandDest);
    console.log(`Copied brand folder: ${b}`);
  }
});

console.log('Finished copying all brand image assets.');
