const fs = require('fs');
const path = require('path');

const matchingSrc = 'C:/Users/Elmasrypc/Desktop/matching';
const matchingDest = path.join('public', 'matching');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

try {
  console.log('Copying matching folders...');
  copyRecursive(matchingSrc, matchingDest);

  if (fs.existsSync(matchingSrc)) {
    const entries = fs.readdirSync(matchingSrc, { withFileTypes: true });
    const result = {};
    for (let entry of entries) {
      if (entry.isDirectory()) {
        const subPath = path.join(matchingSrc, entry.name);
        const subFiles = fs.readdirSync(subPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        result[entry.name] = subFiles;
      }
    }
    fs.writeFileSync(path.join('public', 'matching_structure.json'), JSON.stringify(result, null, 2));
    console.log('Matching folders copied and structure written successfully.');
  }
} catch (e) {
  console.error(e);
}
