import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(__dirname, '..', 'src', 'pages');

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const full = join(dir, file);
    const s = statSync(full);
    if (s.isDirectory()) {
      results = results.concat(walk(full));
    } else if (extname(file) === '.tsx' && file !== 'ClockPage.tsx' && file !== 'Today.tsx') {
      results.push(full);
    }
  }
  return results;
}

const files = walk(PAGES_DIR);
let fixed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // 1. Replace useClockTime('ms') with useMillisecondClock()
  content = content.replace(
    /import\s+\{\s*useClockTime\s*\}\s+from\s+['"]@\/utils\/clockUtils['"];?/g,
    "import { useMillisecondClock } from '@/utils/hooks';"
  );
  content = content.replace(
    /const\s+(\w+)\s*=\s*useClockTime\([^)]*\);/g,
    (match, varName) => {
      return `const ${varName} = useMillisecondClock();`;
    }
  );

  // 2. Fix bare useRef() without args → useRef(null)
  content = content.replace(
    /useRef\s*<\s*([^>]+)\s*>\s*\(\s*\)/g,
    'useRef<$1 | null>(null)'
  );
  content = content.replace(
    /useRef\s*\(\s*\)/g,
    'useRef(null)'
  );

  if (content !== original) {
    writeFileSync(file, content);
    fixed++;
  }
}

console.log(`Fixed ${fixed} files.`);
process.exit(0);
