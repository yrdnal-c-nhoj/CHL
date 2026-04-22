#!/usr/bin/env node
/**
 * Script to standardize all imports to use @/ alias
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './src/pages';

// Match relative imports to utils, types, context, hooks, components, assets
const RELATIVE_IMPORT_REGEX = /from\s+['"](\.\.\/)+((?:utils|types|context|hooks|components|assets)\/[^'"]+)['"]/g;

function findClockFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findClockFiles(fullPath, files);
    } else if (item === 'Clock.tsx' || item === 'Clock.jsx' || item === 'Clock.ts') {
      files.push(fullPath);
    }
  }
  return files;
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace relative imports with @/ alias
  content = content.replace(RELATIVE_IMPORT_REGEX, (match, dots, importPath) => {
    modified = true;
    return `from '@/\\${importPath}'`;
  });

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
