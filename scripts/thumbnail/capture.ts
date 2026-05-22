import http from 'http';
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to the project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REGISTRY_PATH = path.join(ROOT_DIR, 'src/context/clockpages.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src/assets/thumbnails');
const BASE_URL = 'http://localhost:5173';

interface ClockPage {
  path: string;
  date: string;
  title: string;
}

/**
 * Main capture function
 */
async function captureThumbnails() {
  // 0. Pre-flight check: Is the dev server running?
  const isServerRunning = await new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
  });

  if (!isServerRunning) {
    console.error(`\x1b[31m[Error] Local development server not found at ${BASE_URL}\x1b[0m`);
    console.error('Please run "npm run dev" in another terminal before capturing thumbnails.');
    process.exit(1);
  }

  // 1. Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 2. Load Registry
  const registry: ClockPage[] = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  
  // Sort by date descending (YY-MM-DD format sorts naturally as strings)
  const sortedClocks = [...registry].sort((a, b) => b.date.localeCompare(a.date));

  // 3. Determine which clocks to capture based on CLI args
  const args = process.argv.slice(2);
  let targets: ClockPage[] = [];

  if (args.length === 0) {
    // Default: Today or Most Recent
    const todayStr = new Date().toISOString().split('T')[0].slice(2); // YY-MM-DD format roughly
    
    const todayClock = sortedClocks.find(c => c.date === todayStr);
    targets = todayClock ? [todayClock] : [sortedClocks[0]];
    console.log(todayClock ? `[Target] Today's clock: ${todayClock.date}` : `[Target] No clock for today. Using most recent: ${sortedClocks[0].date}`);
  } else if (args.length === 1) {
    // Specific Date
    const match = sortedClocks.find(c => c.date === args[0]);
    if (!match) throw new Error(`Clock not found for date: ${args[0]}`);
    targets = [match];
  } else if (args.length === 2) {
    // Range (inclusive)
    const [start, end] = args;
    targets = sortedClocks.filter(c => c.date >= start && c.date <= end);
    console.log(`Capturing range: ${start} to ${end} (${targets.length} clocks)`);
  }

  // 4. Launch Browser
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 600, height: 600 }, // Set a square viewport for capturing the component
    deviceScaleFactor: 2,
  });

  for (const clock of targets) {
    const page = await context.newPage();
    const targetUrl = `${BASE_URL}/${clock.path}`;
    
    console.log(`[Processing] ${clock.date}: ${clock.title} at ${targetUrl}`);
    
    try {
      // Use 'load' instead of 'networkidle' to avoid timeouts from background noise (like HMR)
      await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });
      
      // Optional: attempt to wait for network idle for up to 5s, but don't fail if it stays busy
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      // Wait for the overlay to disappear (based on useClockPage logic)
      // We wait for the main content or the lack of loading state
      await page.waitForTimeout(1000); 

      // Hide UI elements if necessary (like the footer navigation)
      await page.addStyleTag({ content: '[class*="footerStrip"] { display: none !important; }' });

      // Take screenshot of the center area
      const screenshotBuffer = await page.locator('body').screenshot(); // Capture the entire body content

      // 5. Optimize with Sharp
      const sanitizedTitle = clock.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const filename = `${clock.date}-${sanitizedTitle}.webp`;
      const finalPath = path.join(OUTPUT_DIR, filename);

      await sharp(screenshotBuffer)
        .resize(300, 300, { fit: 'cover' }) // Resize to 300x300, covering the area and cropping if needed
        .webp({ 
          quality: 80, 
          effort: 6, // High compression effort
          lossless: false 
        })
        .toFile(finalPath);

      console.log(`[Success] Saved to ${filename}`);
    } catch (err) {
      console.error(`[Error] Failed to capture ${clock.date}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Capture process complete.');
}

captureThumbnails().catch(console.error);