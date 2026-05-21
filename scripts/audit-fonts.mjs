#!/usr/bin/env node
/**
 * Scans src/assets/fonts for usage in source and writes audit reports.
 * Usage: node scripts/audit-fonts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const fontDir = path.join(srcDir, 'assets', 'fonts');
const FONT_EXT = new Set(['.ttf', '.otf', '.woff', '.woff2']);
const STANDARD_RE = /^\d{2}-\d{2}-\d{2}-.+\.(ttf|otf|woff2?)$/i;
const CODE_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.css',
  '.json',
  '.html',
  '.md',
]);

function walk(dir, onFile) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, onFile);
    else onFile(p);
  }
}

function collectCodeBlob() {
  const parts = [];
  walk(srcDir, (file) => {
    if (!CODE_EXT.has(path.extname(file).toLowerCase())) return;
    try {
      parts.push(fs.readFileSync(file, 'utf8'));
    } catch {
      /* skip */
    }
  });
  return parts.join('\n');
}

function isReferenced(relPath, blob) {
  const name = path.basename(relPath);
  const stem = path.basename(relPath, path.extname(relPath));
  const posix = relPath.split(path.sep).join('/');
  const short = posix.includes('assets/fonts/')
    ? posix.split('assets/fonts/')[1]
    : posix;
  const needles = [name, stem, posix, short].filter(Boolean);
  return needles.some((n) => blob.includes(n));
}

const blob = collectCodeBlob();
const allFonts = [];
walk(fontDir, (file) => {
  if (FONT_EXT.has(path.extname(file).toLowerCase())) {
    allFonts.push(path.relative(root, file));
  }
});

const unused = [];
const nonStandard = [];
for (const rel of allFonts.sort()) {
  if (!isReferenced(rel, blob)) unused.push(rel);
  if (!STANDARD_RE.test(path.basename(rel))) nonStandard.push(rel);
}

const lines = [
  `# Font audit — ${new Date().toISOString().slice(0, 10)}`,
  '',
  `Total font files: ${allFonts.length}`,
  `Referenced in source (heuristic): ${allFonts.length - unused.length}`,
  `Unused (heuristic): ${unused.length}`,
  `Non-standard names: ${nonStandard.length}`,
  '',
  '## Unused fonts',
  ...unused.map((f) => `- ${f}`),
  '',
  '## Non-standard names (expected: YY-MM-DD-name.ext)',
  ...nonStandard.map((f) => `- ${f}`),
];

fs.writeFileSync(path.join(root, 'unused-fonts-report.txt'), lines.join('\n'));
fs.writeFileSync(
  path.join(root, 'non-standard-fonts.txt'),
  nonStandard.join('\n') + '\n',
);

console.log(`Wrote unused-fonts-report.txt (${unused.length} unused)`);
console.log(
  `Wrote non-standard-fonts.txt (${nonStandard.length} non-standard)`,
);
