#!/usr/bin/env node
/**
 * Runtime audit: loads every clock in a real browser and reports what actually
 * happens. Complements audit-legacy-clocks.mjs (static) by proving which
 * external requests fail TODAY, which clocks throw, and which render blank.
 *
 * Uses the `playwright` package already in devDependencies (no new deps).
 *
 * Setup (once):   npx playwright install chromium
 * Run:
 *   npm run build && npm run preview          # terminal 1 (serves :4173)
 *   node scripts/audit-runtime.mjs [options]  # terminal 2
 *
 * Options:
 *   --base URL        default http://localhost:4173
 *   --legacy          only clocks before 26-09-01
 *   --from YY-MM-DD / --to YY-MM-DD   restrict the date range
 *   --only a,b,c      specific dates
 *   --viewports list  default "mobile,desktop" (mobile=390x844, desktop=1280x720)
 *   --at ISO          replay at a fixed starting instant, then let time flow.
 *                     Try: 2027-03-14T01:59:55-05:00 (US DST start),
 *                          2026-11-01T01:59:55-04:00 (DST end),
 *                          2026-12-31T23:59:55Z (year rollover),
 *                          2028-02-29T23:59:55Z (leap day)
 *   --settle MS       wait after load before judging (default 3000)
 *   --concurrency N   default 4
 *   --shots DIR       save a PNG per clock/viewport (visual baseline)
 *   --json FILE       default audit-runtime.json
 *   --fail-on list    exit 1 if any listed category appears:
 *                     failed-request, console-error, page-error, blank, external
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const flag = (n) => argv.includes(n);

const BASE = opt('--base', 'http://localhost:4173').replace(/\/$/, '');
const BOUNDARY = '26-09-01';
const SETTLE = Number(opt('--settle', 3000));
const CONCURRENCY = Number(opt('--concurrency', 4));
const AT = opt('--at', null);
const SHOTS = opt('--shots', null);
const JSON_OUT = opt('--json', 'audit-runtime.json');
const FAIL_ON = (opt('--fail-on', '') || '').split(',').filter(Boolean);
const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 720 },
};
const vpNames = opt('--viewports', 'mobile,desktop').split(',').filter((v) => VIEWPORTS[v]);

// ---- enumerate clock dates from the filesystem ----
const PAGES = path.join(process.cwd(), 'src', 'pages');
// List only real directories (macOS adds .DS_Store files that are not folders).
const subdirs = (p) =>
  fs.readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
let dates = [];
for (const y of subdirs(PAGES).filter((d) => /^\d{4}$/.test(d)))
  for (const m of subdirs(path.join(PAGES, y)))
    for (const d of subdirs(path.join(PAGES, y, m)))
      if (/^\d{2}-\d{2}-\d{2}$/.test(d)) dates.push(d);
dates.sort();
if (flag('--legacy')) dates = dates.filter((d) => d < BOUNDARY);
if (opt('--from')) dates = dates.filter((d) => d >= opt('--from'));
if (opt('--to')) dates = dates.filter((d) => d <= opt('--to'));
if (opt('--only')) dates = opt('--only').split(',');

// Noise we do not want to count as a clock problem.
const IGNORED_CONSOLE = [/Download the React DevTools/i, /\[vite\]/i];
const IGNORED_ORIGINS = [/google-analytics\.com/, /googletagmanager\.com/];

const baseOrigin = new URL(BASE).origin;

async function auditOne(browser, date, vpName) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[vpName],
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const issues = { failedRequests: [], consoleErrors: [], pageErrors: [], external: new Set() };

  page.on('requestfailed', (r) => {
    const u = r.url();
    if (u.startsWith('data:') || IGNORED_ORIGINS.some((re) => re.test(u))) return;
    issues.failedRequests.push({ url: u, reason: r.failure()?.errorText ?? 'failed' });
  });
  page.on('response', (r) => {
    const u = r.url();
    if (u.startsWith('data:') || IGNORED_ORIGINS.some((re) => re.test(u))) return;
    if (r.status() >= 400) issues.failedRequests.push({ url: u, reason: `HTTP ${r.status()}` });
  });
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('data:') || u.startsWith('blob:')) return;
    if (new URL(u).origin !== baseOrigin && !IGNORED_ORIGINS.some((re) => re.test(u)))
      issues.external.add(new URL(u).origin);
  });
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (IGNORED_CONSOLE.some((re) => re.test(t))) return;
    issues.consoleErrors.push(t.slice(0, 300));
  });
  page.on('pageerror', (e) => issues.pageErrors.push(String(e.message).slice(0, 300)));

  if (AT) {
    await page.clock.install({ time: new Date(AT) });
    await page.clock.resume(); // time starts at AT and keeps flowing
  }

  let navError = null;
  try {
    await page.goto(`${BASE}/${date}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(SETTLE);
  } catch (e) {
    navError = String(e.message).slice(0, 200);
  }

  // "Blank" = nothing meaningful rendered beyond the app shell.
  const render = await page
    .evaluate(() => {
      const root = document.getElementById('root') ?? document.body;
      const text = (root.innerText || '').trim();
      const visuals = root.querySelectorAll('canvas,video,img,svg,time,[class]').length;
      const hasLoading = /^loading\.\.\.$/i.test(text);
      return {
        textLen: text.length,
        visuals,
        stuckLoading: hasLoading,
        hasTime: !!document.querySelector('time'),
        scrollOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    })
    .catch(() => null);

  const blank = !render || render.stuckLoading || (render.textLen === 0 && render.visuals < 3);

  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page
      .screenshot({ path: path.join(SHOTS, `${date}.${vpName}.png`) })
      .catch(() => {});
  }
  await context.close();

  return {
    date,
    era: date >= BOUNDARY ? 'current' : 'legacy',
    viewport: vpName,
    navError,
    blank,
    stuckLoading: render?.stuckLoading ?? false,
    noTimeElement: render ? !render.hasTime : null,
    horizontalOverflow: render?.scrollOverflowX ?? null,
    external: [...issues.external].sort(),
    failedRequests: issues.failedRequests,
    consoleErrors: issues.consoleErrors,
    pageErrors: issues.pageErrors,
  };
}

// ---- run ----
try {
  const r = await fetch(BASE, { method: 'HEAD' });
  if (!r.ok) throw new Error(String(r.status));
} catch {
  console.error(`Cannot reach ${BASE}. Run: npm run build && npm run preview`);
  process.exit(2);
}

const jobs = dates.flatMap((d) => vpNames.map((v) => [d, v]));
console.log(
  `Auditing ${dates.length} clocks x ${vpNames.length} viewport(s)` +
    (AT ? ` at simulated ${AT}` : '') +
    ` against ${BASE} (concurrency ${CONCURRENCY})`,
);

const browser = await chromium.launch();
const results = [];
let next = 0;
let done = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) {
      const [d, v] = jobs[next++];
      try {
        results.push(await auditOne(browser, d, v));
      } catch (e) {
        results.push({ date: d, era: d >= BOUNDARY ? 'current' : 'legacy', viewport: v, navError: String(e.message).slice(0, 200), blank: true, external: [], failedRequests: [], consoleErrors: [], pageErrors: [] });
      }
      if (++done % 25 === 0) console.log(`  ${done}/${jobs.length}`);
    }
  }),
);
await browser.close();
results.sort((a, b) => a.date.localeCompare(b.date) || a.viewport.localeCompare(b.viewport));
fs.writeFileSync(JSON_OUT, JSON.stringify({ base: BASE, at: AT, results }, null, 2));

// ---- summary ----
const bad = (r) =>
  r.navError || r.blank || r.failedRequests.length || r.pageErrors.length || r.consoleErrors.length;
const cats = {
  'failed-request': results.filter((r) => r.failedRequests.length),
  'console-error': results.filter((r) => r.consoleErrors.length),
  'page-error': results.filter((r) => r.pageErrors.length),
  blank: results.filter((r) => r.blank || r.navError),
  external: results.filter((r) => r.external.length),
};
console.log('\nSummary (clock/viewport runs affected):');
for (const [k, v] of Object.entries(cats)) console.log(`  ${k.padEnd(15)} ${v.length}`);

const origins = {};
for (const r of results) for (const o of r.external) (origins[o] ??= new Set()).add(r.date);
console.log('\nThird-party origins contacted at runtime:');
for (const [o, s] of Object.entries(origins).sort((a, b) => b[1].size - a[1].size))
  console.log(`  ${o}  (${s.size} clocks)`);

console.log('\nProblem runs:');
for (const r of results.filter(bad)) {
  console.log(`  ${r.date} [${r.era}/${r.viewport}]${r.blank ? '  BLANK' : ''}${r.navError ? '  NAV: ' + r.navError : ''}`);
  for (const f of r.failedRequests.slice(0, 4)) console.log(`      ${f.reason}  ${f.url.slice(0, 110)}`);
  for (const e of r.pageErrors.slice(0, 2)) console.log(`      pageerror: ${e}`);
  for (const e of r.consoleErrors.slice(0, 2)) console.log(`      console: ${e.slice(0, 110)}`);
}
console.log(`\nFull report: ${JSON_OUT}`);

const tripped = FAIL_ON.filter((c) => cats[c]?.length);
if (tripped.length) {
  console.error(`FAIL: ${tripped.join(', ')}`);
  process.exit(1);
}
