// screenshot.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL to capture
const url = 'https://www.cubistheart.com/25-09-11';

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Build screenshot file path with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);

async function takeScreenshot() {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || undefined, // Use default Chrome if not set
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // For server compatibility
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
  } catch (err) {
    console.error('Error capturing screenshot:', err.message);
    process.exit(1); // Exit with error for cron job logging
  } finally {
    if (browser) await browser.close();
  }
}

takeScreenshot();