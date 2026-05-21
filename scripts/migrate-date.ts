#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Migration Utility: Renames date-based references across the project.
 * Usage: npx tsx scripts/migrate-date.ts <OLD_YY_MM_DD> <NEW_YY_MM_DD>
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

const [oldDate, newDate] = process.argv.slice(2);

if (!oldDate || !newDate) {
  console.error(
    '❌ Usage: npx tsx scripts/migrate-date.ts <old-date> <new-date>',
  );
  console.error('Example: npx tsx scripts/migrate-date.ts 26-05-09 26-05-10');
  process.exit(1);
}

function migrate() {
  console.log(`🚀 Starting migration: ${oldDate} -> ${newDate}`);

  const fileExtensions = ['.tsx', '.ts', '.css', '.json', '.md'];
  let updatedCount = 0;

  const processDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (fileExtensions.includes(path.extname(entry.name))) {
        const content = fs.readFileSync(fullPath, 'utf8');

        if (content.includes(oldDate)) {
          const updatedContent = content.split(oldDate).join(newDate);
          fs.writeFileSync(fullPath, updatedContent);
          updatedCount++;
          console.log(`✅ Updated: ${path.relative(PROJECT_ROOT, fullPath)}`);
        }
      }
    }
  };

  processDirectory(SRC_DIR);

  console.log('\n--- Migration Summary ---');
  console.log(`📂 Files updated: ${updatedCount}`);
  console.log('\n⚠️  Next Steps:');
  console.log(`1. Physically rename the component folder:`);
  console.log(
    `   mv src/pages/2026/26-05/${oldDate} src/pages/2026/26-05/${newDate}`,
  );
  console.log(`2. Physically rename asset folders if applicable:`);
  console.log(
    `   mv src/assets/images/26-05/${oldDate} src/assets/images/26-05/${newDate}`,
  );
  console.log(`3. Update the registry: Check src/context/clockpages.json`);
  console.log(
    `4. Validate: npm run finalize -- src/pages/2026/26-05/${newDate}/Clock.tsx`,
  );
  console.log(`5. Verify Types: npm run type-check`);
}

try {
  migrate();
} catch (error) {
  console.error('❌ Migration failed:', error);
}
