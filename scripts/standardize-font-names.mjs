import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

/**
 * Standardizes font filenames to include the clock's date prefix (YY-MM-DD).
 * Updates both the physical files and the import statements in Clock.tsx.
 */
async function standardize() {
  const clockFiles = await globby('src/pages/**/Clock.tsx');
  let count = 0;

  for (const file of clockFiles) {
    const dateMatch = file.match(/\d{2}-\d{2}-\d{2}/);
    if (!dateMatch) continue;
    const dateStr = dateMatch[0];
    
    let content = fs.readFileSync(file, 'utf8');
    // Matches: import name from '@/assets/fonts/.../filename.ttf?url'
    const fontRegex = /import\s+(\w+)\s+from\s+['"](@\/assets\/fonts\/.*?\/)([^'"]+\.(?:ttf|otf|woff2?))(?:\?url)?['"]/g;
    
    let match;
    let modified = false;

    while ((match = fontRegex.exec(content)) !== null) {
      const [fullImport, varName, basePath, fileName] = match;
      
      if (!fileName.startsWith(dateStr)) {
        const newFileName = `${dateStr}-${fileName}`;
        const oldPath = path.resolve(basePath.replace('@/', 'src/'), fileName);
        const newPath = path.resolve(basePath.replace('@/', 'src/'), newFileName);
        const newImport = `import ${varName} from '${basePath}${newFileName}?url'`;

        if (fs.existsSync(oldPath)) {
          console.log(`🏷️  Renaming: ${fileName} -> ${newFileName}`);
          fs.renameSync(oldPath, newPath);
          content = content.replace(fullImport, newImport);
          modified = true;
          count++;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(file, content);
    }
  }

  console.log(`\n✨ Finished! Standardized ${count} fonts across the library.`);
}

standardize().catch(console.error);