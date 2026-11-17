const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the clock page
  await page.goto('http://localhost:5173/26-11-16', {
    waitUntil: 'networkidle',
  });

  // Wait for video to start playing
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'screenshot-26-11-16.png', fullPage: false });

  await browser.close();
  console.log('Screenshot saved to screenshot-26-11-16.png');
})();
