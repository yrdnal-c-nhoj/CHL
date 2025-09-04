import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://www.cubistheart.com/today';

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const uniqueId = Math.random().toString(36).substring(2, 8);
const filePath = path.join(screenshotsDir, `laptop-screenshot-${timestamp}-${uniqueId}.png`);

async function takeScreenshot() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    // Set viewport to smaller laptop resolution (1280x720)
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: filePath, fullPage: true });
    
    if (fs.existsSync(filePath)) {
      console.log(`Laptop screenshot successfully saved to ${filePath}`);
    } else {
      console.error('Failed to save laptop screenshot');
    }
  } catch (err) {
    console.error('Error taking laptop screenshot:', err);
  } finally {
    await browser.close();
  }
}

takeScreenshot().catch(err => console.error('Unexpected error:', err));