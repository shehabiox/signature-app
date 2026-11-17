const fs = require('fs');
const path = require('path');

const jsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';
const publicDir = 'C:/Users/Elmasrypc/signature-app/public';

try {
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let missingCount = 0;
  let totalImages = 0;

  products.forEach(p => {
    const images = [p.image, ...(p.images || [])];
    images.forEach(imgUrl => {
      totalImages++;
      // imgUrl is like /products/BURBERRY/...
      const relativePath = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
      const fullPath = path.join(publicDir, relativePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`Missing image: ${fullPath}`);
        missingCount++;
      }
    });
  });

  console.log(`Checked ${totalImages} image paths. Missing: ${missingCount}`);
} catch (e) {
  console.error('Error:', e);
}
