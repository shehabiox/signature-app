const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
const hermes = data.products.filter(p => p.brand === 'HERMES' && (p.folder.includes('02') || p.folder.includes('07')));
console.log(JSON.stringify(hermes, null, 2));
