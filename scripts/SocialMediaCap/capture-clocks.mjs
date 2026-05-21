import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(PROJECT_ROOT, 'src/pages');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/assets/thumbnails');
const BASE_URL = 'http://localhost:5173';

function getClockFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getClockFiles(fullPath, files);
    } else if (item === 'Clock.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

async function captureClocks() {
  const clockFiles = getClockFiles(PAGES_DIR);
  console.log(
    `Found ${clockFiles.length} Clocks. Starting robust 500x500 capture...`,
  );

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Launch with settings that help prevent hangs in heavy canvas/video clocks
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 500,
    height: 500,
    deviceScaleFactor: 2,
  });

  for (const filePath of clockFiles) {
    const relativePath = path.relative(PAGES_DIR, filePath);
    const pathParts = path.dirname(relativePath).replace(/\\/g, '/').split('/');
    const dateParam = pathParts[pathParts.length - 1];

    const url = `${BASE_URL}/${dateParam}`;
    const outputFileName = `${dateParam}-thumb.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    try {
      process.stdout.write(`📷 ${dateParam} ... `);

      // Use a shorter timeout for navigation and 'load' instead of networkidle
      // to prevent getting stuck on persistent video/analytics streams
      await page.goto(url, { waitUntil: 'load', timeout: 15000 });

      // If we got redirected home, the route is wrong or the clock doesn't exist yet
      if (page.url().replace(/\/$/, '') === BASE_URL) {
        console.log('⏭️ (Home Redirect - check route)');
        continue;
      }

      // wait for the React root to actually have something in it (any div or main)
      // This is much more reliable than waiting for 'main' specifically
      await page.waitForFunction(
        () => document.querySelector('#root').children.length > 0,
        { timeout: 5000 },
      );

      // Force a "Thumbnail Mode" layout via CSS injection
      await page.addStyleTag({
        content: `
          body, html, #root { 
            margin: 0 !important; padding: 0 !important; 
            overflow: hidden !important; 
            width: 500px !important; height: 500px !important; 
            background: black !important; 
          }
          header, footer, nav, [class*="footerStrip"], [class*="nav"], [class*="Overlay"] { 
            display: none !important; 
          }
          main, [class*="container"] { 
            display: flex !important; 
            align-items: center !important; 
            justify-content: center !important; 
            height: 100% !important; 
            width: 100% !important; 
            transform: none !important;
          }
        `,
      });

      // The requested 2-second stabilization wait
      await new Promise((r) => setTimeout(r, 2000));

      await page.screenshot({ path: outputPath, type: 'webp', quality: 90 });
      console.log('✅');
    } catch (err) {
      console.log(`❌ (${err.message.split('\n')[0]})`);
      // If a specific clock fails, we just move to the next one
    }
  }

  await browser.close();
  console.log(`\nDone! Images are in src/assets/thumbnails`);
}

captureClocks().catch(console.error);
