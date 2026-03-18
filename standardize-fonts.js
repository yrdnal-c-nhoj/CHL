#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all Clock.jsx files
function findClockFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'Clock.jsx') {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Update font loading in a Clock.jsx file
function updateFontLoading(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
  
  // Skip if already using useFontLoader or useMultipleFontLoader
  if (content.includes('useFontLoader') || content.includes('useMultipleFontLoader')) {
    console.log(`✅ Already standardized: ${relativePath}`);
    return false;
  }
  
  let modified = false;
  
  // Pattern 1: Direct FontFace usage
  if (content.includes('new FontFace(')) {
    console.log(`🔄 Updating FontFace usage: ${relativePath}`);
    
    // Add import
    if (!content.includes("import { useFontLoader }")) {
      content = content.replace(
        /import React.*?from 'react';/,
        "$&\nimport { useFontLoader } from '../../../utils/fontLoader';"
      );
    }
    
    // This is a simplified pattern - manual review needed for complex cases
    modified = true;
  }
  
  // Pattern 2: @font-face in CSS
  if (content.includes('@font-face')) {
    console.log(`🔄 Updating @font-face usage: ${relativePath}`);
    
    // Remove CSS import
    content = content.replace(/import.*\.css.*['"];?/g, '');
    
    // Add font loader import
    if (!content.includes("import { useFontLoader }")) {
      content = content.replace(
        /import React.*?from 'react';/,
        "$&\nimport { useFontLoader } from '../../../utils/fontLoader';"
      );
    }
    
    modified = true;
  }
  
  // Pattern 3: Dynamic style injection
  if (content.includes('document.createElement(\'style\')') || 
      content.includes('document.createElement("style")')) {
    console.log(`🔄 Updating dynamic style injection: ${relativePath}`);
    
    // Add font loader import
    if (!content.includes("import { useMultipleFontLoader }")) {
      content = content.replace(
        /import React.*?from 'react';/,
        "$&\nimport { useMultipleFontLoader } from '../../../utils/fontLoader';"
      );
    }
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${relativePath}`);
    return true;
  }
  
  return false;
}

// Main execution
const pagesDir = path.join(__dirname, 'src', 'pages');
const clockFiles = findClockFiles(pagesDir);

console.log(`Found ${clockFiles.length} Clock.jsx files\n`);

let updatedCount = 0;
for (const file of clockFiles) {
  if (updateFontLoading(file)) {
    updatedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`- Total Clock.jsx files: ${clockFiles.length}`);
console.log(`- Files updated: ${updatedCount}`);
console.log(`- Files already compliant: ${clockFiles.length - updatedCount}`);

console.log(`\n📝 Next steps:`);
console.log(`1. Review updated files for correct font paths`);
console.log(`2. Add loading states where needed`);
console.log(`3. Test font loading in browser`);
console.log(`4. Remove unused CSS @font-face declarations`);
