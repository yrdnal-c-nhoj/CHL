import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import sharp from 'sharp';

/**
 * Automation script to capture a clean, professional 300x300 WebP screenshot.
 * Targeting the component at localhost:5173 with high-effort optimization.
 */
async function captureComponent(dateRoute = '2026/26-05/26-05-23') {
  const outputDir = path.join(process.cwd(), 'screen-caps', 'screen-caps');
  const sanitizedDate = dateRoute.replace(/\//g, '-');
  const tempPng = path.join(outputDir, `raw-${sanitizedDate}.png`);
  const finalWebp = path.join(outputDir, `${sanitizedDate}.webp`);

  // Ensure destination nested folder structure exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📸 Launching browser to capture ${dateRoute}...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 300, height: 300 },
    deviceScaleFactor: 2, // Supersample for "world-class" clarity
  });
  const page = await context.newPage();

  try {
    // Navigate to the local dev server (localhost:5173)
    await page.goto(`http://localhost:5173/${dateRoute}`, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Ensure fonts are loaded and video is playing
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('video', { state: 'attached' });
    await page.waitForTimeout(1000); // Brief buffer for initial render

    await page.screenshot({ path: tempPng });
    await browser.close();

    // Professional optimization using Sharp
    await sharp(tempPng)
      .resize(300, 300) // Downscale the 2x capture to requested 300x300
      .webp({ quality: 85, effort: 6 }) // Highest compression effort for professional results
      .toFile(finalWebp);

    fs.unlinkSync(tempPng); // Clean up temp files
    console.log(`✅ Optimized 300x300 WebP generated: ${finalWebp}`);
  } catch (err) {
    if (err.message.includes('Executable doesn\'t exist')) {
      console.error('\n❌ Playwright browsers missing.');
      console.error('👉 Run: npx playwright install chromium\n');
    } else {
      console.error('❌ Error during capture:', err.message);
    }
    process.exit(1);
  }
}

captureComponent();