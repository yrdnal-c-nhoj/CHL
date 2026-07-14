#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

// --------- Config ---------
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const CLOCK_BASE_URL = process.env.CLOCK_BASE_URL || 'http://localhost:5173';

const PAGES_DIR = path.join(__dirname, '../../src/pages');

// Root output
const SOCIAL_ROOT_DIR = path.join(__dirname, '../../src/assets/social_media');

// Capture: supersample then resize with Sharp
const CAPTURE_VIEWPORT = { width: 600, height: 600 };

// Wait after the component has loaded (requested 0.5s)
const PAGE_WAIT_MS = 500;


// Export sets: take two different crops.
// - square_1080x1080 for X/Twitter
// - portrait_1080x1350 (Instagram-friendly)
const EXPORT_PRESETS = {
  square_1080: { format: 'png', size: { w: 1080, h: 1080 }, quality: 100 },
  portrait_1080x1350: { format: 'png', size: { w: 1080, h: 1350 }, quality: 100 },
};

const DEFAULT_PRESETS = ['square_1080', 'portrait_1080x1350'];

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
    if (!start || !end) targetDates = [];
    else if (!/^\d{2}-\d{2}-\d{2}$/.test(start) || !/^\d{2}-\d{2}-\d{2}$/.test(end)) targetDates = [];
    else targetDates = availableDates.filter((d) => d >= start && d <= end);
  } else if (/^\d{2}-\d{2}-\d{2}$/.test(modeOrDate)) {
    targetDates = [modeOrDate];
  } else {
    targetDates = [];
  }

  // presets override: --presets square_1080,portrait_1080x1350
  const presetsFlagIdx = argv.findIndex((a) => a === '--presets');
  let presets = DEFAULT_PRESETS;
  if (presetsFlagIdx !== -1) {
    const value = argv[presetsFlagIdx + 1];
    if (value) {
      presets = value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  return { targetDates, presets };
}

function getTargetFolderForPreset(presetKey) {
  // Two folders under src/assets/social_media/
  // - instagram: portrait
  // - x: square
  if (presetKey === 'portrait_1080x1350') return 'instagram';
  if (presetKey === 'square_1080') return 'x';
  return 'unknown';
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

        const folder = getTargetFolderForPreset(presetKey);
        if (folder === 'unknown') throw new Error(`No target folder mapping for preset: ${presetKey}`);

        // Your request: move webp files up one level so they sit directly under:
        //   src/assets/social_media/x/*.webp
        //   src/assets/social_media/instagram/*.webp
        const outDirForDate = path.join(SOCIAL_ROOT_DIR, folder);
        if (!fs.existsSync(outDirForDate)) fs.mkdirSync(outDirForDate, { recursive: true });

        const { w, h } = preset.size;
        const outPath = path.join(outDirForDate, `${date}-${presetKey}.${preset.format}`);


        // Crop/scale from the center.
        await sharp(tmpPng)
          .resize(w, h, { fit: 'cover', position: 'center' })
          .png({ compressionLevel: 9, quality: preset.quality })
          .toFile(outPath);

        console.log(`✅ ${date} -> ${path.relative(process.cwd(), outPath)}`);
      })
    );
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
  if (!fs.existsSync(SOCIAL_ROOT_DIR)) fs.mkdirSync(SOCIAL_ROOT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const { targetDates, presets } = parseArgs(args);

  if (!targetDates.length) {
    console.log(
      `\nUsage:\n  node scripts/social_media/capture-social-images.mjs today\n  node scripts/social_media/capture-social-images.mjs all\n  node scripts/social_media/capture-social-images.mjs YY-MM-DD\n  node scripts/social_media/capture-social-images.mjs range YY-MM-DD YY-MM-DD\n\nOptional:\n  --presets square_1080,portrait_1080x1350\n\nEnvironment:\n  CLOCK_BASE_URL=${CLOCK_BASE_URL}\n`
    );
    process.exit(0);
  }

  console.log(`Starting social capture for ${targetDates.length} clock(s) using BASE_URL=${CLOCK_BASE_URL}`);
  console.log(`Presets: ${presets.join(', ')}`);

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

