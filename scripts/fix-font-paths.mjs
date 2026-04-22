#!/usr/bin/env node
/**
 * Script to fix font import paths in clock files
 * Converts:
 * 1. import ... from '../../../../assets/fonts/...' → import ... from '@/assets/fonts/...'
 * 2. new URL('../../../assets/fonts/...', import.meta.url).href → static import
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './src/pages';

// Pattern 1: Static imports with relative path
const STATIC_IMPORT_REGEX = /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/fonts\/([^'"]+)['"]/g;

// Pattern 2: Dynamic URL pattern
const DYNAMIC_URL_REGEX = /new\s+URL\s*\(\s*['"](?:\.\.\/)+assets\/fonts\/([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)\.href/g;

function findClockFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findClockFiles(fullPath, files);
    } else if (item === 'Clock.tsx' || item === 'Clock.jsx') {
      files.push(fullPath);
    }
  }
  return files;
}

function getFontVariableName(fontPath) {
  const match = fontPath.match(/\d{2}-\d{2}-\d{2}-(.+)\.(ttf|otf|woff2?)/i);
  if (match) {
    const name = match[1].replace(/[^a-zA-Z0-9]/g, '');
    return name.charAt(0).toLowerCase() + name.slice(1) + 'Font';
  }
  return 'customFont';
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  const importsToAdd = [];

  // Fix Pattern 1: Static imports
  content = content.replace(STATIC_IMPORT_REGEX, (match, fontPath) => {
    modified = true;
    return `from '@/assets/fonts/${fontPath}'`;
  });

  // Fix Pattern 2: Dynamic URLs
  content = content.replace(DYNAMIC_URL_REGEX, (match, fontPath) => {
    modified = true;
    const varName = getFontVariableName(fontPath);
    importsToAdd.push(`import ${varName} from '@/assets/fonts/${fontPath}';`);
    return varName;
  });

  // Add new imports at the top if we have any
  if (importsToAdd.length > 0) {
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, ...importsToAdd);
      content = lines.join('\n');
    }
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

console.log('🔍 Scanning for Clock files...');
const clockFiles = findClockFiles(PAGES_DIR);
console.log(`Found ${clockFiles.length} clock files\n`);

let fixedCount = 0;
for (const file of clockFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✨ Done! Fixed ${fixedCount} files`);
