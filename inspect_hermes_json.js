const fs = require('fs');
const products = JSON.parse(fs.readFileSync('public/products.json', 'utf8'));
const hermes = products.filter(p => p.brand === 'HERMÈS');
hermes.forEach((p, i) => {
  if (p.images.some(img => img.includes('07-navy-blue-hermes-paris-tie-2'))) {
    console.log(`Hermes 07 found at index ${i}:`);
    console.log('Main image:', p.image);
    console.log('All images:', p.images);
  }
});
