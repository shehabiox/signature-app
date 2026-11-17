const fs = require('fs');
const path = require('path');

const badFile = path.join('C:\\Users\\Elmasrypc\\signature-app\\public\\matching', 'GUCCI - Navy BEE STRIPPED SILK TIE (2).jpg');
try {
  if (fs.existsSync(badFile)) {
    fs.unlinkSync(badFile);
    console.log('Removed locked tie image from public/matching');
  }
} catch (e) {
  console.log('Could not remove file (may be locked by Vite):', e.message);
}
