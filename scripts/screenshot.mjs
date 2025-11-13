import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Save screenshots to a fixed folder
const screenshotsDir = '/Users/john/Desktop/CHL/screenshots'; 
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Paths you want to capture
const paths = ['25-11-04'];
const baseURL = 'https://www.cubistheart.com/';

// Delay in milliseconds before screenshot (e.g., 3000 = 3s)
const screenshotDelay = 500;

// Format date as YYYY-MM-DD
function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Delay helper (works everywhere, no Puppeteer dependency)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const p of paths) {
    const url = baseURL + p;
    console.log(`Capturing ${url} ...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Make viewport square based on visible size
      const squareSize = await page.evaluate(() =>
        Math.min(window.innerWidth, window.innerHeight)
      );
      await page.setViewport({ width: squareSize, height: squareSize });

      // Wait the configured delay before taking the screenshot
      if (screenshotDelay > 0) {
        console.log(`Waiting ${screenshotDelay}ms before screenshot...`);
        await delay(screenshotDelay);
      }

      const dateStr = getDateString();
      const screenshotPath = path.join(screenshotsDir, `${p}-${dateStr}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`Saved ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed for ${url}:`, err);
    }
  }

  await browser.close();
}

main().catch(console.error);
