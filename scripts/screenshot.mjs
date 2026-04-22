#!/usr/bin/env node
/**
 * Screenshot script for capturing clock images
 * Uses Puppeteer to render clocks and save screenshots
 */

import puppeteer from 'puppeteer';
import { readdirSync, statSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://www.cubistheart.com';
const OUTPUT_DIR = './screenshots';

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function findClockPaths(dir, paths = [], basePath = '') {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      // Check if this is a clock directory (contains Clock.tsx or Clock.jsx)
      const files = readdirSync(fullPath);
      if (files.some(f => f === 'Clock.tsx' || f === 'Clock.jsx')) {
        const relativePath = basePath ? `${basePath}/${item}` : item;
        paths.push(relativePath);
      } else {
        // Continue recursing
        findClockPaths(fullPath, paths, basePath ? `${basePath}/${item}` : item);
      }
    }
  }
  return paths;
}

async function captureScreenshot(browser, datePath) {
  const page = await browser.newPage();
  
  // Set viewport size for Instagram (4:5 portrait, 540x675 - half size)
  await page.setViewport({
    width: 540,
    height: 675,
    deviceScaleFactor: 1
  });
  
  const url = `${BASE_URL}/${datePath}`;
  console.log(`📸 Capturing: ${url}`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for clock to be ready (250ms = 1/4 second after load)
    await new Promise(resolve => setTimeout(resolve, 250));

    // Generate unique filename to avoid overwriting
    const baseFileName = `${datePath.replace(/\//g, '-')}.png`;
    let outputFile = join(OUTPUT_DIR, baseFileName);
    let counter = 1;
    while (existsSync(outputFile)) {
      const newFileName = `${datePath.replace(/\//g, '-')}-${counter}.png`;
      outputFile = join(OUTPUT_DIR, newFileName);
      counter++;
    }

    await page.screenshot({
      path: outputFile,
      fullPage: false
    });
    
    console.log(`✅ Saved: ${outputFile}`);
    await page.close();
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${datePath}`, error.message);
    await page.close();
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node screenshot.mjs [options] [date]

Options:
  --all       Capture all clocks
  --date      Capture specific date (YY-MM-DD format)
  --help      Show this help

Examples:
  node screenshot.mjs --all
  node screenshot.mjs 26-03-23
    `);
    process.exit(0);
  }
  
  const captureAll = args.includes('--all');
  const specificDate = args.find(arg => arg.match(/^\d{2}-\d{2}-\d{2}$/));
  
  if (!captureAll && !specificDate) {
    console.error('Please specify --all or a date (e.g., 26-03-23)');
    process.exit(1);
  }
  
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    if (specificDate) {
      await captureScreenshot(browser, specificDate);
    } else if (captureAll) {
      const pagesDir = join(__dirname, '../src/pages');
      const clockPaths = findClockPaths(pagesDir);
      
      console.log(`Found ${clockPaths.length} clocks to capture\n`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const datePath of clockPaths) {
        const success = await captureScreenshot(browser, datePath);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      console.log(`\n📊 Results: ${successCount} succeeded, ${failCount} failed`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
