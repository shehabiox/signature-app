const fs = require('fs');
const path = require('path');

const jsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';
const publicDir = 'C:/Users/Elmasrypc/signature-app/public';

try {
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let missing = [];

  products.forEach((p, idx) => {
    const allImg = [p.image, ...(p.images || [])];
    allImg.forEach(imgUrl => {
      // imgUrl e.g. /products/BURBERRY/01-bt-lined-silk-tie/BURBERRY - BT LINED SILK TIE.jpg
      const rel = imgUrl.replace(/^\//, '');
      const full = path.join(publicDir, rel);
      if (!fs.existsSync(full)) {
        missing.push({ id: p.id, imgUrl, full });
      }
    });
  });

  console.log(`Total products: ${products.length}`);
  console.log(`Missing images count: ${missing.length}`);
  if (missing.length > 0) {
    console.log('Sample missing:', missing.slice(0, 5));
  }
} catch (e) {
  console.error(e);
}
