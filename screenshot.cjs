const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/26-11-20', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/clock-screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to /tmp/clock-screenshot.png');
})();