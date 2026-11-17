const fs = require('fs');
const path = require('path');
const matchDir = 'C:/Users/Elmasrypc/Desktop/matching';
function listDir(d, indent = '') {
  const entries = fs.readdirSync(d, { withFileTypes: true });
  for (let e of entries) {
    console.log(indent + e.name + (e.isDirectory() ? '/' : ''));
    if (e.isDirectory()) {
      listDir(path.join(d, e.name), indent + '  ');
    }
  }
}
listDir(matchDir);
