const fs = require('fs');
const path = require('path');

const publicProductsDir = 'C:/Users/Elmasrypc/signature-app/public/products/GUCCI';
const productsJsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';

console.log('Checking Gucci images in public/products/GUCCI:');
if (fs.existsSync(publicProductsDir)) {
  const subfolders = fs.readdirSync(publicProductsDir, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const sub of subfolders) {
    const subPath = path.join(publicProductsDir, sub.name);
    const files = fs.readdirSync(subPath);
    console.log(`Folder: ${sub.name} -> Files:`, files);
  }
} else {
  console.log('Directory not found:', publicProductsDir);
}

console.log('\nChecking products.json image paths:');
if (fs.existsSync(productsJsonPath)) {
  const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  products.forEach((p, idx) => {
    console.log(`P${idx + 1} (${p.id}): image = ${p.image}`);
    p.images.forEach((img, i) => {
      const fullPath = path.join('C:/Users/Elmasrypc/signature-app/public', img);
      const exists = fs.existsSync(fullPath);
      if (!exists) {
        console.log(`  MISSING: ${img} (checked ${fullPath})`);
      }
    });
  });
} else {
  console.log('products.json not found');
}
