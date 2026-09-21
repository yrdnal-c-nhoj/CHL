const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  await page.goto('http://localhost:3999/26-08-19', {
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return { error: 'main not found' };
    
    const before = window.getComputedStyle(main, '::before');
    const after = window.getComputedStyle(main, '::after');
    const inlineStyle = main.getAttribute('style');
    
    return {
      inlineStyle,
      mainClass: main.className,
      beforeBg: before.backgroundImage,
      beforeDisplay: before.display,
      beforeContent: before.content,
      beforeZ: before.zIndex,
      beforeWidth: before.width,
      beforeHeight: before.height,
      afterBg: after.backgroundImage,
      afterDisplay: after.display,
      afterContent: after.content,
      afterZ: after.zIndex,
    };
  });

  console.log('Result:', JSON.stringify(result, null, 2));

  // Check loaded stylesheets
  const stylesheets = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const processed = Array.from(document.styleSheets);
    return {
      linkCount: links.length,
      links: links.map(l => l.href),
      sheets: processed.filter(s => s.href).map(s => s.href),
    };
  });
  console.log('Stylesheets:', JSON.stringify(stylesheets, null, 2));

  // Check if the clock CSS is loaded
  const clockCSSLoaded = await page.evaluate((href) => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => l.href.includes(href));
  }, 'Clock-CI7ul8qs');
  console.log('Clock CSS loaded:', clockCSSLoaded);

  // Check if the assets exist
  const wallResponse = await page.request.get('http://localhost:3999/assets/wall-CN-YPkHa.webp');
  console.log('Wall image status:', wallResponse.status());
  
  const mapResponse = await page.request.get('http://localhost:3999/assets/map3-DCyUm6EF.webp');
  console.log('Map image status:', mapResponse.status());

  await browser.close();
})();
