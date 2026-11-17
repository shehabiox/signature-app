const fs = require('fs');
try {
  const desktopData = JSON.parse(fs.readFileSync('C:/Users/Elmasrypc/Desktop/signature-wep/products.json', 'utf8'));
  const gucci = desktopData.products.filter(p => p.brand === 'GUCCI');
  let output = '';
  gucci.forEach((p, idx) => {
    output += `Product ${idx + 1}: ${p.name} (${p.color})\n`;
    output  += `  Folder: ${p.folder}\n`;
    output  += `  Images in desktop json: ${JSON.stringify(p.images)}\n`;
  });
  fs.writeFileSync('C:/Users/Elmasrypc/signature-app/desktop_gucci_inspect.txt', output);
  console.log('Successfully inspected desktop Gucci products.');
} catch (e) {
  console.error('Error reading desktop products.json:', e.message);
}
