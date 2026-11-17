const fs = require('fs');

const srcData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
const gucciProducts = srcData.products.filter(p => p.brand === 'GUCCI');

console.log(`Found ${gucciProducts.length} Gucci products.`);

const formattedGucci = gucciProducts.map((p, index) => {
  const id = `GUCCI-${String(index + 1).padStart(3, '0')}`;
  return {
    id: id,
    variantId: `gid://shopify/ProductVariant/${id}`,
    title: `GUCCI - ${p.name} (${p.color})`,
    brand: "GUCCI",
    price: `${p.price_without_box}.00`,
    boxPrice: `${p.price_with_box}.00`,
    originalPrice: `${p.price_with_box + 200}.00`,
    currency: "LE",
    image: `/products/${p.folder}/${p.images[0]}`,
    images: p.images.map(img => `/products/${p.folder}/${img}`),
    material: p.material,
    width: `${p.width_cm.toFixed(1)} CM`,
    length: `${p.length_cm} CM`,
    specifications: {
      "Brand": "GUCCI",
      "Material": p.material,
      "Width": `${p.width_cm.toFixed(1)} CM`,
      "Length": `${p.length_cm} CM`,
      "Price Without Box": `${p.price_without_box}.00 LE`,
      "Price Including Box": `${p.price_with_box}.00 LE`
    }
  };
});

const currentAppProducts = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', 'utf8'));
const nonGucci = currentAppProducts.filter(p => p.brand !== 'GUCCI');

const combined = [...formattedGucci, ...nonGucci];

fs.writeFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', JSON.stringify(combined, null, 2));
console.log(`Updated products.json with ${formattedGucci.length} Gucci products. Total products: ${combined.length}`);
