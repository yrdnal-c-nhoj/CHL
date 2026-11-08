const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  await page.goto('http://localhost:5174/26-11-06', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.waitForTimeout(2000); // wait for animations/video
  await page.screenshot({ path: 'screenshot-26-11-06.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved');
})();
