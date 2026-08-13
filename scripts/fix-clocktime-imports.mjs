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
    } else if (extname(file) === '.tsx') {
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

  // Fix imports from '@/utils/hooks/useClockTime'
  content = content.replace(
    /import\s+\{\s*useClockTime\s*\}\s+from\s+['"]@\/utils\/hooks\/useClockTime['"];?/g,
    "import { useMillisecondClock } from '@/utils/hooks';"
  );

  // Fix imports from '@/utils/hooks' that include useClockTime
  content = content.replace(
    /import\s+\{\s*([^}]*)\buseClockTime\b([^}]*)\}\s+from\s+['"]@\/utils\/hooks['"];?/g,
    (match, before, after) => {
      const imports = [before, after]
        .map(s => s.trim())
        .filter(s => s && s !== ',')
        .join(', ');
      const finalImports = imports ? `${imports}, useMillisecondClock` : 'useMillisecondClock';
      return `import { ${finalImports} } from '@/utils/hooks';`;
    }
  );

  // Fix imports from '@/utils/clockUtils' that include useClockTime
  content = content.replace(
    /import\s+\{\s*([^}]*)\buseClockTime\b([^}]*)\}\s+from\s+['"]@\/utils\/clockUtils['"];?/g,
    (match, before, after) => {
      const imports = [before, after]
        .map(s => s.trim())
        .filter(s => s && s !== ',')
        .join(', ');
      const finalImports = imports ? `${imports}, useMillisecondClock` : 'useMillisecondClock';
      return `import { ${finalImports} } from '@/utils/hooks';`;
    }
  );

  // Fix imports from '@/hooks/useClockTime'
  content = content.replace(
    /import\s+\{\s*useClockTime\s*\}\s+from\s+['"]@\/hooks\/useClockTime['"];?/g,
    "import { useMillisecondClock } from '@/utils/hooks';"
  );

  // Also handle cases where useClockTime is used but not imported (shouldn't happen, but just in case)
  // Remove any leftover bare useClockTime calls that weren't replaced
  content = content.replace(
    /\buseClockTime\s*\([^)]*\)/g,
    'useMillisecondClock()'
  );

  if (content !== original) {
    writeFileSync(file, content);
    fixed++;
  }
}

console.log(`Fixed ${fixed} files.`);
process.exit(0);
