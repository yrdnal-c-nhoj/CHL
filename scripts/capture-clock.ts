import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Automation script to capture high-quality screenshots of BorrowedTime clocks.
 * 
 * How to use:
 * 1. Ensure the dev server is running: npm run dev
 * 2. Run this script: npx tsx scripts/capture-clock.ts 26-04-12
 */

async function capture(dateArg: string) {
  // Normalize dashes (handles en-dashes or em-dashes if copied from text)
  const date = dateArg.replace(/[–—]/g, '-');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // High DPI / Retina quality
  });
  
  const page = await context.newPage();
  const url = `http://localhost:5173/${date}`;
  
  console.log(`🚀 Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for the 'useClockPage' black overlay to fade out (1.5s)
  // plus an extra buffer to ensure animations have stabilized.
  await page.waitForTimeout(4000);

  const outputDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `${date}.png`);
  await page.screenshot({ path: filePath });

  console.log(`✅ Screenshot saved to: ${filePath}`);
  await browser.close();
}

const targetDate = process.argv[2] || '26-04-12';
capture(targetDate).catch(err => {
  console.error('❌ Capture failed:', err);
  process.exit(1);
});