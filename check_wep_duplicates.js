const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
const products = data.products || [];
console.log('Total in signature-wep:', products.length);

const seenIds = new Map();
const seenTitles = new Map();
products.forEach(p => {
  if (seenIds.has(p.id)) {
    console.log(`Duplicate ID found: ${p.id} (${p.brand} - ${p.name})`);
  } else {
    seenIds.set(p.id, true);
  }

  const key = `${p.brand}-${p.name}-${p.color}`;
  if (seenTitles.has(key)) {
    console.log(`Duplicate Title/Color found: ${p.brand} - ${p.name} (${p.color})`);
  } else {
    seenTitles.set(key, true);
  }
});
