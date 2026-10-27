#!/usr/bin/env node
/**
 * Static legacy-clock audit (no browser needed).
 *
 * Scans every clock directory under src/pages/YYYY/YY-MM/YY-MM-DD/ and reports
 * risks that can break WITHOUT anyone editing the clock:
 *
 *   EXT-FONT-CSS   Google Fonts stylesheet loaded at runtime
 *   EXT-FONT-FILE  Hard-coded fonts.gstatic.com file URL (versioned, brittle)
 *   EXT-VIDEO      YouTube embed / iframe API (video can go private/removed)
 *   EXT-API        Live third-party API or image service
 *   EXT-OTHER      Any other external URL
 *   TIMER-LEAK     setInterval / requestAnimationFrame with no matching cleanup
 *   CSS-TYPO       Likely-invalid CSS unit, e.g. "600p" or "perspective1000px)"
 *
 * Boundary (docs/STANDARDS.md S1/S2): clocks dated before 26-09-01 are legacy.
 * Current clocks are reported separately so rules for them are not confused
 * with the "preserve, don't rewrite" policy for the archive.
 *
 * Usage:
 *   node scripts/audit-legacy-clocks.mjs                 # human summary
 *   node scripts/audit-legacy-clocks.mjs --json out.json # full machine report
 *   node scripts/audit-legacy-clocks.mjs --fail-on EXT-API,EXT-VIDEO   # CI gate
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES = path.join(ROOT, 'src', 'pages');
const BOUNDARY = '26-09-01';
const EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.css', '.html']);

const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const failOn = args.includes('--fail-on')
  ? args[args.indexOf('--fail-on') + 1].split(',')
  : [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

// Find clock dirs: .../YY-MM-DD
const clockDirs = [];
for (const year of fs.readdirSync(PAGES)) {
  const yp = path.join(PAGES, year);
  if (!fs.statSync(yp).isDirectory() || !/^\d{4}$/.test(year)) continue;
  for (const month of fs.readdirSync(yp)) {
    const mp = path.join(yp, month);
    if (!fs.statSync(mp).isDirectory()) continue;
    for (const day of fs.readdirSync(mp)) {
      const dp = path.join(mp, day);
      if (/^\d{2}-\d{2}-\d{2}$/.test(day) && fs.statSync(dp).isDirectory()) {
        clockDirs.push({ date: day, dir: dp });
      }
    }
  }
}
clockDirs.sort((a, b) => a.date.localeCompare(b.date));

const classifyUrl = (url) => {
  if (/fonts\.googleapis\.com|fonts\.googleapi\.com/.test(url)) return 'EXT-FONT-CSS';
  if (/fonts\.gstatic\.com\/s\//.test(url)) return 'EXT-FONT-FILE';
  if (/youtube\.com|youtu\.be/.test(url)) return 'EXT-VIDEO';
  if (/worldtimeapi|dog\.ceo|cataas|picsum\.photos|placehold\.co|api\./.test(url))
    return 'EXT-API';
  return 'EXT-OTHER';
};

// fonts.gstatic.com file URLs normally end in a long hash (>= ~20 chars).
const looksTruncatedGstatic = (url) => {
  const m = url.match(/\/v\d+\/([A-Za-z0-9_-]+)\.(woff2|ttf|otf)/);
  return m ? m[1].length < 20 : false;
};

const IGNORE_URL = /w3\.org|localhost|schema\.org/;
const URL_RE = /https?:\/\/[^\s'"`)\\<>]+/g;
const findings = [];
const add = (date, code, file, line, detail) =>
  findings.push({
    date,
    era: date >= BOUNDARY ? 'current' : 'legacy',
    code,
    file: path.relative(ROOT, file),
    line,
    detail,
  });

for (const { date, dir } of clockDirs) {
  const files = walk(dir).filter((f) => EXTS.has(path.extname(f)));
  let combined = '';
  const perFile = [];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    perFile.push([f, src]);
    combined += `\n${src}`;
  }

  for (const [f, src] of perFile) {
    src.split('\n').forEach((text, i) => {
      const trimmed = text.trim();
      // Skip fully commented lines.
      const commented = /^(\/\/|\*|\/\*)/.test(trimmed);
      if (commented) return;

      for (const url of text.match(URL_RE) ?? []) {
        if (IGNORE_URL.test(url)) continue;
        const code = classifyUrl(url);
        const extra =
          code === 'EXT-FONT-FILE' && looksTruncatedGstatic(url)
            ? ' (hash looks truncated: probably already 404s)'
            : '';
        add(date, code, f, i + 1, url + extra);
      }

      if (path.extname(f) === '.css' || /css|style|`/.test(text)) {
        if (/perspective\d/.test(text)) add(date, 'CSS-TYPO', f, i + 1, trimmed);
        else if (/(?<![\w.#-])\d+(?:\.\d+)?p(?![xtcxw\w%])/.test(text) && /[:(]/.test(text))
          add(date, 'CSS-TYPO', f, i + 1, trimmed);
      }
    });
  }

  const usesSharedClock = /useClock|useSmoothClock/.test(combined);
  if (/setInterval\s*\(/.test(combined) && !/clearInterval\s*\(/.test(combined))
    add(date, 'TIMER-LEAK', dir, 0, 'setInterval without clearInterval' + (usesSharedClock ? ' (also uses shared clock hook)' : ''));
  if (/requestAnimationFrame\s*\(/.test(combined) && !/cancelAnimationFrame\s*\(/.test(combined))
    add(date, 'TIMER-LEAK', dir, 0, 'requestAnimationFrame without cancelAnimationFrame');
}

// ---- Summary ----
const byCode = {};
for (const f of findings) {
  const k = `${f.era}:${f.code}`;
  (byCode[k] ??= new Set()).add(f.date);
}
const legacyClocks = clockDirs.filter((c) => c.date < BOUNDARY).length;
const currentClocks = clockDirs.length - legacyClocks;

console.log(`Clocks scanned: ${clockDirs.length} (${legacyClocks} legacy, ${currentClocks} current; boundary ${BOUNDARY})\n`);
console.log('Clocks affected, by check:');
for (const code of ['EXT-API', 'EXT-VIDEO', 'EXT-FONT-FILE', 'EXT-FONT-CSS', 'EXT-OTHER', 'TIMER-LEAK', 'CSS-TYPO']) {
  const l = byCode[`legacy:${code}`]?.size ?? 0;
  const c = byCode[`current:${code}`]?.size ?? 0;
  console.log(`  ${code.padEnd(14)} legacy: ${String(l).padStart(3)}   current: ${String(c).padStart(3)}`);
}
console.log('\nHigh-priority legacy items (can break with no code change):');
for (const f of findings.filter(
  (x) => x.era === 'legacy' && ['EXT-API', 'EXT-VIDEO', 'EXT-FONT-FILE', 'CSS-TYPO'].includes(x.code),
)) {
  console.log(`  [${f.code}] ${f.date}  ${f.file}${f.line ? ':' + f.line : ''}\n      ${f.detail.slice(0, 140)}`);
}

if (jsonOut) {
  fs.writeFileSync(jsonOut, JSON.stringify({ boundary: BOUNDARY, findings }, null, 2));
  console.log(`\nFull report: ${jsonOut}`);
}

const gated = findings.filter((f) => failOn.includes(f.code) && f.era === 'current');
if (gated.length) {
  console.error(`\nFAIL: ${gated.length} current-era finding(s) match --fail-on`);
  process.exit(1);
}
