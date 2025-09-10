import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import sharp from 'sharp'; // install with: npm install sharp

const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

const baseURL = 'https://www.cubistheart.com/';
let currentDate = '25-06-22';

function parseDate(str) {
  const [yy, mm, dd] = str.split('-').map(Number);
  return new Date(2000 + yy, mm - 1, dd);
}
function formatDate(date) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

async function pageExists(page, url) {
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    return response.status() === 200;
  } catch {
    return false;
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  while (true) {
    const url = `${baseURL}${currentDate}`;
    console.log(`Checking ${url} ...`);

    const exists = await pageExists(page, url);
    if (!exists) {
      console.log(`No page found for ${currentDate}, stopping.`);
      break;
    }

    // screenshot full page
    const temp1 = path.join(screenshotsDir, `${currentDate}-1.png`);
    const temp2 = path.join(screenshotsDir, `${currentDate}-2.png`);

    // example: capture two elements with selectors
    const el1 = await page.$('.icon1'); // change to correct selector
    const el2 = await page.$('.icon2'); // change to correct selector

    if (el1 && el2) {
      await el1.screenshot({ path: temp1 });
      await el2.screenshot({ path: temp2 });

      // combine them horizontally
      const finalPath = path.join(screenshotsDir, `${currentDate}.png`);
      const img1 = sharp(temp1);
      const img2 = sharp(temp2);

      const [buf1, buf2] = await Promise.all([img1.toBuffer(), img2.toBuffer()]);

      await sharp({
        create: {
          width: (await sharp(buf1).metadata()).width + (await sharp(buf2).metadata()).width,
          height: Math.max((await sharp(buf1).metadata()).height, (await sharp(buf2).metadata()).height),
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
      .composite([
        { input: buf1, left: 0, top: 0 },
        { input: buf2, left: (await sharp(buf1).metadata()).width, top: 0 }
      ])
      .toFile(finalPath);

      console.log(`Saved combined screenshot: ${finalPath}`);
    }

    const dateObj = parseDate(currentDate);
    dateObj.setDate(dateObj.getDate() - 1);
    currentDate = formatDate(dateObj);
  }

  await browser.close();
}

main().catch(console.error);
