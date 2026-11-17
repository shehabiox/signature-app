const fs = require('fs');
const products = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', 'utf8'));
const gucci = products.filter(p => p.brand === 'GUCCI');

let output = '';
gucci.forEach(p => {
  output += `ID: ${p.id}\n`;
  output += `  Main Image: ${p.image}\n`;
  output += `  All Images: ${JSON.stringify(p.images)}\n`;
});
fs.writeFileSync('C:/Users/Elmasrypc/signature-app/gucci_check_output.txt', output);
