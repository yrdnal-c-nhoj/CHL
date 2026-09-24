import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium, type PageScreenshotOptions } from 'playwright';

const SCREENSHOT_DIR = path.join(process.cwd(), 'screen-caps', 'screenshots');
const DEFAULT_VITE_PORT = 5173;

interface DevServerHandle {
  url: string;
  cleanup: () => void;
}

function parseViteUrl(data: Buffer): string | null {
  const text = data.toString();
  const match = text.match(/Local:\s*(http:\/\/localhost:\d+)/);
  return match ? match[1] : null;
}

export function isPortInUse(port: number): boolean {
  try {
    const net = require('net');
    const test = net.createServer().listen(port);
    test.close();
    return false;
  } catch {
    return true;
  }
}

async function checkUrlReady(url: string, maxWaitMs = 10000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const result = await fetch(url);
      if (result.ok) return true;
    } catch {
      // server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function startDevServer(port: number): Promise<DevServerHandle> {
  console.log('[screencaps] Starting Vite preview server...');
  const proc = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let resolvedUrl: string | null = null;

  proc.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(`[vite] ${data.toString()}`);
    if (!resolvedUrl) {
      resolvedUrl = parseViteUrl(data);
    }
  });
  proc.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(`[vite] ${data.toString()}`);
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error('[screencaps] Dev server did not emit URL in time'));
    }, 10000);

    const check = setInterval(() => {
      if (resolvedUrl) {
        clearTimeout(timeout);
        clearInterval(check);
        console.log(`[screencaps] Dev server URL: ${resolvedUrl}`);
        resolve({
          url: resolvedUrl,
          cleanup: () => {
            proc.kill('SIGTERM');
            try {
              proc.stdout?.destroy();
              proc.stderr?.destroy();
            } catch {}
          },
        });
      }
    }, 200);

    proc.on('error', (err: Error) => {
      clearTimeout(timeout);
      clearInterval(check);
      reject(err);
    });
  });
}

async function resolveDevServer(preferredPort: number): Promise<DevServerHandle> {
  const preferredUrl = `http://localhost:${preferredPort}`;
  if (await checkUrlReady(preferredUrl, 2000)) {
    console.log(`[screencaps] Reusing existing dev server at ${preferredUrl}`);
    return { url: preferredUrl, cleanup: () => {} };
  }

  return await startDevServer(preferredPort);
}

function getClockDates(): string[] {
  const clockPagesPath = path.join(process.cwd(), 'src', 'context', 'clockpages.json');
  if (fs.existsSync(clockPagesPath)) {
    const data = JSON.parse(fs.readFileSync(clockPagesPath, 'utf-8'));
    return data.map((item: { path: string }) => item.path);
  }
  return [];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const portArg = args.findIndex((a) => a === '--port' || a === '-p');
  let port = DEFAULT_VITE_PORT;
  const dates: string[] = [];

  if (portArg !== -1) {
    port = parseInt(args[portArg + 1], 10);
    args.splice(portArg, 2);
  }

  for (const arg of args) {
    if (!arg.startsWith('-')) {
      dates.push(arg);
    }
  }

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const server = await resolveDevServer(port);

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();
    const clockDates = dates.length > 0 ? dates : getClockDates();

    for (const date of clockDates) {
      const url = `${server.url}/${date}`;
      console.log(`[screencaps] Capturing ${date} from ${url}`);

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const screenshotPath = path.join(SCREENSHOT_DIR, `${date}.png`);
      const options: PageScreenshotOptions = {
        path: screenshotPath,
        fullPage: false,
        type: 'png',
      };

      await page.screenshot(options);
      console.log(`[screencaps] Saved: ${screenshotPath}`);
    }

    await browser.close();
  } finally {
    server.cleanup();
  }
}

main().catch((err) => {
  console.error('[screencaps] Error:', err);
  process.exit(1);
});
