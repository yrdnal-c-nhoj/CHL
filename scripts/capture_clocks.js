import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureClocks() {
  // Paths relative to this script
  const projectRoot = path.resolve(__dirname, '..');
  const registryPath = path.join(projectRoot, 'src/context/clockpages.json');
  const outputDir = path.join(projectRoot, 'screenshots');

  // 1. Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 2. Read and parse registry
  if (!fs.existsSync(registryPath)) {
    console.error(`❌ Error: Clock registry not found at ${registryPath}`);
    process.exit(1);
  }

  const clocks = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

  // 3. Get the last 12 clocks by date (YY-MM-DD)
  const last12 = [...clocks]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);

  console.log(`🚀 Starting capture for the last ${last12.length} clocks...`);

  const browser = await chromium.launch();
  // Set a standard desktop viewport
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  for (const clock of last12) {
    const url = `http://localhost:5173/${clock.path}`;
    const safeTitle = clock.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const outputPath = path.join(outputDir, `${clock.date}_${safeTitle}.png`);

    console.log(`📸 Capturing: [${clock.date}] ${clock.title}...`);

    try {
      // Navigate and wait for network to be idle
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

      // Per AGENTS.md, we need to wait for:
      // - The 1.5s header fade-out
      // - The black loading overlay to clear
      // 3 seconds total is a safe buffer for all React transitions to settle.
      await page.waitForTimeout(3000);

      await page.screenshot({ path: outputPath });
      console.log(`   ✅ Saved to ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`   ❌ Failed to capture ${clock.path}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✨ Done! All screenshots saved in: ${outputDir}`);
}

captureClocks().catch(console.error);