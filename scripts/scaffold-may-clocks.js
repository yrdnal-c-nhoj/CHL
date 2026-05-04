import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module directory resolution relative to project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const baseDir = path.join(projectRoot, 'src', 'pages', '2026', '26-05');
const templatePath = path.join(projectRoot, 'src', 'templates', 'MasterTemplate.tsx');

/**
 * Scaffolds daily clock page directories and initial files for May 2026.
 * Starts from day 02 as day 01 is already present.
 */
const scaffold = () => {
  console.log(`🚀 Creating May 2026 clock pages in: ${baseDir}`);
  for (let day = 2; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0');
    const folderName = `26-05-${dayStr}`;
    const folderPath = path.join(baseDir, folderName);
    
    fs.mkdirSync(folderPath, { recursive: true });
    
    // Copy the master template and create module CSS
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, path.join(folderPath, 'Clock.tsx'));
      fs.writeFileSync(path.join(folderPath, 'Clock.module.css'), '');
    }
  }
  console.log('✨ Successfully created clock pages for May 02 through May 31.');
};

scaffold();