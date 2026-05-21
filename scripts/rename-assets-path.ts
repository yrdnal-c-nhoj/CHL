#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Specialized Migration Utility
 * Renames the assets directory and updates all code references.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Configuration
const OLD_PART = 'assets/images/2025';
const NEW_PART = 'assets/images/25_images';

const OLD_FULL_PATH = path.join(SRC_DIR, 'assets', 'images', '2025');
const NEW_FULL_PATH = path.join(SRC_DIR, 'assets', 'images', '25_images');

function migrate() {
  console.log(`🚀 Starting Migration: "${OLD_PART}" -> "${NEW_PART}"`);

  // 1. Recursive search and replace in all source files
  const extensions = ['.tsx', '.ts', '.css', '.json', '.md'];
  let updatedFiles = 0;

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(path.extname(entry.name))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(OLD_PART)) {
          const updatedContent = content.split(OLD_PART).join(NEW_PART);
          fs.writeFileSync(fullPath, updatedContent);
          updatedFiles++;
          console.log(`✅ Updated: ${path.relative(PROJECT_ROOT, fullPath)}`);
        }
      }
    }
  };

  walk(SRC_DIR);

  // 2. Physically rename the directory
  if (fs.existsSync(OLD_FULL_PATH)) {
    fs.renameSync(OLD_FULL_PATH, NEW_FULL_PATH);
    console.log(
      `📂 Renamed folder: ${path.relative(PROJECT_ROOT, OLD_FULL_PATH)} -> ${path.relative(PROJECT_ROOT, NEW_FULL_PATH)}`,
    );
  } else {
    console.error(`❌ Folder not found: ${OLD_FULL_PATH}`);
  }

  console.log(
    `\n✨ Done! Updated references in ${updatedFiles} files and renamed the directory.`,
  );
}

migrate();
