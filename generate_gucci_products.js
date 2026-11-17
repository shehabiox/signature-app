const fs = require('fs');
const path = require('path');

try {
  const desktopData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
  const gucciProducts = desktopData.products.filter(p => p.brand === 'GUCCI');

  const formattedGucci = gucciProducts.map((p, index) => {
    const id = `GUCCI-${String(index + 1).padStart(3, '0')}`;
    const folder = p.folder; // e.g. "01-navy-green-gg-silk-jacquard-tie"

    // Find files in public/products/GUCCI/{folder}
    const folderPath = path.join('C:/Users/Elmasrypc/signature-app/public/products/GUCCI', folder);
    let imageFiles = [];
    if (fs.existsSync(folderPath)) {
      imageFiles = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.toLowerCase().includes('description'));
    }

    // Sort: unnumbered first, then numbered (2), (3), etc.
    const unnumbered = imageFiles.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = imageFiles.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();
    const sortedImages = [...unnumbered, ...numbered];

    const primaryImg = sortedImages.length > 0 ? sortedImages[0] : (p.images && p.images[0] ? p.images[0] : '');
    const allImgs = sortedImages.length > 0 ? sortedImages : (p.images || []);

    return {
      id: id,
      variantId: `gid://shopify/ProductVariant/${id}`,
      title: `GUCCI - ${p.name} (${p.color})`,
      brand: "GUCCI",
      price: `${p.price_without_box}.00`,
      boxPrice: `${p.price_with_box}.00`,
      originalPrice: `${p.price_with_box + 200}.00`,
      currency: "LE",
      image: `/products/GUCCI/${folder}/${primaryImg}`,
      images: allImgs.map(img => `/products/GUCCI/${folder}/${img}`),
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

  const currentProducts = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', 'utf8'));
  const nonGucci = currentProducts.filter(p => p.brand !== 'GUCCI');

  const combined = [...formattedGucci, ...nonGucci];
  fs.writeFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', JSON.stringify(combined, null, 2));
  console.log(`Generated ${formattedGucci.length} Gucci products matching desktop folder structure.`);
} catch (e) {
  console.error('Error generating Gucci products:', e);
}
