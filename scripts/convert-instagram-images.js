const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = '/Users/john/Desktop/CHL/src/assets/social_media/instagram';

if (!fs.existsSync(dir)) {
  console.error(`Directory not found: ${dir}`);
  process.exit(1);
}

fs.readdirSync(dir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  // Convert common web formats to PNG
  if (['.webp', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
    const outputName = path.parse(file).name + '.png';
    sharp(path.join(dir, file))
      .png()
      .toFile(path.join(dir, outputName))
      .then(() => console.log(`Successfully converted ${file} to ${outputName}`))
      .catch(err => console.error(`Error converting ${file}:`, err));
  }
});