import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

/**
 * Automatically synchronizes src/context/clockpages.json with the filesystem.
 * Run this before build or as a git pre-commit hook.
 */
async function syncRegistry() {
  const PAGES_DIR = path.join(process.cwd(), 'src/pages');
  const REGISTRY_PATH = path.join(process.cwd(), 'src/context/clockpages.json');

  console.log('🔍 Scanning for clocks...');

  // Find all Clock.tsx files in the YYYY/YY-MM/YY-MM-DD pattern
  const clockFiles = await globby('**/Clock.tsx', {
    cwd: PAGES_DIR,
  });

  const clocks = clockFiles
    .map((filePath) => {
      // Extract date from path (e.g., "2026/26-01/26-01-24/Clock.tsx" -> "26-01-24")
      const parts = filePath.split('/');
      const date = parts[parts.length - 2];
      
      // Basic validation: ensure it looks like a date
      if (!/^\d{2}-\d{2}-\d{2}$/.test(date)) return null;

      return {
        path: date,
        date: date,
        title: `${date} Clock`, // Placeholder title
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.date.localeCompare(a!.date)); // Newest first

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(clocks, null, 2));
  console.log(`✅ Registry updated with ${clocks.length} clocks.`);
}

syncRegistry().catch(console.error);