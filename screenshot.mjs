// screenshot-today.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

const url = 'https://www.cubistheart.com/today';

// Generate today's date in YY-MM-DD format (for filename)
function getTodayFilename() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}.png`;
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Capturing ${url} ...`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get visible viewport size and make it square
    const squareSize = await page.evaluate(() => Math.min(window.innerWidth, window.innerHeight));
    await page.setViewport({ width: squareSize, height: squareSize });

    const screenshotPath = path.join(screenshotsDir, getTodayFilename());
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`Saved ${screenshotPath}`);
  } catch (err) {
    console.error(`Failed for ${url}:`, err);
  }

  await browser.close();
}

main().catch(console.error);
