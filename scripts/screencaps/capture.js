#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../../src/assets/thumbnails');
const PAGES_DIR = path.join(__dirname, '../../src/pages');

// Host the capture will target (port 5173 as requested)
const CLOCK_BASE_URL = process.env.CLOCK_BASE_URL || 'http://localhost:5173';

const VIEWPORT_SIZE = { width: 300, height: 300 };
const PAGE_WAIT_MS = 2000;

function getAvailableDates() {
  const dates = [];

  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      if (!fs.statSync(fullPath).isDirectory()) continue;

      // Matches YY-MM-DD
      if (/^\d{2}-\d{2}-\d{2}$/.test(entry)) dates.push(entry);
      walk(fullPath);
    }
  };

  walk(PAGES_DIR);
  return dates.sort();
}

function parseArgs(argv) {
  const availableDates = getAvailableDates();
  const modeOrDate = argv[0];

  if (!modeOrDate) return { mode: undefined, targetDates: [] };

  if (modeOrDate === 'today') {
    const today = new Date().toISOString().slice(2, 10);
    return { mode: 'today', targetDates: [today] };
  }

  if (modeOrDate === 'all') return { mode: 'all', targetDates: availableDates };

  if (modeOrDate === 'range') {
    const start = argv[1];
    const end = argv[2];
    if (!start || !end) return { mode: 'range', targetDates: [] };
    if (!/^\d{2}-\d{2}-\d{2}$/.test(start) || !/^\d{2}-\d{2}-\d{2}$/.test(end)) {
      return { mode: 'range', targetDates: [] };
    }
    return {
      mode: 'range',
      targetDates: availableDates.filter((d) => d >= start && d <= end),
    };
  }

  if (/^\d{2}-\d{2}-\d{2}$/.test(modeOrDate)) {
    return { mode: 'date', targetDates: [modeOrDate] };
  }

  return { mode: modeOrDate, targetDates: [] };
}

async function captureOne({ browser, date }) {
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT_SIZE);

  const url = `${CLOCK_BASE_URL}/${date}`;
  const outputPath = path.join(OUTPUT_DIR, `${date}.webp`);

  const tmpDir = path.join(__dirname, '.tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const tmpPng = path.join(tmpDir, `raw-${date}.png`);

  try {
    console.log(`📸 Capturing ${date} -> ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(PAGE_WAIT_MS);

    // Target the root element to ensure we capture the component as a square,
    // respecting its own boundaries without clipping the viewport.
    const rootElement = await page.locator('#root');
    await rootElement.screenshot({ path: tmpPng });

    await sharp(tmpPng)
      .resize(VIEWPORT_SIZE.width, VIEWPORT_SIZE.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    console.log(`✅ Saved: ${path.relative(process.cwd(), outputPath)}`);
  } finally {
    await page.close();
    try {
      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
    } catch {
      // ignore
    }
  }
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const { targetDates } = parseArgs(args);

  if (!targetDates.length) {
    console.log(
      `\nUsage:\n  node scripts/screencaps/capture today\n  node scripts/screencaps/capture all\n  node scripts/screencaps/capture YY-MM-DD\n  node scripts/screencaps/capture range YY-MM-DD YY-MM-DD\n\nEnvironment:\n  CLOCK_BASE_URL=${CLOCK_BASE_URL}`,
    );
    process.exit(0);
  }

  console.log(`Starting capture for ${targetDates.length} clock(s) using BASE_URL=${CLOCK_BASE_URL}`);

  const browser = await chromium.launch({ args: ['--hide-scrollbars', '--disable-web-security'] });

  const batchSize = 2;
  for (let i = 0; i < targetDates.length; i += batchSize) {
    const batch = targetDates.slice(i, i + batchSize);
    await Promise.all(batch.map((date) => captureOne({ browser, date })));
  }

  await browser.close();
  console.log('✨ Capture process complete.');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
