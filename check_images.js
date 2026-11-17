const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
        if (stat.size > 1024 * 1024) { // > 1MB
          console.log(`[Large Image] ${path.relative(publicDir, fullPath)}: ${sizeMb} MB`);
        }
      }
    }
  }
}

console.log('Scanning public directory for image sizes...');
scanDir(publicDir);
console.log('Scan complete.');
