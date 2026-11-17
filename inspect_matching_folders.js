const fs = require('fs');
const path = require('path');

const matchingDir = 'C:/Users/Elmasrypc/Desktop/matching';

try {
  const entries = fs.readdirSync(matchingDir, { withFileTypes: true });
  const result = {};
  for (let entry of entries) {
    if (entry.isDirectory()) {
      const subPath = path.join(matchingDir, entry.name);
      const subFiles = fs.readdirSync(subPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      result[entry.name] = subFiles;
    }
  }
  fs.writeFileSync(path.join('public', 'matching_structure.json'), JSON.stringify(result, null, 2));
  console.log('Written matching_structure.json successfully.');
} catch (e) {
  console.error(e);
}
