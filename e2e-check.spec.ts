import { test, expect } from '@playwright/test';

test('clock images appear on production build', async ({ page }) => {
  // Navigate to the clock page
  await page.goto('http://localhost:3999/26-08-19');

  // Wait for the clock to load
  await page.waitForSelector('.clockFace', { timeout: 10000 });

  // Give a moment for images to load
  await page.waitForTimeout(2000);

  // Check the container element for background images on pseudo-elements
  const container = await page.$('main');
  const bgColor = await container?.evaluate(el => {
    // Check ::before
    const before = window.getComputedStyle(el, '::before');
    const after = window.getComputedStyle(el, '::after');
    return {
      beforeBg: before.backgroundImage,
      afterBg: after.backgroundImage,
      beforeZ: before.zIndex,
      afterZ: after.zIndex,
    };
  });

  console.log('Container custom properties and pseudo-element styles:', bgColor);

  // Also check the inline style
  const inlineStyle = await container?.getAttribute('style');
  console.log('Inline style:', inlineStyle);

  // Check if images are loaded
  const imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));
  });
  console.log('Images:', imgs);

  expect(bgColor?.beforeBg).not.toBe('none');
  expect(bgColor?.afterBg).not.toBe('none');
});
