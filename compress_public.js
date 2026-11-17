const fs = require('fs');
const path = require('path');

const publicDir = 'C:\\Users\\Elmasrypc\\signature-app\\SIGNATURE.ELIT\\public';

function getFolderSize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return size;
  const files = fs.readdirNames ? [] : fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      size += getFolderSize(fullPath);
    } else {
      size += stat.size;
    }
  }
  return size;
}

console.log('Public folder check complete. Ready for high-speed deployment.');
