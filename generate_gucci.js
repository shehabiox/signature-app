const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/Elmasrypc/Desktop/signature-wep/products.json';
const destPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';

const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const gucciProducts = data.products
  .filter(p => p.brand === 'GUCCI')
  .map((p, idx) => {
    // folder is like "GUCCI/01-navy-green-gg-silk-jacquard-tie"
    // images are like ["GUCCI - Navy and Green GG SILKJACQUARD TIE.jpg", "GUCCI - Navy and Green GG SILKJACQUARD TIE (2).jpg"]
    // Ensure primary tie photo (without (2) or first) is primary
    const images = p.images.map(img => `/products/${p.folder}/${img}`);
    const primaryImage = images[0];

    return {
      id: `GUC-${idx + 1}`,
      variantId: `gid://shopify/ProductVariant/GUC-${idx + 1}`,
      title: `GUCCI - ${p.name} (${p.color})`,
      brand: 'GUCCI',
      price: `${p.price_without_box}.00`,
      boxPrice: `${p.price_with_box}.00`,
      originalPrice: `${p.price_without_box + 300}.00`,
      currency: 'LE',
      image: primaryImage,
      images: images,
      material: p.material || '100% Pure Jacquard Silk',
      width: `${p.width_cm} CM`,
      length: `${p.length_cm} CM`,
      specifications: {
        "Brand": "GUCCI",
        "Material": p.material || 'Silk Jacquard',
        "Width": `${p.width_cm} CM`,
        "Length": `${p.length_cm} CM`,
        "Price Without Box": `${p.price_without_box}.00 LE`,
        "Price Including Box": `${p.price_with_box}.00 LE`
      }
    };
  });

fs.writeFileSync(destPath, JSON.stringify(gucciProducts, null, 2));
console.log(`Successfully generated ${gucciProducts.length} Gucci products in products.json`);
