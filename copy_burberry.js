const fs = require('fs');
const path = require('path');
const src = 'C:/Users/Elmasrypc/Desktop/matching/01-bt-lined-silk-tie matching/Gemini_Generated_Image_aae5lmaae5lmaae5.jpg';
const dest = path.join('public', 'matching', 'Gemini_Generated_Image_aae5lmaae5lmaae5.jpg');
try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied Burberry image successfully');
  } else {
    console.log('Source not found:', src);
  }
} catch (e) {
  console.error(e);
}
