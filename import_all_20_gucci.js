const fs = require('fs');

try {
  const desktopData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));

  const formattedProducts = desktopData.products.map(p => {
    let brandName = p.brand;
    if (brandName === 'HERMES') brandName = 'HERMÈS';

    // Sort images: unnumbered first, then numbered (2), (3), etc.
    const imgs = p.images || [];
    const unnumbered = imgs.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = imgs.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();
    const sortedImages = [...unnumbered, ...numbered];

    const primaryImg = sortedImages.length > 0 ? sortedImages[0] : '';
    const imagePath = `/products/${p.folder}/${primaryImg}`;
    const allImagePaths = sortedImages.map(img => `/products/${p.folder}/${img}`);

    // Generate clean ID if needed
    let id = p.id;
    if (brandName === 'GUCCI' && !id.startsWith('GUCCI-')) {
      id = id.replace('GUC-', 'GUCCI-');
    }

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

  fs.writeFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', JSON.stringify(formattedProducts, null, 2));
  console.log(`Successfully imported all ${formattedProducts.length} products (including all 20 Gucci products) from desktop products.json!`);
} catch (e) {
  console.error('Error importing products:', e);
}
