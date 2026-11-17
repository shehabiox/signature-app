const fs = require('fs');
const path = require('path');

const baseDesktopMatching = 'C:\\Users\\Elmasrypc\\Desktop\\matching';
const destDir = 'C:\\Users\\Elmasrypc\\signature-app\\public\\matching';
const distDestDir = 'C:\\Users\\Elmasrypc\\signature-app\\dist\\matching';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(baseDesktopMatching)) {
  const subfolders = fs.readdirSync(baseDesktopMatching, { withFileTypes: true });
  subfolders.forEach(dirent => {
    if (dirent.isDirectory()) {
      const folderPath = path.join(baseDesktopMatching, dirent.name);
      const files = fs.readdirSync(folderPath);

      let suitIdx = 1;
      files.forEach((file) => {
        if ((file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')) && !file.toUpperCase().includes('TIE')) {
          const srcPath = path.join(folderPath, file);

          let cleanName = file;
          if (dirent.name.includes('18-navy-bee')) {
            if (file.includes('(2)')) cleanName = 'gucci-navy-bee-2.jpg';
            else if (file.includes('(3)')) cleanName = 'gucci-navy-bee-3.jpg';
            else if (file.includes('(4)')) cleanName = 'gucci-navy-bee-4.jpg';
            else cleanName = 'gucci-navy-bee-1.jpg';
          } else if (dirent.name.includes('03-black-gg')) {
            cleanName = `gucci-black-gg-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('01-bt-lined')) {
            cleanName = `burberry-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('01-blue-cc')) {
            cleanName = `chanel-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('01-black-classic-lv')) {
            cleanName = `louis-vuitton-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('02-blue-ecu')) {
            cleanName = `louis-vuitton-ecu-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('01-orange-colourful')) {
            cleanName = `hermes-orange-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('05-olive-petits')) {
            cleanName = `hermes-olive-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('06-red-h-scintillant')) {
            cleanName = `hermes-red-h-${suitIdx++}.jpg`;
          } else if (dirent.name.includes('10-purple-dark')) {
            cleanName = `gucci-purple-${suitIdx++}.jpg`;
          }

          const destPath = path.join(destDir, cleanName);
          try {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied & renamed ${file} -> ${cleanName}`);
          } catch (e) {}

          if (fs.existsSync(distDestDir)) {
            const distPath = path.join(distDestDir, cleanName);
            try {
              fs.copyFileSync(srcPath, distPath);
            } catch (e) {}
          }
        }
      });
    }
  });
}
console.log('Done copying and normalizing matching suit images!');
