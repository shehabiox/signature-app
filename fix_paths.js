const fs = require('fs');
const path = require('path');

const srcJsonPath = 'C:/Users/Elmasrypc/Desktop/signature-wep/products.json';
const destJsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';

try {
  const desktopData = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
  const products = desktopData.products.map(p => {
    let brandName = p.brand;
    if (brandName === 'HERMES') brandName = 'HERMÈS';

    let id = p.id;
    if (brandName === 'GUCCI' && id.startsWith('GUC-')) {
      id = id.replace('GUC-', 'GUCCI-');
    }

    const folder = p.folder; // e.g. "GUCCI/01-navy-green-gg-silk-jacquard-tie"
    const imgs = p.images || [];

    // Sort: unnumbered first, then numbered (2), (3), etc.
    const unnumbered = imgs.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = imgs.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();
    const sortedImages = [...unnumbered, ...numbered];

    const primaryImg = sortedImages.length > 0 ? sortedImages[0] : '';
    const imagePath = `/products/${folder}/${primaryImg}`;
    const allImagePaths = sortedImages.map(img => `/products/${folder}/${img}`);

    return {
      id: id,
      variantId: `gid://shopify/ProductVariant/${id}`,
      title: `${brandName} - ${p.name} (${p.color})`,
      brand: brandName,
      price: `${p.price_without_box}.00`,
      boxPrice: `${p.price_with_box}.00`,
      originalPrice: `${p.price_with_box + 200}.00`,
      currency: "LE",
      image: imagePath,
      images: allImagePaths,
      material: p.material,
      width: `${typeof p.width_cm === 'number' ? p.width_cm.toFixed(1) : p.width_cm} CM`,
      length: `${p.length_cm} CM`,
      specifications: {
        "Brand": brandName,
        "Material": p.material,
        "Width": `${typeof p.width_cm === 'number' ? p.width_cm.toFixed(1) : p.width_cm} CM`,
        "Length": `${p.length_cm} CM`,
        "Price Without Box": `${p.price_without_box}.00 LE`,
        "Price Including Box": `${p.price_with_box}.00 LE`
      }
    };
  });

  fs.writeFileSync(destJsonPath, JSON.stringify(products, null, 2));
  console.log(`Successfully generated ${products.length} products with direct subfolder paths.`);
} catch (e) {
  console.error('Error in script:', e);
}
