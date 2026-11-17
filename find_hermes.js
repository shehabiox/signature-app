const fs = require('fs');
const products = JSON.parse(fs.readFileSync('public/products.json', 'utf8'));
const hermes = products.filter(p => p.brand === 'HERMÈS');
console.log('Hermes products count:', hermes.length);
hermes.forEach((p, i) => {
  console.log(`${i+1}: ${p.id} - ${p.title}`);
});
