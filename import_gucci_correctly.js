const fs = require('fs');

try {
  const desktopData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
  const gucciProducts = desktopData.products.filter(p => p.brand === 'GUCCI');

  const formattedGucci = gucciProducts.map((p, index) => {
    const id = `GUCCI-${String(index + 1).padStart(3, '0')}`;

    // Sort images: put unnumbered first, then numbered (2), (3), etc.
    let imgs = p.images || [];
    const unnumbered = imgs.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = imgs.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();
    const sortedImages = [...unnumbered, ...numbered];

    const primaryImg = sortedImages.length > 0 ? sortedImages[0] : '';
    const imagePath = `/products/${p.folder}/${primaryImg}`;
    const allImagePaths = sortedImages.map(img => `/products/${p.folder}/${img}`);

    return {
      id: id,
      variantId: `gid://shopify/ProductVariant/${id}`,
      title: `GUCCI - ${p.name} (${p.color})`,
      brand: "GUCCI",
      price: `${p.price_without_box}.00`,
      boxPrice: `${p.price_with_box}.00`,
      originalPrice: `${p.price_with_box + 200}.00`,
      currency: "LE",
      image: imagePath,
      images: allImagePaths,
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
  console.log(`Successfully imported ${formattedGucci.length} Gucci products with unnumbered main images and numbered gallery thumbnails.`);
} catch (e) {
  console.error('Error importing Gucci products:', e);
}
