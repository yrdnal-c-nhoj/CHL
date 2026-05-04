import { chromium, Browser } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Automation script to capture high-quality screenshots of BorrowedTime clocks.
 * 
 * How to use:
 * 1. Ensure the dev server is running: npm run dev
 * 2. Run this script: npm run capture:clock -- 25-04-12
 */

async function captureDate(browser: Browser, dateArg: string) {
  const date = dateArg.replace(/[–—]/g, '-');
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1, // Match old script's standard DPI for consistent 16:9 aspect ratio
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
  // Use networkidle to ensure all heavy assets (videos, fonts) are ready
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for the 'useClockPage' loading overlay to fade out
  await page.waitForFunction(() => {
    const overlay = document.querySelector('[class*="overlay"]'); 
    return !overlay || window.getComputedStyle(overlay).opacity === '0';
  }, { timeout: 10000 }).catch(() => console.warn(`Timeout waiting for overlay on ${date}`));

  // Additional buffer to allow React state and animations to settle (matches old script 3s behavior)
  await page.waitForTimeout(2000);

  const projectRoot = path.resolve(__dirname, '..');
  const outputDir = path.join(projectRoot, 'public', 'screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${date}.png`);
  await page.screenshot({ path: filePath });

  console.log(`✅ Screenshot saved to: ${filePath}`);
  await context.close();
}

async function main() {
  const args = process.argv.slice(2);
  
  let dates: string[] = args;
  if (dates.length === 0) {
    console.log('📖 No dates provided. Reading from clockpages.json...');
    const projectRoot = path.resolve(__dirname, '..');
    const registryPath = path.join(projectRoot, 'src/context/clockpages.json');
    const clocks = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    dates = clocks.map((c: any) => c.date);
  }

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