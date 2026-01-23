const fs = require('fs');
const path = require('path');

const pagesDir = 'src/pages';

// Recursively find all Clock.jsx files under src/pages (supports month/day nesting)
const findClockFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findClockFiles(fullPath));
    } else if (entry.isFile() && entry.name === 'Clock.jsx') {
      results.push(fullPath);
    }
  }

  return results;
};

const clockFiles = findClockFiles(pagesDir);

let issues = [];

clockFiles.forEach(clockJsx => {
  const page = path.basename(path.dirname(clockJsx));
  const content = fs.readFileSync(clockJsx, 'utf-8');
  
  const assetRegex = /from\s+['"]([^'\"]+)['\"]/g;
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
