import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.resolve(__dirname, '../src/context/clockpages.json');
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/screenshots');

async function capture() {
  // Ensure the output directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const clocks = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  // Detect which port is actually running the BorrowedTime app
  // This prevents hanging if 5173 is a zombie process
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
  const page = await browser.newPage({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2 // High quality for thumbnails
  });

  for (const clock of clocks) {
    const url = `http://localhost:${port}/${clock.date}`;
    const outputPath = path.join(SCREENSHOT_DIR, `${clock.date}.webp`);

    try {
      console.log(`📸 Capturing: ${clock.title} [${clock.date}]`);
      
      // Wait until the basic page structure is loaded
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      
      // Per user request: Wait 1.5 seconds for components/animations to settle
      await page.waitForTimeout(1500);
      
      await page.screenshot({ 
        path: outputPath,
        quality: 85,
        animations: 'allow' 
      });
    } catch (err: any) {
      console.error(`❌ Failed to capture ${clock.date}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('✅ All WebP screenshots saved to public/screenshots/');
}

capture().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});