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

  // Fix: const foo: React.FC = () => ...  →  const foo = () => ...
  // This fixes "Expected 1 arguments, but got 0" when the function is called without props
  content = content.replace(
    /:\s*React\.FC\s*=/g,
    ' = '
  );

  if (content !== original) {
    writeFileSync(file, content);
    fixed++;
  }
}

console.log(`Fixed ${fixed} files.`);
process.exit(0);
