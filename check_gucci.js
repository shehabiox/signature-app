const fs = require('fs');
const srcData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
const gucci = srcData.products.filter(p => p.brand === 'GUCCI');
console.log('Total Gucci products in desktop products.json:', gucci.length);
gucci.forEach(p => console.log(p.id, p.name, p.color));
