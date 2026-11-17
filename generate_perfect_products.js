const fs = require('fs');
const path = require('path');

const srcJsonPath = 'C:/Users/Elmasrypc/Desktop/signature-wep/products.json';
const destJsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';
const publicProductsDir = 'C:/Users/Elmasrypc/signature-app/public/products';

function findFileRecursive(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFileRecursive(fullPath, filename);
      if (found) return found;
    } else if (entry.name.toLowerCase() === filename.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

try {
  const desktopData = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
  const products = desktopData.products.map(p => {
    let brandName = p.brand;
    if (brandName === 'HERMES') brandName = 'HERMÈS';

    let id = p.id;
    if (brandName === 'GUCCI' && id.startsWith('GUC-')) {
      id = id.replace('GUC-', 'GUCCI-');
    }

    const brandDir = path.join(publicProductsDir, p.brand);
    const resolvedImages = [];

    const imgs = p.images || [];
    // Sort: unnumbered first, then numbered (2), (3), etc.
    const unnumbered = imgs.filter(img => !/\(\d+\)\.[a-zA-Z0-9]+$/.test(img));
    const numbered = imgs.filter(img => /\(\d+\)\.[a-zA-Z0-9]+$/.test(img)).sort();
    const sortedImgs = [...unnumbered, ...numbered];

    sortedImgs.forEach(imgName => {
      const foundPath = findFileRecursive(brandDir, imgName);
      let webPath = '';
      if (foundPath) {
        const rel = path.relative('C:/Users/Elmasrypc/signature-app/public', foundPath);
        // Properly URL encode each path segment to handle spaces and special chars correctly
        webPath = '/' + rel.split(path.sep).map(segment => encodeURIComponent(segment)).join('/');
      } else {
        const fallbackRel = `products/${p.folder}/${imgName}`;
        webPath = '/' + fallbackRel.split('/').map(segment => encodeURIComponent(segment)).join('/');
      }
      resolvedImages.push(webPath);
    });

    const primaryImage = resolvedImages.length > 0 ? resolvedImages[0] : '';

    return {
      id: id,
      variantId: `gid://shopify/ProductVariant/${id}`,
      title: `${brandName} - ${p.name} (${p.color})`,
      brand: brandName,
      price: `${p.price_without_box}.00`,
      boxPrice: `${p.price_with_box}.00`,
      originalPrice: `${p.price_with_box + 200}.00`,
      currency: "LE",
      image: primaryImage,
      images: resolvedImages,
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
  console.log(`Successfully generated ${products.length} products with URI-encoded image paths.`);
} catch (e) {
  console.error('Error in generate_perfect_products:', e);
}
