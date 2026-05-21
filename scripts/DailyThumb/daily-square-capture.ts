import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const REGISTRY_PATH = path.join(PROJECT_ROOT, 'src/context/clockpages.json');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/assets/thumbnails');

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse command line arguments for optional date
const args = process.argv.slice(2);
const dateArg = args.find((arg) => !arg.startsWith('--'));

// Modified capture function that accepts optional date
async function captureDailySquare(targetDate?: string) {
  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const date = targetDate || getTodayDateString();
  console.log(`📅 Looking for clock: ${date}`);
  console.log(`📸 Capturing square thumbnail (500x500px)`);
  console.log('🖼️ Output format: PNG (Playwright-compatible)');

  const clocks = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  const targetClock = clocks.find((clock: any) => clock.date === date);

  if (!targetClock) {
    console.error(`❌ No clock found for date: ${date}`);
    console.log('Available clocks:');
    clocks.slice(-5).forEach((clock: any) => {
      console.log(`  - ${clock.date}: ${clock.title}`);
    });
    process.exit(1);
  }

  console.log(`✅ Found clock: ${targetClock.title} [${targetClock.date}]`);

  // Detect which port is actually running the BorrowedTime app
  let port = 5173;
  try {
    console.log('Checking port 5173...');
    const res = await fetch('http://localhost:5173');
    const text = await res.text();
    if (!text.includes('id="root"')) throw new Error('Not our app');
  } catch {
    console.log('Port 5173 is inactive or incorrect. Using port 5174...');
    port = 5174;
  }

  console.log(`🚀 Starting capture sequence on http://localhost:${port}`);

  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: { width: 500, height: 500 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const url = `http://localhost:${port}/${targetClock.date}`;
  const outputPath = path.join(OUTPUT_DIR, `${targetClock.date}-thumb.png`);

  try {
    console.log(`📸 Capturing: ${targetClock.title} [${targetClock.date}]`);

    // Wait until the basic page structure is loaded
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });

    // If we got redirected home, the route is wrong or the clock doesn't exist yet
    const currentUrl = page.url();
    if (
      currentUrl &&
      currentUrl.replace(/\/$/, '') === `http://localhost:${port}`
    ) {
      console.log('⏭️ (Home Redirect - check route)');
      process.exit(1);
    }

    // Wait for the React root to actually have content
    await page.waitForSelector('#root > *', { timeout: 5000 });

    // Apply thumbnail-style optimizations - hide UI elements but don't restrict component size
    await page.addStyleTag({
      content: `
        body, html, #root { 
          margin: 0 !important; padding: 0 !important; 
          background: black !important; 
          overflow: hidden !important;
        }
        header, footer, nav, 
        [class*="footerStrip"], 
        [class*="nav"], 
        [class*="Overlay"] { 
          display: none !important; 
        }
      `,
    });

    // Wait 2 seconds after component has fully loaded (as requested)
    console.log(
      '⌛ Settling: Waiting 2s for animations and shaders to stabilize...',
    );
    await page.waitForTimeout(2000);

    // Capture the entire viewport. Since we set it to 500x500 and
    // used overflow:hidden, this captures the full component perfectly.
    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    console.log(`✅ Square thumbnail saved to: ${outputPath}`);
  } catch (err: any) {
    console.error(`❌ Failed to capture ${targetClock.date}: ${err.message}`);
    process.exit(1);
  }

  await browser.close();
  console.log(`🎉 Daily square capture complete!`);
  console.log(`📸 File saved in: ${OUTPUT_DIR}`);
  console.log(
    `   - ${targetClock.date}-thumb.png (1:1 High-DPI square thumbnail)`,
  );
}

captureDailySquare(dateArg).catch((err: any) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
