import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module directory resolution relative to project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const baseDir = path.join(projectRoot, 'images', '26-05');

/**
 * Scaffolds daily asset directories for May 2026 (31 days).
 * Includes .gitkeep files for directory persistence.
 */
const scaffold = () => {
  console.log(`🚀 Creating May 2026 folders in: ${baseDir}`);
  for (let day = 1; day <= 31; day++) {
    const folderName = day.toString().padStart(2, '0');
    const folderPath = path.join(baseDir, folderName);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
  }
  console.log('✨ Successfully created 31 daily folders.');
};

scaffold();