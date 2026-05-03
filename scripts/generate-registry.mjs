import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');
const OUTPUT_FILE = path.join(__dirname, '../src/context/clockpages.json');

/**
 * Automatically scans the pages directory to generate the clock registry.
 * Professional architecture: Ensures the UI stays in sync with the filesystem.
 */
function generateRegistry() {
  const years = fs.readdirSync(PAGES_DIR).filter(f => !f.startsWith('.'));
  const items = [];

  years.forEach(year => {
    const monthsPath = path.join(PAGES_DIR, year);
    const months = fs.readdirSync(monthsPath).filter(f => !f.startsWith('.'));

    months.forEach(month => {
      const clocksPath = path.join(monthsPath, month);
      const clocks = fs.readdirSync(clocksPath).filter(f => !f.startsWith('.'));

      clocks.forEach(date => {
        items.push({
          date,
          path: date,
          title: `Clock ${date}` // You can enhance this to read from a local meta.json later
        });
      });
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items.reverse(), null, 2));
  console.log(`✅ Registry generated with ${items.length} clocks.`);
}

generateRegistry();