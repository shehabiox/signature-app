const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
const hermes = data.products.filter(p => p.brand === 'HERMES');
hermes.forEach((p, i) => {
  console.log(`${i+1}. ID: ${p.id}, Folder: ${p.folder}, Name: ${p.name}, Color: ${p.color}`);
});
