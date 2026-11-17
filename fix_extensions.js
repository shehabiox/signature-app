const fs = require('fs');
const path = require('path');

const jsonPath = 'C:/Users/Elmasrypc/signature-app/public/products.json';
const publicDir = 'C:/Users/Elmasrypc/signature-app/public';

function findExactFileOnDisk(dir, filename) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findExactFileOnDisk(fullPath, filename);
      if (found) return found;
    } else if (entry.name.toLowerCase() === filename.toLowerCase()) {
      return fullPath; // Returns exact file with correct case and extension
    }
  }
  return null;
}

try {
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let updatedCount = 0;

  products.forEach(p => {
    // Re-resolve image and images from publicDir using exact disk filename
    if (p.images && Array.isArray(p.images)) {
      p.images = p.images.map(imgUrl => {
        // Decode URI component to get original filename
        const decoded = decodeURIComponent(imgUrl);
        const filename = path.basename(decoded);
        const brandName = p.brand;
        const brandDir = path.join(publicDir, 'products', brandName);

        const exactPath = findExactFileOnDisk(brandDir, filename);
        if (exactPath) {
          const rel = path.relative(publicDir, exactPath);
          return '/' + rel.split(path.sep).map(seg => encodeURIComponent(seg)).join('/');
        }
        return imgUrl;
      });
    }

    if (p.image) {
      const decodedImg = decodeURIComponent(p.image);
      const filename = path.basename(decodedImg);
      const brandName = p.brand;
      const brandDir = path.join(publicDir, 'products', brandName);

      const exactPath = findExactFileOnDisk(brandDir, filename);
      if (exactPath) {
        const rel = path.relative(publicDir, exactPath);
        p.image = '/' + rel.split(path.sep).map(seg => encodeURIComponent(seg)).join('/');
      }
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  console.log('Successfully synchronized all image paths with exact disk case and extensions.');
} catch (e) {
  console.error('Error fixing extensions:', e);
}
