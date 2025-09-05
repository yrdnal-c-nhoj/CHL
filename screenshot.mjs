import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL to capture
const url = 'https://www.cubistheart.com/today';

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Build screenshot file path with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);

async function takeScreenshot() {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // <-- your Chrome
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved: ${screenshotPath}`);

    await browser.close();
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

takeScreenshot();
