const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Elmasrypc/Desktop/matching/06-dark-red-gg-pattern-check-silk';
const dest = path.join('public', 'matching', '06-dark-red-gg-pattern-check-silk');

try {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    for (let file of files) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
    console.log('Successfully copied dark red matching files:', files);
  } else {
    console.log('Source folder not found:', src);
  }
} catch (e) {
  console.error(e);
}
