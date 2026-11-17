const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Elmasrypc/Desktop/matching/06-red-h-scintillant-silk-tie matching';
try {
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    fs.writeFileSync(path.join('public', 'red_hermes_files.json'), JSON.stringify(files, null, 2));
    console.log('Files:', files);
  }
} catch (e) {
  console.error(e);
}
