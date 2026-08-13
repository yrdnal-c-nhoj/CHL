import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');

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

const files = walk(SRC_DIR);
let fixed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // Fix malformed imports from the previous script
  // Pattern: import { , something, useMillisecondClock } → import { something, useMillisecondClock }
  content = content.replace(
    /import\s+\{\s*,\s*/g,
    'import { '
  );

  // Pattern: import { as useSecondClock, useMillisecondClock } → import { useSecondClock, useMillisecondClock }
  // This happens when original was: import { useClockTime as useSecondClock }
  content = content.replace(
    /import\s+\{\s*as\s+(\w+)\s*,\s*useMillisecondClock\s*\}/g,
    'import { useSecondClock, useMillisecondClock }'
  );

  // Also fix any remaining useClockTime references that should be useMillisecondClock
  // Only in code, not in comments
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    if (line.trim().startsWith('//')) return line;
    if (line.trim().startsWith('/*')) return line;
    if (line.includes('useClockTime') && !line.includes('import')) {
      return line.replace(/\buseClockTime\s*\([^)]*\)/g, 'useMillisecondClock()');
    }
    return line;
  });
  content = fixedLines.join('\n');

  if (content !== original) {
    writeFileSync(file, content);
    fixed++;
  }
}

console.log(`Fixed ${fixed} files.`);
process.exit(0);
