const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'public/products');
if (!fs.existsSync(productsDir)) {
  console.error('Products directory not found:', productsDir);
  process.exit(1);
}

const brandFolders = fs.readdirSync(productsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let allProducts = [];
let idCounter = 1;

const brandNameMap = {
  'BURBERRY': 'BURBERRY',
  'CHANEL': 'CHANEL',
  'DIOR': 'DIOR',
  'GIVENCHY': 'GIVENCHY',
  'GUCCI': 'GUCCI',
  'HERMES': 'HERMÈS',
  'HERMES_!': 'HERMÈS',
  'LOUIS VUITTON': 'LOUIS VUITTON',
  'Salvatore Ferragamo': 'FERRAGAMO'
};

for (const brandFolder of brandFolders) {
  const brandPath = path.join(productsDir, brandFolder);
  const subfolders = fs.readdirSync(brandPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const mappedBrand = brandNameMap[brandFolder] || brandFolder.replace(/_/g, ' ').toUpperCase();

  for (const sub of subfolders) {
    const subPath = path.join(brandPath, sub);
    const files = fs.readdirSync(subPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    if (files.length > 0) {
      // Extract price and box price from subfolder name if possible
      let price = "1400.00";
      let boxPrice = "1600.00";

      const priceMatch = sub.match(/(\d{3,4})\D+without\D+box\D*(\d{3,4})?/i) || sub.match(/(\d{4})/);
      if (priceMatch) {
        price = `${priceMatch[1]}.00`;
        if (priceMatch[2]) {
          boxPrice = `${priceMatch[2]}.00`;
        } else {
          boxPrice = `${parseInt(priceMatch[1]) + 200}.00`;
        }
      }

      const mainImg = files[0];
      const images = files.map(f => `/products/${brandFolder}/${sub}/${f}`);

      // Clean title from subfolder or main image
      let cleanTitle = sub.replace(/_/g, ' ').replace(/-/g, ' ');
      if (cleanTitle.match(/^\d+/) || cleanTitle.toLowerCase().includes('same window')) {
        cleanTitle = path.basename(mainImg, path.extname(mainImg)).replace(/_/g, ' ').replace(/-/g, ' ');
      }

      allProducts.push({
        id: `${mappedBrand.substring(0, 3).toUpperCase()}-${idCounter++}`,
        variantId: `gid://shopify/ProductVariant/${idCounter}`,
        title: `${mappedBrand} - ${cleanTitle}`,
        brand: mappedBrand,
        price: price,
        boxPrice: boxPrice,
        originalPrice: `${parseInt(price) + 300}.00`,
        currency: "LE",
        image: `/products/${brandFolder}/${sub}/${mainImg}`,
        images: images,
        material: "100% Pure Jacquard Mulberry Silk",
        width: "7.5 CM",
        length: "147 CM",
        specifications: {
          "Brand": mappedBrand,
          "Material": "100% Pure Silk",
          "Width": "7.5 CM",
          "Length": "147 CM",
          "Price Without Box": `${price} LE`,
          "Price Including Box": `${boxPrice} LE`
        }
      });
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'public/products.json'), JSON.stringify(allProducts, null, 2));
console.log(`Generated products.json with ${allProducts.length} products successfully.`);
