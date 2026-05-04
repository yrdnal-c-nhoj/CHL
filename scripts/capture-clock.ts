import { chromium, Browser } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Automation script to capture high-quality screenshots of BorrowedTime clocks.
 * 
 * How to use:
 * 1. Ensure the dev server is running: npm run dev
 * 2. Run this script: npx tsx scripts/capture-clock.ts 26-04-12
 */

async function captureDate(browser: Browser, dateArg: string) {
  const date = dateArg.replace(/[–—]/g, '-');
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: process.env.CI ? 1 : 2, // Use standard DPI in CI to save memory/time
  });
  
  const page = await context.newPage();

  // Optimization: Block analytics and trackers
  await page.route('**/*.{js,css,png,jpg,jpeg}', (route) => {
    const url = route.request().url();
    if (url.includes('google-analytics') || url.includes('googletagmanager')) {
      return route.abort();
    }
    return route.continue();
  });

  const url = `http://localhost:5173/${date}`;
  
  console.log(`🚀 Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Smart Wait: Instead of 4s, wait for the loading overlay to be removed/hidden
  // Replace '[data-testid="loading-overlay"]' with your actual overlay selector
  await page.waitForFunction(() => {
    const overlay = document.querySelector('[class*="overlay"]'); 
    return !overlay || window.getComputedStyle(overlay).opacity === '0';
  }, { timeout: 10000 }).catch(() => console.warn(`Timeout waiting for overlay on ${date}`));

  const outputDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `${date}.png`);
  await page.screenshot({ path: filePath });

  console.log(`✅ Screenshot saved to: ${filePath}`);
  await context.close();
}

async function main() {
  const args = process.argv.slice(2);
  const dates = args.length > 0 ? args : ['26-04-12'];
  
  const browser = await chromium.launch({ headless: true });
  
  // Capture in parallel (limited to 4 at a time to prevent OOM in CI)
  const concurrency = 4;
  for (let i = 0; i < dates.length; i += concurrency) {
    const chunk = dates.slice(i, i + concurrency);
    await Promise.all(chunk.map(date => captureDate(browser, date)));
  }

  await browser.close();
}

main().catch(err => {
  console.error('❌ Capture failed:', err);
  process.exit(1);
});