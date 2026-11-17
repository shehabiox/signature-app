const fs = require('fs');

const file = 'C:/Users/Elmasrypc/signature-app/public/products.json';
const products = JSON.parse(fs.readFileSync(file, 'utf8'));

products.forEach(p => {
  if (p.brand === 'GUCCI' && p.images && p.images.length > 0) {
    // Separate unnumbered vs numbered images
    // Unnumbered means filename doesn't have " (2)", " (3)", etc. before extension, or is the base image
    const unnumbered = p.images.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = p.images.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();

    // Combine: unnumbered first, then numbered
    const sortedImages = [...unnumbered, ...numbered];
    if (sortedImages.length > 0) {
      p.image = sortedImages[0];
      p.images = sortedImages;
    }
  }
});

fs.writeFileSync(file, JSON.stringify(products, null, 2));
console.log('Successfully sorted Gucci product images: unnumbered first as main image, followed by numbered thumbnails.');
