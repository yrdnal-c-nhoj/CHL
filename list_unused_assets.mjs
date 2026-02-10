#!/usr/bin/env node
/**
 * Lists images and fonts that are not referenced anywhere in the project.
 * Searches: src (jsx, js, tsx, ts, css, html), index.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname);

const ASSET_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.mp4', '.avif',
  '.ttf', '.otf', '.woff', '.woff2', '.eot'
]);

function* walk(dir, pred = () => true) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full, pred);
    else if (e.isFile() && pred(full)) yield full;
  }
}

function collectAssets() {
  const assets = [];
  const dirs = [
    path.join(root, 'src', 'assets', 'images'),
    path.join(root, 'src', 'assets', 'fonts'),
    path.join(root, 'src', 'assets'),
    path.join(root, 'public', 'fonts'),
  ];
  for (const dir of dirs) {
    for (const f of walk(dir, (p) => ASSET_EXTS.has(path.extname(p).toLowerCase()))) {
      assets.push(path.relative(root, f));
    }
  }
  // Also any image/svg in pages (e.g. wheel.svg next to Clock.jsx)
  const pagesDir = path.join(root, 'src', 'pages');
  for (const f of walk(pagesDir, (p) => ASSET_EXTS.has(path.extname(p).toLowerCase()))) {
    assets.push(path.relative(root, f));
  }
  return [...new Set(assets)];
}

function collectSourceFiles() {
  const exts = new Set(['.jsx', '.js', '.tsx', '.ts', '.css', '.html']);
  const out = [];
  const srcDir = path.join(root, 'src');
  for (const f of walk(srcDir, (p) => exts.has(path.extname(p).toLowerCase()))) {
    out.push(f);
  }
  const indexHtml = path.join(root, 'index.html');
  if (fs.existsSync(indexHtml)) out.push(indexHtml);
  return out;
}

function loadAllSourceContent(sourceFiles) {
  let content = '';
  for (const f of sourceFiles) {
    try {
      content += '\n' + fs.readFileSync(f, 'utf-8');
    } catch (_) {}
  }
  return content;
}

function isReferenced(assetPath, sourceContent) {
  const basename = path.basename(assetPath);
  const normalized = assetPath.replace(/\\/g, '/');
  // Reference can be: path with / or \, or just filename, or path without leading src/
  const patterns = [
    normalized,
    normalized.replace(/^src\//, ''),
    basename,
    path.join(path.dirname(assetPath), basename).replace(/\\/g, '/'),
  ];
  for (const p of patterns) {
    if (p && sourceContent.includes(p)) return true;
  }
  // Vite often resolves with @/ or relative like ../../../assets/...
  const withoutExt = assetPath.replace(/\.[^.]+$/, '');
  if (sourceContent.includes(withoutExt)) return true;
  return false;
}

const assets = collectAssets();
const sourceFiles = collectSourceFiles();
const sourceContent = loadAllSourceContent(sourceFiles);

const unusedImages = [];
const unusedFonts = [];
const fontExts = new Set(['.ttf', '.otf', '.woff', '.woff2', '.eot']);

for (const asset of assets) {
  if (isReferenced(asset, sourceContent)) continue;
  const ext = path.extname(asset).toLowerCase();
  if (fontExts.has(ext)) {
    unusedFonts.push(asset);
  } else {
    unusedImages.push(asset);
  }
}

unusedImages.sort();
unusedFonts.sort();

console.log('# Unused images and fonts in project\n');
console.log('## Unused images (' + unusedImages.length + ')\n');
unusedImages.forEach((p) => console.log(p));
console.log('\n## Unused fonts (' + unusedFonts.length + ')\n');
unusedFonts.forEach((p) => console.log(p));
