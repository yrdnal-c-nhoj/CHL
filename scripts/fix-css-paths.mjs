#!/usr/bin/env node
/**
 * Script to fix CSS asset paths
 * Converts ../../../assets/ to ../../../../assets/
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './src/pages';

// Pattern: url('../../../assets/' or url("../../../assets/
const CSS_URL_REGEX = /url\(['"](\.\.\/\.\.\/\.\.\/assets\/[^'"]+)['"]\)/g;

function findCssFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findCssFiles(fullPath, files);
    } else if (item.endsWith('.css') || item.endsWith('.module.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  content = content.replace(CSS_URL_REGEX, (match, assetPath) => {
    modified = true;
    // Add one more ../ level
    const fixedPath = assetPath.replace('../../../', '../../../../');
    return match.replace(assetPath, fixedPath);
  });

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

console.log('🔍 Scanning for CSS files...');
const cssFiles = findCssFiles(PAGES_DIR);
console.log(`Found ${cssFiles.length} CSS files\n`);

let fixedCount = 0;
for (const file of cssFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✨ Done! Fixed ${fixedCount} files`);
