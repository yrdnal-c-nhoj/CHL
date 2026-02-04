import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

// Configuration
const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOTS_DIR = './screenshots';
const COMPONENTS = [
  { path: '/26-01-31', name: '26-01-31-clock' },
  { path: '/26-02-01', name: '26-02-01-clock' },
  { path: '/26-02-02', name: '26-02-02-clock' },
  { path: '/26-02-03', name: '26-02-03-clock' },
  { path: '/26-02-04', name: '26-02-04-clock' },
  { path: '/26-02-05', name: '26-02-05-clock' },
];

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function takeSnapshots() {
  console.log('🚀 Starting clock component snapshots...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to a standard size
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Ensure screenshots directory exists
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  
  for (const component of COMPONENTS) {
    try {
      console.log(`📸 Capturing ${component.name}...`);
      
      const url = `${BASE_URL}${component.path}`;
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      // Wait a bit for any animations to settle
      await page.waitForTimeout(2000);
      
      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${component.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ Saved ${component.name}.png`);
      
    } catch (error) {
      console.error(`❌ Failed to capture ${component.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('🎉 All snapshots completed!');
}

// Check if dev server is running
async function checkDevServer() {
  try {
    const response = await fetch(`${BASE_URL}`);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkDevServer();
  
  if (!serverRunning) {
    console.error(`❌ Development server not running at ${BASE_URL}`);
    console.error('Please start the dev server first: npm run dev');
    process.exit(1);
  }
  
  await takeSnapshots();
}

main().catch(console.error);
