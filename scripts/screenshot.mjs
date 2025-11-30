import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Save screenshots to a fixed folder
const screenshotsDir = '/Users/john/Desktop/CHL/scripts/screenshots'; 
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Paths you want to capture
const paths = ['25-11-28'];
const baseURL = 'https://www.cubistheart.com/';

// Delay in milliseconds before screenshot (e.g., 3000 = 3s)
const screenshotDelay = 100;

// Format date as YYYY-MM-DD
function getDateString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Find the next available number for a given path/date
function getNextFileNumber(baseName, dateStr) {
  const files = fs.readdirSync(screenshotsDir);
  let maxNum = 0;
  const regex = new RegExp(`^${baseName}-${dateStr}-(\\d+)\\.png$`);
  files.forEach(file => {
    const match = file.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  return maxNum + 1;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();

  for (const p of paths) {
    const url = baseURL + p;
    console.log(`Capturing ${url} ...`);

    try {
      // Increased timeout to 60 seconds
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Make viewport square
      const squareSize = await page.evaluate(() =>
        Math.min(window.innerWidth, window.innerHeight)
      );
      await page.setViewport({ width: squareSize, height: squareSize });

      if (screenshotDelay > 0) {
        console.log(`Waiting ${screenshotDelay}ms before screenshot...`);
        await delay(screenshotDelay);
      }

      const dateStr = getDateString();
      const fileNumber = getNextFileNumber(p, dateStr);
      const screenshotPath = path.join(screenshotsDir, `${p}-${dateStr}-${fileNumber}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`Saved ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed for ${url}:`, err);
    }
  }

  await browser.close();
}

main().catch(console.error);
