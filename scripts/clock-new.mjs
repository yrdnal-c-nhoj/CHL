#!/usr/bin/env node
/**
 * Scaffold a new clock folder and files. Does NOT modify clockpages.json —
 * register the clock manually in src/context/clockpages.json when ready.
 *
 * Usage:
 *   npm run clock:new
 *   npm run clock:new -- 26-05-21
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const templateClock = path.join(src, 'templates', 'BaseClock.tsx');
const templateCss = path.join(src, 'templates', 'BaseClock.module.css');

const DATE_RE = /^\d{2}-\d{2}-\d{2}$/;

function todayParts() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { yy, mm, dd, date: `${yy}-${mm}-${dd}` };
}

function resolveDate(argv) {
  const arg = argv.find((a) => DATE_RE.test(a));
  if (arg) return arg;
  return todayParts().date;
}

function yearFolder(date) {
  const [yy] = date.split('-');
  return `20${yy}`;
}

function monthFolder(date) {
  const [yy, mm] = date.split('-');
  return `${yy}-${mm}`;
}

function scaffold(date) {
  const year = yearFolder(date);
  const month = monthFolder(date);
  const dir = path.join(src, 'pages', year, month, date);
  const clockPath = path.join(dir, 'Clock.tsx');
  const cssPath = path.join(dir, 'Clock.module.css');

  if (fs.existsSync(clockPath)) {
    console.error(`Clock already exists: ${path.relative(root, clockPath)}`);
    process.exit(1);
  }

  if (!fs.existsSync(templateClock)) {
    console.error(`Missing template: ${templateClock}`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(templateClock, clockPath);
  if (fs.existsSync(templateCss)) {
    fs.copyFileSync(templateCss, cssPath);
  } else {
    fs.writeFileSync(cssPath, '.container {\n  width: 100%;\n  height: 100%;\n}\n');
  }

  console.log('Created:');
  console.log(`  ${path.relative(root, clockPath)}`);
  console.log(`  ${path.relative(root, cssPath)}`);
  console.log('');
  console.log('Next steps (manual):');
  console.log(`  1. Edit Clock.tsx and Clock.module.css`);
  console.log(`  2. Add an entry to src/context/clockpages.json:`);
  console.log(`     { "path": "${date}", "date": "${date}", "title": "Your Clock Title" }`);
  console.log('  3. npm run finalize');
}

const date = resolveDate(process.argv.slice(2));
if (!DATE_RE.test(date)) {
  console.error('Date must be YY-MM-DD');
  process.exit(1);
}

scaffold(date);
