const fs = require('fs');
const path = require('path');

const srcWep = 'C:/Users/Elmasrypc/Desktop/signature-wep';
const srcJsonPath = path.join(srcWep, 'products.json');
const destJsonPath = path.join('public', 'products.json');
const publicProductsDir = path.join('public', 'products');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function normalizeFilename(name) {
  return (name || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function findFileInDirNormalized(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const targetNorm = normalizeFilename(filename);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    if (!entry.isDirectory() && normalizeFilename(entry.name) === targetNorm) {
      return path.join(dir, entry.name);
    }
  }
  return null;
}

function getActualFilesInFolder(folderPath) {
  const fullDir = path.join('public', 'products', folderPath);
  if (!fs.existsSync(fullDir)) return [];
  const files = fs.readdirSync(fullDir, { withFileTypes: true })
    .filter(e => !e.isDirectory() && /\.(jpg|jpeg|png|webp)$/i.test(e.name) && !e.name.toLowerCase().includes('description') && !e.name.toLowerCase().includes('price'))
    .map(e => path.join(fullDir, e.name));

  // Robust sort: strictly ensure files without parenthesized numbers like (2) or ( 2) come FIRST
  files.sort((a, b) => {
    const aBase = path.basename(a);
    const bBase = path.basename(b);
    const aHasNum = /\(\s*\d+\s*\)/.test(aBase);
    const bHasNum = /\(\s*\d+\s*\)/.test(bBase);
    if (!aHasNum && bHasNum) return -1;
    if (aHasNum && !bHasNum) return 1;
    return aBase.localeCompare(bBase);
  });
  return files;
}

try {
  console.log('Copying brand folders from signature-wep...');
  const brands = ['BURBERRY', 'CHANEL', 'DIOR', 'GIVENCHY', 'GUCCI', 'HERMES', 'LOUIS VUITTON', 'Salvatore Ferragamo'];
  brands.forEach(b => {
    const brandSrc = path.join(srcWep, b);
    const brandDest = path.join(publicProductsDir, b);
    if (fs.existsSync(brandSrc)) {
      copyRecursive(brandSrc, brandDest);
    }
  });

  console.log('Reading signature-wep products.json...');
  const desktopData = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
  let rawProducts = desktopData.products || [];

  rawProducts = rawProducts.map(p => {
    if (p.brand === 'HERMES' && p.id === 'HER-007') {
      return {
        ...p,
        folder: 'HERMES/07-navy-blue-hermes-paris-tie-2'
      };
    }
    return p;
  });

  const seenIds = new Set();
  const seenKeys = new Set();
  const uniqueRawProducts = [];

  rawProducts.forEach(p => {
    const key = `${p.brand}-${p.name}-${p.color}-${p.folder}`.toLowerCase();
    if (!seenIds.has(p.id) && !seenKeys.has(key)) {
      seenIds.add(p.id);
      seenKeys.add(key);
      uniqueRawProducts.push(p);
    } else {
      const modifiedP = { ...p, id: p.id + '-' + Math.random().toString(36).substring(2, 5) };
      uniqueRawProducts.push(modifiedP);
    }
  });

  const products = uniqueRawProducts.map(p => {
    let brandName = p.brand;
    if (brandName === 'HERMES') brandName = 'HERMÈS';

    let id = p.id;
    if (brandName === 'GUCCI' && id.startsWith('GUC-')) {
      id = id.replace('GUC-', 'GUCCI-');
    }

    const brandDir = path.join(publicProductsDir, p.brand);
    let resolvedImages = [];

    const imgs = p.images || [];

    imgs.forEach(imgName => {
      const foundPath = findFileInDirNormalized(path.join('public', 'products', p.folder), imgName) ||
                        findFileInDirNormalized(brandDir, imgName);
      if (foundPath) {
        const actualFilename = path.basename(foundPath);
        const dirRel = path.relative('public', path.dirname(foundPath));
        const rel = path.join(dirRel, actualFilename);
        resolvedImages.push('/' + rel.split(path.sep).map(seg => encodeURIComponent(seg)).join('/'));
      }
    });

    if (resolvedImages.length === 0 || resolvedImages.length < imgs.length) {
      const diskFiles = getActualFilesInFolder(p.folder);
      resolvedImages = diskFiles.map(filePath => {
        const actualFilename = path.basename(filePath);
        const dirRel = path.relative('public', path.dirname(filePath));
        const rel = path.join(dirRel, actualFilename);
        return '/' + rel.split(path.sep).map(seg => encodeURIComponent(seg)).join('/');
      });
    }

    // Special sorting for Hermes 07
    if (p.folder === 'HERMES/07-navy-blue-hermes-paris-tie-2' && resolvedImages.length >= 2) {
      const boxImg = resolvedImages.find(img => !img.toLowerCase().includes('%282%29'));
      const rollImg = resolvedImages.find(img => img.toLowerCase().includes('%282%29'));
      if (boxImg && rollImg) {
        resolvedImages = [boxImg, rollImg];
      }
    }

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
  console.log(`Successfully built catalog with robust unnumbered-first image sorting (${products.length} products total).`);
} catch (e) {
  console.error('Error building catalog:', e);
}
