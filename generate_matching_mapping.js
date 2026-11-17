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

  const entries = fs.readdirSync(matchingSrc, { withFileTypes: true });
  const mapping = {};
  for (let entry of entries) {
    if (entry.isDirectory()) {
      const subPath = path.join(matchingSrc, entry.name);
      const subFiles = fs.readdirSync(subPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      mapping[entry.name] = subFiles.map(file => `/matching/${encodeURIComponent(entry.name)}/${encodeURIComponent(file)}`);
    }
  }
  fs.writeFileSync(path.join('public', 'matching_mapping.json'), JSON.stringify(mapping, null, 2));
  console.log('Generated matching_mapping.json successfully.');
} catch (e) {
  console.error(e);
}
