const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Elmasrypc\\Desktop\\signature-wep\\HERMES\\07-navy-blue-hermes-paris-tie-2';
const dest = 'C:\\Users\\Elmasrypc\\signature-app\\public\\products\\HERMES\\07-navy-blue-hermes-paris-tie-2';

fs.mkdirSync(dest, { recursive: true });
for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
console.log('Copied successfully!');
