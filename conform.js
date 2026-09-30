#!/usr/bin/env node

/**
 * Conformance check for current clocks (September 2026 onward).
 *
 * Runs every standard from AGENTS.md, docs/CLOCKS.md and docs/PERFORMANCE.md
 * that can be checked mechanically, applies safe fixes with --fix, and then
 * runs scripts/verify-all-clocks.js as the final authority.
 *
 *   npm run conform                       # clocks with uncommitted changes
 *   npm run conform -- --fix              # ...and auto-fix what is safe
 *   npm run conform -- --path 26-09-20    # specific clock(s)
 *   npm run conform -- --all-current      # every clock from 26-09 onward
 *
 * Result levels:
 *   FIXED   was wrong, corrected automatically by --fix
 *   FAIL    breaks the clock contract (exit code 1). Needs a fix.
 *   REVIEW  budget / heuristic finding. Needs a human or AI judgement call.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const DATE_RE = /^\d{2}-\d{2}-\d{2}$/;
const CURRENT_BOUNDARY = '26-09';
const KB = 1024;

const BUDGET = { image: 200 * KB, video: 2 * KB * KB, font: 100 * KB };
const IMAGE_EXT = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.svg'];
const VIDEO_EXT = ['.mp4', '.webm', '.mov'];
const FONT_EXT = ['.woff2', '.woff', '.ttf', '.otf'];
const ASSET_EXT = [...IMAGE_EXT, ...VIDEO_EXT, ...FONT_EXT].map((e) => e.slice(1));
const IMPORT_RE = new RegExp(
  `^import\\s+(\\w+)\\s+from\\s+['"]([^'"]+\\.(?:${ASSET_EXT.join('|')}))(\\?url)?['"];?[ \\t]*$`,
  'gm',
);

const isCurrent = (date) => date >= CURRENT_BOUNDARY;
const fmtSize = (n) => (n >= KB * KB ? `${(n / KB / KB).toFixed(2)}MB` : `${Math.round(n / KB)}KB`);

function parseArgs(argv) {
  const o = { fix: false, allCurrent: false, paths: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--fix') o.fix = true;
    else if (a === '--all-current') o.allCurrent = true;
    else if (a === '--path') {
      if (!argv[i + 1]) throw new Error('--path requires a date like 26-09-20');
      o.paths.push(argv[(i += 1)]);
    } else if (a === '--help') {
      console.log('Usage: node scripts/conform.js [--fix] [--path YY-MM-DD]... [--all-current]');
      process.exit(0);
    } else throw new Error(`Unknown option: ${a}`);
  }
  return o;
}

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  } catch {
    return '';
  }
};

const dateFromPath = (p) => p.split(/[\\/]/).find((part) => DATE_RE.test(part)) ?? null;

function clockPathForDate(date) {
  const [yy, mm] = date.split('-');
  return path.join(PAGES_DIR, `20${yy}`, `${yy}-${mm}`, date, 'Clock.tsx');
}

function allDates() {
  const dates = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (DATE_RE.test(e.name)) dates.push(e.name);
      else walk(path.join(dir, e.name));
    }
  };
  walk(PAGES_DIR);
  return dates;
}

function selectDates(o) {
  if (o.paths.length) return [...new Set(o.paths)];
  if (o.allCurrent) return allDates().filter(isCurrent).sort();
  let files = git(['status', '--porcelain', '--', 'src/pages'])
    .split('\n')
    .filter(Boolean)
    .map((l) => l.slice(3))
    .map((p) => (p.includes(' -> ') ? p.split(' -> ')[1] : p).replace(/^"|"$/g, ''));
  if (!files.length) {
    files = git(['diff', '--name-only', 'HEAD^', '--', 'src/pages']).split('\n').filter(Boolean);
  }
  return [...new Set(files.map(dateFromPath).filter(Boolean))].sort();
}

function assetInfo(file) {
  if (!fs.existsSync(file)) return null;
  const { size } = fs.statSync(file);
  if (size < 512) {
    // Git LFS pointer file: the real size is recorded inside it.
    const m = fs.readFileSync(file, 'utf8').match(/^version https:\/\/git-lfs[\s\S]*?\nsize (\d+)/);
    if (m) return { size: Number(m[1]) };
  }
  return { size };
}

function resolveAsset(spec, dir) {
  if (spec.startsWith('@/')) return path.join(ROOT, 'src', spec.slice(2));
  if (spec.startsWith('.')) return path.resolve(dir, spec);
  return null;
}

function checkClock(date, o) {
  const tsxPath = clockPathForDate(date);
  const dir = path.dirname(tsxPath);
  const cssPath = path.join(dir, 'Clock.module.css');
  const findings = [];
  const add = (level, tag, message, fixable = false) => findings.push({ level, tag, message, fixable });

  if (!fs.existsSync(tsxPath)) {
    add('FAIL', 'structure', `Clock.tsx not found at ${path.relative(ROOT, tsxPath)}`);
    return findings;
  }

  let src = fs.readFileSync(tsxPath, 'utf8');
  let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const srcBefore = src;
  const cssBefore = css;
  const underscored = date.replace(/-/g, '_');

  // ---- displayName -------------------------------------------------------
  const expectedName = `Clock_${underscored}`;
  const dn = src.match(/(\w+)\.displayName\s*=\s*(['"])([^'"]*)\2/);
  if (!dn) {
    const def = src.match(/^export\s+default\s+(\w+)\s*;/m);
    if (def && o.fix) {
      src = src.replace(def[0], `${def[1]}.displayName = '${expectedName}';\n${def[0]}`);
      add('FIXED', 'component', `added displayName '${expectedName}'`);
    } else add('FAIL', 'component', `displayName not set (expected '${expectedName}')`, !!def);
  } else if (dn[3] !== expectedName) {
    if (o.fix) {
      src = src.replace(dn[0], `${dn[1]}.displayName = ${dn[2]}${expectedName}${dn[2]}`);
      add('FIXED', 'component', `displayName '${dn[3]}' -> '${expectedName}'`);
    } else add('FAIL', 'component', `displayName '${dn[3]}' should be '${expectedName}'`, true);
  }

  // ---- assets: imported => registered, sized, and actually used ----------
  const imports = [...src.matchAll(IMPORT_RE)].map((m) => ({ ident: m[1], spec: m[2] }));
  const aRe = /export\s+const\s+assets\s*(?::[^=]+)?=\s*\[([\s\S]*?)\]/;
  const am = src.match(aRe);
  let registered = am ? am[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  const missing = imports.map((i) => i.ident).filter((id) => !registered.includes(id));

  if (missing.length) {
    if (o.fix) {
      if (am) {
        const head = am[0].slice(0, -(am[1].length + 1));
        src = src.replace(am[0], `${head}${[...registered, ...missing].join(', ')}]`);
      } else {
        let last = 0;
        for (const m of src.matchAll(/^import[\s\S]*?;[ \t]*$/gm)) last = m.index + m[0].length;
        src = `${src.slice(0, last)}\n\nexport const assets = [${missing.join(', ')}];${src.slice(last)}`;
      }
      registered = [...registered, ...missing];
      add('FIXED', 'assets', `registered in assets: ${missing.join(', ')}`);
    } else add('FAIL', 'assets', `imported but not in assets export: ${missing.join(', ')}`, true);
  }

  const fontSpecs = new Set();
  for (const { ident, spec } of imports) {
    const uses = (src.match(new RegExp(`\\b${ident}\\b`, 'g')) ?? []).length;
    const rendered = uses - 1 - (registered.includes(ident) ? 1 : 0);
    if (rendered <= 0) add('REVIEW', 'assets', `${ident} is imported but never rendered; remove it and its assets entry`);

    const ext = path.extname(spec).toLowerCase();
    const file = resolveAsset(spec, dir);
    if (!file) continue;
    const info = assetInfo(file);
    if (!info) {
      add('FAIL', 'assets', `asset file not found: ${spec}`);
      continue;
    }
    if (FONT_EXT.includes(ext)) fontSpecs.add(spec);
    const kind = IMAGE_EXT.includes(ext) ? 'image' : VIDEO_EXT.includes(ext) ? 'video' : 'font';
    if (info.size > BUDGET[kind]) {
      add('REVIEW', 'perf', `${path.basename(spec)} is ${fmtSize(info.size)}, over the ${kind} budget of ${fmtSize(BUDGET[kind])}`);
    }
  }
  if (fontSpecs.size > 2) add('REVIEW', 'perf', `${fontSpecs.size} local fonts imported; max is 2 custom families per page`);
  for (const m of src.matchAll(/fontFamily\s*:\s*['"]([^'"]+)['"]/g)) {
    if (!m[1].includes(underscored)) add('REVIEW', 'fonts', `fontFamily '${m[1]}' should be unique to this clock (include ${underscored})`);
  }

  // ---- CSS --------------------------------------------------------------
  if (!css) add('FAIL', 'styling', 'Clock.module.css missing');
  if (/\b100vh\b/.test(css)) {
    if (o.fix) {
      css = css.replace(/\b100vh\b/g, '100dvh');
      add('FIXED', 'layout', '100vh -> 100dvh');
    } else add('FAIL', 'layout', 'uses 100vh; use 100dvh', true);
  }
  const animated =
    /@keyframes|animation(?:-name)?\s*:|transition\s*:/.test(css) ||
    /useSmoothClock|requestAnimationFrame|gsap|framer-motion|<video\b/.test(src);
  if (animated && !/prefers-reduced-motion/.test(css)) {
    add('REVIEW', 'a11y', 'animated clock has no prefers-reduced-motion: reduce treatment in Clock.module.css');
  }
  const bigPx = [...css.matchAll(/(?:^|[;{\s])(?:width|height|min-width|min-height|max-width|max-height|font-size)\s*:\s*\d{3,}px/gm)];
  if (bigPx.length) add('REVIEW', 'layout', `${bigPx.length} layout-scale fixed px value(s); prefer dvh/vw/vmin/rem/%/fr`);
  if (/@apply|@tailwind|tailwindcss/.test(css)) add('FAIL', 'styling', 'Tailwind in a clock stylesheet; use CSS Modules');
  if (/data:image\/[a-z+.-]+;base64/.test(css + src)) add('FAIL', 'assets', 'base64 image data; import a local file instead');

  // ---- TSX ---------------------------------------------------------------
  if (/className\s*=\s*["']/.test(src)) add('REVIEW', 'styling', 'string className found (Tailwind or global class?); use styles.* from the CSS Module');
  if (/document\.(?:body|documentElement)\b/.test(src)) add('FAIL', 'styling', 'mutates document.body/documentElement; keep effects local');
  if (/document\.head\b/.test(src)) add('REVIEW', 'styling', 'touches document.head; only acceptable for a Google Font <link> with cleanup');
  if (/Date\.now\s*\(/.test(src)) add('REVIEW', 'time', 'Date.now() present; displayed time must come from useClock/useSmoothClock');
  if (/(?:src\s*=\s*\{?\s*['"`]|url\(\s*['"]?)https?:\/\//.test(src + css)) add('REVIEW', 'assets', 'remote media URL; keep assets local');
  if (/<audio\b[^>]*autoPlay/s.test(src)) add('FAIL', 'media', 'autoplay audio is not allowed');

  for (const m of src.matchAll(/<img\b[^>]*?>/gs)) {
    if (!/\balt\s*=/.test(m[0])) add('FAIL', 'a11y', '<img> without alt (use alt="" if decorative)');
  }
  for (const m of [...src.matchAll(/<video\b[^>]*?>/gs)]) {
    const tag = m[0];
    if (!/\bautoPlay\b/.test(tag)) continue;
    const need = ['muted', 'playsInline'].filter((a) => !new RegExp(`\\b${a}\\b`).test(tag));
    if (!need.length) continue;
    if (o.fix) {
      src = src.replace(tag, tag.replace('<video', `<video ${need.join(' ')}`));
      add('FIXED', 'media', `<video autoPlay> now has ${need.join(' + ')}`);
    } else add('FAIL', 'media', `<video autoPlay> missing ${need.join(' + ')}`, true);
  }

  if (o.fix) {
    if (src !== srcBefore) fs.writeFileSync(tsxPath, src);
    if (css !== cssBefore) fs.writeFileSync(cssPath, css);
  }

  // ---- final authority: the project's own verifier ------------------------
  const v = spawnSync(process.execPath, ['scripts/verify-all-clocks.js', '--path', date], { cwd: ROOT, encoding: 'utf8' });
  const alreadyFailedName = findings.some((f) => f.level === 'FAIL' && f.tag === 'component');
  for (const line of (v.stdout ?? '').match(/^\s+- .+$/gm) ?? []) {
    const msg = line.replace(/^\s+- /, '');
    if (alreadyFailedName && msg.startsWith('displayName')) continue;
    add('FAIL', 'verifier', msg);
  }
  if (v.stderr && v.status !== 0 && !/violate the contract/.test(v.stderr) && !(v.stdout ?? '').includes('  - ')) {
    add('FAIL', 'verifier', v.stderr.trim().split('\n')[0]);
  }
  return findings;
}

function rootMediaFindings() {
  const media = [...IMAGE_EXT, ...VIDEO_EXT, '.mp3', '.wav'];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isFile() && media.includes(path.extname(e.name).toLowerCase()))
    .map((e) => e.name);
}

function main() {
  let o;
  try {
    o = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }

  const dates = selectDates(o);
  if (!dates.length) {
    console.log('No clock changes found. Use --path YY-MM-DD or --all-current.');
  }

  const totals = { FIXED: 0, FAIL: 0, REVIEW: 0 };
  let checked = 0;
  for (const date of dates) {
    if (!isCurrent(date) && !o.paths.includes(date)) {
      console.log(`SKIP  ${date} (historical; not rewritten unless named with --path)`);
      continue;
    }
    checked += 1;
    const findings = checkClock(date, o);
    console.log(`\n${date}${findings.length ? '' : '  OK'}`);
    for (const f of findings) {
      totals[f.level] += 1;
      const hint = f.fixable && !o.fix ? '  (auto-fixable: rerun with --fix)' : '';
      console.log(`  ${f.level.padEnd(6)} [${f.tag}] ${f.message}${hint}`);
    }
  }

  const stray = rootMediaFindings();
  if (stray.length) {
    totals.REVIEW += stray.length;
    console.log('\nrepo root');
    for (const name of stray) console.log(`  REVIEW [assets] root-level media file: ${name} (no unexplained root-level media)`);
  }

  console.log(`\nChecked ${checked} clock(s): ${totals.FIXED} fixed, ${totals.FAIL} failing, ${totals.REVIEW} to review.`);
  if (totals.FAIL > 0) process.exitCode = 1;
}

main();
