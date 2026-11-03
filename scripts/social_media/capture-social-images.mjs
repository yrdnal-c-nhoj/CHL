#!/usr/bin/env node
/**
 * Social Media Screenshot Generator
 *
 * Captures clock pages and generates optimized images for social platforms.
 *
 * USAGE:
 *   node scripts/social_media/capture-social-images.mjs today
 *   node scripts/social_media/capture-social-images.mjs all
 *   node scripts/social_media/capture-social-images.mjs YY-MM-DD
 *   node scripts/social_media/capture-social-images.mjs range YY-MM-DD YY-MM-DD
 *
 * OUTPUT (2 sizes per clock):
 *   src/assets/social_media/x/           -> square_1080: 1080x1080 (Twitter/X posts)
 *   src/assets/social_media/instagram/   -> portrait_1080x1350: 1080x1350 (Instagram feed)
 *
 * PREREQUISITES:
 *   1. npm run dev    (start dev server)
 *   2. npx playwright install chromium
 *
 * ENVIRONMENT:
 *   CLOCK_BASE_URL      Base URL for clock pages (default: http://localhost:5173)
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const CLOCK_BASE_URL = process.env.CLOCK_BASE_URL || 'http://localhost:5173';
const PAGES_DIR = path.join(__dirname, '../../src/pages');
const SOCIAL_ROOT_DIR = path.join(__dirname, '../../src/assets/social_media');

// Capture at 2x for crisp downsampling
const CAPTURE_VIEWPORT = { width: 1200, height: 1200 };
const PAGE_WAIT_MS = 500;

const EXPORT_PRESETS = {
  square_1080: {
    format: 'webp',
    size: { w: 1080, h: 1080 },
    quality: 85,
    folder: 'x',
    label: 'X/Twitter (1080x1080)',
  },
  portrait_1080x1350: {
    format: 'webp',
    size: { w: 1080, h: 1350 },
    quality: 85,
    folder: 'instagram',
    label: 'Instagram Feed (1080x1350)',
  },
};

const DEFAULT_PRESETS = Object.keys(EXPORT_PRESETS);

function getAvailableDates() {
  const dates = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (!fs.statSync(fullPath).isDirectory()) continue;
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
  let targetDates = [];

  if (!modeOrDate) return { targetDates: [], presets: DEFAULT_PRESETS };

  if (modeOrDate === 'today') {
    const today = new Date().toISOString().slice(2, 10);
    targetDates = [today];
  } else if (modeOrDate === 'all') {
    targetDates = availableDates;
  } else if (modeOrDate === 'range') {
    const start = argv[1];
    const end = argv[2];
    if (start && end && /^\d{2}-\d{2}-\d{2}$/.test(start) && /^\d{2}-\d{2}-\d{2}$/.test(end)) {
      targetDates = availableDates.filter((d) => d >= start && d <= end);
    }
  } else if (/^\d{2}-\d{2}-\d{2}$/.test(modeOrDate)) {
    targetDates = [modeOrDate];
  }

  return { targetDates, presets: DEFAULT_PRESETS };
}

async function captureOne({ browser, date, presets }) {
  const page = await browser.newPage();
  await page.setViewportSize(CAPTURE_VIEWPORT);

  const url = `${CLOCK_BASE_URL}/${date}`;
  const tmpDir = path.join(__dirname, '.tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const tmpPng = path.join(tmpDir, `raw-${date}.png`);

  try {
    console.log(`📸 Capturing ${date} -> ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(PAGE_WAIT_MS);
    await page.screenshot({ path: tmpPng, fullPage: false });

    await Promise.all(
      presets.map(async (presetKey) => {
        const preset = EXPORT_PRESETS[presetKey];
        if (!preset) throw new Error(`Unknown preset: ${presetKey}`);

        const outDir = path.join(SOCIAL_ROOT_DIR, preset.folder);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const { w, h } = preset.size;
        const outPath = path.join(outDir, `${date}-${presetKey}.${preset.format}`);

        await sharp(tmpPng)
          .resize(w, h, { fit: 'cover', position: 'center' })
          .webp({ quality: preset.quality })
          .toFile(outPath);

        console.log(`✅ ${date} -> ${preset.label}: ${path.relative(process.cwd(), outPath)}`);
      }),
    );
  } finally {
    await page.close();
    try {
      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
    } catch {}
  }
}

async function run() {
  if (!fs.existsSync(SOCIAL_ROOT_DIR)) fs.mkdirSync(SOCIAL_ROOT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const { targetDates, presets } = parseArgs(args);

  if (!targetDates.length) {
    console.log(`
Usage:
  node scripts/social_media/capture-social-images.mjs today
  node scripts/social_media/capture-social-images.mjs all
  node scripts/social_media/capture-social-images.mjs YY-MM-DD
  node scripts/social_media/capture-social-images.mjs range YY-MM-DD YY-MM-DD

Outputs 2 images per clock:
  src/assets/social_media/x/           -> X/Twitter (1080x1080)
  src/assets/social_media/instagram/   -> Instagram Feed (1080x1350)

Environment:
  CLOCK_BASE_URL=${CLOCK_BASE_URL}
`);
    process.exit(0);
  }

  console.log(`Starting social capture for ${targetDates.length} clock(s) using BASE_URL=${CLOCK_BASE_URL}`);

  const browser = await chromium.launch({ args: ['--hide-scrollbars', '--disable-web-security'] });
  const batchSize = 2;

  for (let i = 0; i < targetDates.length; i += batchSize) {
    const batch = targetDates.slice(i, i + batchSize);
    await Promise.all(batch.map((date) => captureOne({ browser, date, presets })));
  }

  await browser.close();
  console.log('✨ Social capture complete.');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});