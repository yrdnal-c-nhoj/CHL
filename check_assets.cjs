const fs = require('fs');
const path = require('path');

const pagesDir = 'src/pages';

const pages = fs.readdirSync(pagesDir).filter(f => f.startsWith('25') || f.startsWith('26'));

let issues = [];

pages.forEach(page => {
  const clockJsx = path.join(pagesDir, page, 'Clock.jsx');
  if (!fs.existsSync(clockJsx)) return;
  
  const content = fs.readFileSync(clockJsx, 'utf-8');
  
  const assetRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = assetRegex.exec(content)) !== null) {
    const assetPath = match[1];
    
    if (!assetPath.includes('assets/')) continue;
    
    if (!fs.existsSync(assetPath)) {
      issues.push({ page, file: assetPath, type: assetPath.includes('fonts') ? 'font' : 'image' });
    }
  }
});

if (issues.length > 0) {
  console.log('Missing assets:');
  issues.forEach(i => console.log(`  ${i.page}: ${i.file} (${i.type})`));
} else {
  console.log('All asset references found!');
}
