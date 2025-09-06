// screenshot-today.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// make sure screenshots dir exists
const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

// generate today's path in YY-MM-DD format
function getTodayPath() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2); // last 2 digits of year
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

const todayPath = getTodayPath();
const baseURL = 'https://www.cubistheart.com/';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = baseURL + todayPath;
  console.log(`Capturing ${url} ...`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get visible viewport size and make it square
    const squareSize = await page.evaluate(() => {
      return Math.min(window.innerWidth, window.innerHeight);
    });

    await page.setViewport({ width: squareSize, height: squareSize });

    const screenshotPath = path.join(screenshotsDir, `${todayPath}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`Saved ${screenshotPath}`);
  } catch (err) {
    console.error(`Failed for ${url}:`, err);
  }

  await browser.close();
}

main().catch(console.error);
