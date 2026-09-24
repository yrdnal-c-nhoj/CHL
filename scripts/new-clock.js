#!/usr/bin/env node

/**
 * New Clock Scaffolding Generator
 *
 * Creates a compliant clock directory structure from template.
 * Registers the clock in both clockpages.json and testclocks.json.
 *
 * Usage: npm run new-clock 26-09-25 "My Clock Title" tag1 tag2 ...
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const CLOCKPAGES_FILE = path.join(ROOT, 'src', 'context', 'clockpages.json');
const TESTCLOCKS_FILE = path.join(ROOT, 'src', 'context', 'testclocks.json');
const DATE_PATTERN = /^\d{2}-\d{2}-\d{2}$/;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: npm run new-clock YY-MM-DD [title] [tags...]');
    console.log('Example: npm run new-clock 26-09-25 "Digital Wave" digital sound');
    process.exit(1);
  }

  const date = args[0];
  if (!DATE_PATTERN.test(date)) {
    fail(`Date must be in YY-MM-DD format, got: ${date}`);
  }

  const [year, month] = date.split('-');
  const title = args[1] || date;
  const tags = args.slice(2);

  return { date, year, month, title, tags };
}

function getClockDir(date, year, month) {
  return path.join(PAGES_DIR, `20${year}`, `${year}-${month}`, date);
}

function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function registerClockInJSON(filePath, date, title, tags) {
  const entries = readJSONFile(filePath);
  const existing = entries.find(e => e.date === date);
  if (existing) {
    console.log(`  Already registered in ${path.basename(filePath)}`);
    return;
  }
  const newEntry = { path: date, date, title, tags };
  entries.push(newEntry);
  writeJSONFile(filePath, entries);
  console.log(`  Registered in ${path.basename(filePath)}`);
}

function generateClockTSX(date) {
  const displayName = `Clock_${date.replace(/-/g, '_')}`;

  return `import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';

export const assets: string[] = [];

const ${displayName} = () => {
  const time = useSmoothClock(16);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString()}
      </div>
    </main>
  );
};

${displayName}.displayName = '${displayName}';

export default ${displayName};
`;
}

function generateClockCSS() {
  return `.container {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
}

.content {
  font-family: monospace, sans-serif;
  font-size: clamp(2rem, 15vw, 12rem);
  line-height: 1;
  text-align: center;
}
`;
}

function main() {
  const { date, year, month, title, tags } = parseArgs();
  const clockDir = path.join(PAGES_DIR, `20${year}`, `${year}-${month}`, date);
  const clockFile = path.join(clockDir, 'Clock.tsx');
  const cssFile = path.join(clockDir, 'Clock.module.css');

  // Check if clock already exists
  if (fs.existsSync(clockDir)) {
    fail(`Clock directory already exists: ${clockDir}`);
  }

  // Create directory
  fs.mkdirSync(clockDir, { recursive: true });
  console.log(`Created directory: ${clockDir}`);

  // Generate and write Clock.tsx
  const clockContent = generateClockTSX(date);
  fs.writeFileSync(clockFile, clockContent);
  console.log(`Created: ${clockFile}`);

  // Generate and write CSS
  const cssContent = generateClockCSS();
  fs.writeFileSync(cssFile, cssContent);
  console.log(`Created: ${cssFile}`);

  // Register in both JSON files
  registerClockInJSON(CLOCKPAGES_FILE, date, title, tags);
  registerClockInJSON(TESTCLOCKS_FILE, date, title, tags);

  console.log('\nDone! Next steps:');
  console.log(`  1. Edit ${clockFile} to add your clock artwork`);
  console.log(`  2. Add assets (images, fonts) and update the assets array`);
  console.log(`  3. Customize ${cssFile} for your design`);
  console.log(`  4. Run: npm run verify:clocks -- --path ${date}`);
  console.log(`  5. Run: npm run build`);
}

main();