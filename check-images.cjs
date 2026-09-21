const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the clock page
  await page.goto('http://localhost:3999/26-08-19', {
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  // Wait for the clock face to appear
  await page.waitForSelector('.clockFace', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Check the container element for background images on pseudo-elements
  const container = await page.$('main');
  const result = await container?.evaluate(el => {
    const before = window.getComputedStyle(el, '::before');
    const after = window.getComputedStyle(el, '::after');
    return {
      inlineStyle: el.getAttribute('style'),
      beforeBg: before.backgroundImage,
      beforeDisplay: before.display,
      afterBg: after.backgroundImage,
      afterDisplay: after.display,
      beforeZ: before.zIndex,
      afterZ: after.zIndex,
      beforeContent: before.content,
      afterContent: after.content,
      beforeOpacity: before.opacity,
      afterOpacity: after.opacity,
    };
  });

  console.log('Container styles:', JSON.stringify(result, null, 2));

  // Check network requests for image files
  const responses = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource');
    return entries
      .filter(e => e.name.includes('.webp') || e.name.includes('.jpg') || e.name.includes('.png'))
      .map(e => ({ name: e.name, responseEnd: e.responseEnd, transferSize: e.transferSize }));
  });
  console.log('Image resources:', JSON.stringify(responses, null, 2));

  // Check if CSS file is loaded
  const cssLoaded = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(l => l.href);
  });
  console.log('Loaded stylesheets:', JSON.stringify(cssLoaded, null, 2));

  await browser.close();
})();
