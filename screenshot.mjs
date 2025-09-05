import puppeteer from 'puppeteer-core'; // use puppeteer-core to point to installed Chromium
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename  = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Chromium (homebrew install) — adjust if different
let chromiumPath;
try {
  chromiumPath = execSync('which chromium').toString().trim();
  if (!chromiumPath) throw new Error('Chromium not found');
} catch {
  console.log('Using bundled Chromium from puppeteer package');
  // fallback: use puppeteer default browser
  chromiumPath = undefined;
}

// URL to capture
const url = 'https://www.cubistheart.com/today';

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

// Timestamped filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const uniqueId = Math.random().toString(36).substring(2, 8);
const filePath = path.join(screenshotsDir, `laptop-screenshot-${timestamp}-${uniqueId}.png`);

async function takeScreenshot() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromiumPath, // required for cron
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-networking'
    ]
  });

  try {
    console.log('Opening page...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log(`Taking screenshot: ${filePath}`);
    await page.screenshot({ path: filePath, fullPage: true });

    console.log(fs.existsSync(filePath) 
      ? `Screenshot saved: ${filePath}` 
      : 'Failed to save screenshot');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

// Run immediately
takeScreenshot().catch(err => console.error('Unexpected error:', err));
