#!/usr/bin/env node
/**
 * Scans src/assets/images for usage in source and writes audit reports.
 * Usage: node scripts/audit-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const imgDir = path.join(srcDir, 'assets', 'images');
const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.html', '.md']);

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
  const needles = [name, stem, posix].filter(Boolean);
  return needles.some((n) => blob.includes(n));
}

const blob = collectCodeBlob();
const allImages = [];
walk(imgDir, (file) => {
  if (IMG_EXT.has(path.extname(file).toLowerCase())) {
    allImages.push(path.relative(root, file));
  }
});

const unused = [];
const nonWebp = [];
for (const rel of allImages.sort()) {
  if (!isReferenced(rel, blob)) unused.push(rel);
  if (!rel.toLowerCase().endsWith('.webp')) nonWebp.push(rel);
}

const lines = [
  `# Image audit — ${new Date().toISOString().slice(0, 10)}`,
  '',
  `Total image files: ${allImages.length}`,
  `Referenced in source (heuristic): ${allImages.length - unused.length}`,
  `Unused (heuristic): ${unused.length}`,
  `Non-WebP (legacy): ${nonWebp.length}`,
  '',
  '## Unused images',
  ...unused.map((f) => `- ${f}`),
];

fs.writeFileSync(path.join(root, 'unused-images-report.txt'), lines.join('\n'));
fs.writeFileSync(path.join(root, 'unused-images-only-report.txt'), unused.join('\n') + '\n');

console.log(`Wrote unused-images-report.txt (${unused.length} unused)`);
console.log(`Wrote unused-images-only-report.txt`);
