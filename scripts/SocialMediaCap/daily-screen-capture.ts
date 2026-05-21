import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ClockConfig } from '../../src/types/clock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.resolve(__dirname, '../../src/context/clockpages.json');
const SCREENSHOT_DIR = path.resolve(__dirname, '../../screen-caps');

const CAPTURE_CONFIG = {
  width: 1080,
  height: 1350,
  label: 'Daily Portrait PNG (4:5)'
};

function parseDateRange(dateRange: string): {
  startDate: string;
  endDate: string;
} {
  // Handle single date
  if (!dateRange.includes('..')) {
    return { startDate: dateRange, endDate: dateRange };
  }

  // Handle date range
  const [start, end] = dateRange.split('..');
  return { startDate: start.trim(), endDate: end.trim() };
}

function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const startParts = startDate.split('-').map(Number);
  const endParts = endDate.split('-').map(Number);

  const start = new Date(
    2000 + startParts[0],
    startParts[1] - 1,
    startParts[2],
  );
  const end = new Date(2000 + endParts[0], endParts[1] - 1, endParts[2]);

  const current = new Date(start);
  while (current <= end) {
    const year = current.getFullYear().toString().slice(-2);
    const month = (current.getMonth() + 1).toString().padStart(2, '0');
    const day = current.getDate().toString().padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

async function getActivePort(): Promise<number> {
  for (const port of [5173, 5174]) {
    try {
      const res = await fetch(`http://localhost:${port}`);
      if (res.ok) return port;
    } catch { continue; }
  }
  return 5173;
}

async function applyUIOptimizations(page: Page) {
  await page.addStyleTag({
    content: `
      header, footer, nav, [class*="Overlay"], [class*="nav"], [class*="Nav"] { 
        display: none !important; 
      }
      #root { 
        display: flex !important; 
        align-items: center; 
        justify-content: center; 
        height: 100vh;
        width: 100vw;
      }
    `
  });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
}

async function captureClocks(
  dateRange: string
) {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const port = await getActivePort();
  const { startDate, endDate } = parseDateRange(dateRange);
  const dates = getDatesInRange(startDate, endDate);
  const clocks: ClockConfig[] = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const targetClocks = clocks.filter(c => dates.includes(c.date));

  if (targetClocks.length === 0) {
    throw new Error(`No clocks found for range: ${dateRange}`);
  }

  console.log(`🚀 Starting capture for ${targetClocks.length} clocks on port ${port}...`);

  const browser = await chromium.launch({ headless: true });
  
  console.log(`\n📱 Format: ${CAPTURE_CONFIG.label}`);

  for (const clock of targetClocks) {
    const context = await browser.newContext({
      viewport: { width: CAPTURE_CONFIG.width, height: CAPTURE_CONFIG.height },
      deviceScaleFactor: 2
    });
    
    const page = await context.newPage();
    const url = `http://localhost:${port}/${clock.date}`;
    const filename = `${clock.date}.png`;
    const outputPath = path.join(SCREENSHOT_DIR, filename);

    try {
      process.stdout.write(`📸 ${clock.date} ... `);
      
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await applyUIOptimizations(page);
      
      // Wait exactly 0.9 seconds for animations/shaders to warm up
      await page.waitForTimeout(900);

      await page.screenshot({ path: outputPath, type: 'png' });

      process.stdout.write(`Done\n`);
    } catch (err) {
      console.error(`\n❌ Error capturing ${clock.date}:`, err);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log(`\n🎉 Sequence complete. Files saved in: ${SCREENSHOT_DIR}`);
}

function parseArguments(): {
  dateRange: string;
} {
  const args = process.argv.slice(2);
  let dateRangeArg = args.find(a => !a.startsWith('--'));

  // Support "last-month" alias to capture the last 30 days
  if (dateRangeArg === 'last-month') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const format = (d: Date) => d.toISOString().slice(2, 10);
    dateRangeArg = `${format(start)}..${format(end)}`;
  }

  const dateRange = dateRangeArg || new Date().toISOString().slice(2, 10);
  
  return { 
    dateRange
  };
}

const { dateRange } = parseArguments();
captureClocks(dateRange).catch(console.error);
