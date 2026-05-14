import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.resolve(__dirname, '../src/context/clockpages.json');
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/screenshots');

// Social media dimensions and optimizations
const SOCIAL_DIMENSIONS = {
  instagram: { 
    width: 1080, 
    height: 1080, 
    name: 'Instagram Square',
    quality: 90,
    format: 'png',
    optimizations: {
      hideNavigation: true,
      centerContent: true,
      addPadding: true,
      backgroundColor: '#ffffff'
    }
  },
  twitter: { 
    width: 1200, 
    height: 675, 
    name: 'Twitter 16:9',
    quality: 85,
    format: 'png',
    optimizations: {
      hideNavigation: true,
      centerContent: true,
      addPadding: false,
      backgroundColor: '#ffffff'
    }
  },
  facebook: { 
    width: 1200, 
    height: 630, 
    name: 'Facebook 16:9',
    quality: 85,
    format: 'png',
    optimizations: {
      hideNavigation: true,
      centerContent: true,
      addPadding: false,
      backgroundColor: '#ffffff'
    }
  }
};

function parseDateRange(dateRange: string): { startDate: string; endDate: string } {
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
  
  const start = new Date(2000 + startParts[0], startParts[1] - 1, startParts[2]);
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

async function applySocialMediaOptimizations(page: any, platform: keyof typeof SOCIAL_DIMENSIONS) {
  const optimizations = SOCIAL_DIMENSIONS[platform].optimizations;
  
  // Hide navigation and footer elements
  if (optimizations.hideNavigation) {
    await page.addStyleTag({
      content: `
        header, footer, nav, [class*="footerStrip"], [class*="nav"], [class*="Overlay"] { 
          display: none !important; 
        }
      `
    });
  }
  
  // Center and optimize content
  if (optimizations.centerContent) {
    await page.addStyleTag({
      content: `
        body, html, #root { 
          margin: 0 !important; padding: 0 !important; 
          overflow: hidden !important; 
          width: ${SOCIAL_DIMENSIONS[platform].width}px !important; 
          height: ${SOCIAL_DIMENSIONS[platform].height}px !important; 
          background: ${optimizations.backgroundColor} !important; 
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        main, [class*="container"], [class*="clockFace"] { 
          display: flex !important; 
          align-items: center !important; 
          justify-content: center !important; 
          height: 100% !important; 
          width: 100% !important; 
          transform: none !important;
          ${optimizations.addPadding ? 'padding: 2rem !important;' : ''}
        }
      `
    });
  }
}

async function captureClocks(dateRange: string, platforms: (keyof typeof SOCIAL_DIMENSIONS)[]) {
  // Ensure the output directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const { startDate, endDate } = parseDateRange(dateRange);
  const dates = getDatesInRange(startDate, endDate);
  
  console.log(`📅 Date range: ${startDate} to ${endDate} (${dates.length} days)`);
  console.log(`📱 Platforms: ${platforms.map(p => SOCIAL_DIMENSIONS[p].name).join(', ')}`);

  const clocks = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  const filteredClocks = clocks.filter((clock: any) => 
    dates.includes(clock.date)
  );

  if (filteredClocks.length === 0) {
    console.error(`❌ No clocks found in date range ${startDate}..${endDate}`);
    console.log('Available clocks:');
    clocks.slice(-10).forEach((clock: any) => {
      console.log(`  - ${clock.date}: ${clock.title}`);
    });
    process.exit(1);
  }

  console.log(`✅ Found ${filteredClocks.length} clocks in date range`);

  // Detect which port is actually running the BorrowedTime app
  let port = 5173;
  try {
    console.log('Checking port 5173...');
    const res = await fetch('http://localhost:5173');
    const text = await res.text();
    if (!text.includes('id="root"')) throw new Error('Not our app');
  } catch {
    console.log('Port 5173 is inactive or incorrect. Using port 5174...');
    port = 5174;
  }

  console.log(`🚀 Starting capture sequence on http://localhost:${port}`);

  const browser = await chromium.launch();
  
  for (const platform of platforms) {
    const dimensions = SOCIAL_DIMENSIONS[platform];
    console.log(`\n📱 Capturing for ${dimensions.name} (${dimensions.width}x${dimensions.height})`);
    
    const page = await browser.newPage({
      viewport: { width: dimensions.width, height: dimensions.height },
      deviceScaleFactor: 2 // High quality for social media
    });

    // Apply platform-specific optimizations
    await applySocialMediaOptimizations(page, platform);

    for (const clock of filteredClocks) {
      const url = `http://localhost:${port}/${clock.date}`;
      const outputPath = path.join(SCREENSHOT_DIR, `${clock.date}-${platform}.png`);

      try {
        console.log(`📸 Capturing: ${clock.title} [${clock.date}]`);
        
        // Wait until the basic page structure is loaded
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        
        // Wait for component to load and settle
        console.log('⏱️ Waiting 1.5 seconds for component to load...');
        await page.waitForTimeout(1500);
        
        await page.screenshot({ 
          path: outputPath,
          quality: dimensions.quality,
          animations: 'allow' 
        });
        
        console.log(`✅ Saved: ${outputPath}`);
      } catch (err: any) {
        console.error(`❌ Failed to capture ${clock.date}: ${err.message}`);
      }
    }

    await page.close();
  }

  await browser.close();
  
  console.log(`\n🎉 Social media capture complete!`);
  console.log(`📸 Files saved in: ${SCREENSHOT_DIR}`);
  
  for (const platform of platforms) {
    const dimensions = SOCIAL_DIMENSIONS[platform];
    console.log(`   - ${dimensions.name}: ${filteredClocks.length} files`);
  }
}

// Parse command line arguments
function parseArguments(): { dateRange: string; platforms: (keyof typeof SOCIAL_DIMENSIONS)[] } {
  const args = process.argv.slice(2);
  
  // Find date range (first non-flag argument)
  const dateRangeArg = args.find(arg => !arg.startsWith('--'));
  let dateRange: string;
  
  if (dateRangeArg) {
    dateRange = dateRangeArg;
  } else {
    // Default to today's date
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    dateRange = `${year}-${month}-${day}`;
  }
  
  // Determine platforms
  const platforms: (keyof typeof SOCIAL_DIMENSIONS)[] = [];
  
  if (args.includes('--instagram')) platforms.push('instagram');
  if (args.includes('--twitter')) platforms.push('twitter');
  if (args.includes('--facebook')) platforms.push('facebook');
  
  // If no platforms specified, default to all
  if (platforms.length === 0) {
    platforms.push('instagram', 'twitter', 'facebook');
  }
  
  return { dateRange, platforms };
}

// Main execution
const { dateRange, platforms } = parseArguments();

captureClocks(dateRange, platforms).catch((err: any) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
