// screenshot-batch-tight.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

const paths = [
  '25-09-05','25-04-02','25-04-03','25-04-04','25-04-05','25-04-06','25-04-07','25-04-08','25-04-09','25-04-10',
];

const baseURL = 'https://www.cubistheart.com/';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (let i = 0; i < paths.length; i++) {
    const url = baseURL + paths[i];
    console.log(`Capturing ${url} ...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Get visible viewport size and make it square
      const squareSize = await page.evaluate(() => {
        return Math.min(window.innerWidth, window.innerHeight);
      });

      await page.setViewport({ width: squareSize, height: squareSize });

      const screenshotPath = path.join(screenshotsDir, `${paths[i]}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`Saved ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed for ${url}:`, err);
    }
  }

  await browser.close();
}

main().catch(console.error);
