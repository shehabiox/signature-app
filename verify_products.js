const fs = require('fs');
try {
  const products = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/signature-app/public/products.json', 'utf8'));
  const counts = {};
  products.forEach(p => {
    counts[p.brand] = (counts[p.brand] || 0) + 1;
  });
  let report = 'Product Counts per Brand:\n';
  for (let brand in counts) {
    report += `- ${brand}: ${counts[brand]}\n`;
  }
  report += `\nTotal Products: ${products.length}\n`;
  fs.writeFileSync('C:/Users/Elmasrypc/signature-app/verification_report.txt', report);
} catch (e) {
  fs.writeFileSync('C:/Users/Elmasrypc/signature-app/verification_report.txt', 'Error: ' + e.message);
}
