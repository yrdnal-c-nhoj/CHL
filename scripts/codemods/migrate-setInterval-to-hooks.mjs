#!/usr/bin/env node
/**
 * Conservative codemod: setInterval → canonical rAF clock hooks.
 *
 * This is intentionally *conservative*. It only transforms the structurally
 * safe, unambiguous pattern and FAILS CLOSED on anything it cannot prove is
 * a pure clock-state update. It never touches behavioral intervals
 * (animations, image cycling) or DOM-ref mutation.
 *
 * SAFE PATTERN THIS HANDLES (pure state ticker):
 *   useEffect(() => {
 *     const timer = setInterval(() => setX(new Date()), MS);
 *     return () => clearInterval(timer);
 *   }, []);
 *
 * SAFETY RULES:
 *   - The `useEffect` body must contain EXACTLY that interval + clearInterval.
 *   - The assigned interval id must equal the id passed to clearInterval.
 *   - The setter must be called with `new Date()` only.
 *   - There must be exactly ONE setInterval in the whole file.
 * Anything else is left untouched and reported for manual review.
 *
 * The transformed file drives its existing state from the canonical hook,
 * selected by cadence:
 *   - MS >= 1000  -> useSecondClock()            (1s rAF, updates when second changes)
 *   - MS <  1000  -> useMillisecondClock(MS)     (smooth sub-second; preserves animation)
 *
* Usage:
 *   node scripts/codemods/migrate-setInterval-to-hooks.mjs           # dry-run (writes catalog)
 *   node scripts/codemods/migrate-setInterval-to-hooks.mjs --apply   # apply safe transforms
 *   node scripts/codemods/migrate-setInterval-to-hooks.mjs --triage  # classify the review backlog
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES = path.join(ROOT, 'src', 'pages');
const CATALOG = path.join(ROOT, 'scripts', 'codemods', 'setinterval-catalog.json');
const TRIAGE = path.join(ROOT, 'scripts', 'codemods', 'pass2-triage.json');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const TRIAGE_MODE = args.includes('--triage');

function walkClockFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkClockFiles(full, acc);
    else if (e.isFile() && e.name === 'Clock.tsx') acc.push(full);
  }
  return acc;
}

/**
 * Returns the canonical hook (name + call) for a given cadence in ms.
 */
function hookFor(ms) {
  if (ms < 1000) return { name: 'useMillisecondClock', call: `useMillisecondClock(${ms})` };
  return { name: 'useSecondClock', call: 'useSecondClock()' };
}

/**
 * True iff the file has exactly one setInterval call and it appears in a
 * standalone pure "state ticker" effect. Returns { safe, ... } or { safe:false }.
 */
function findSafeTicker(code) {
  const intervalCount = (code.match(/setInterval\(/g) || []).length;
  if (intervalCount !== 1) return { safe: false, reason: `intervalCount=${intervalCount}` };

  const effectRe = /useEffect\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[\s*\]\s*\);/g;
  let m;
  while ((m = effectRe.exec(code)) !== null) {
    const body = m[1];
    const iv = body.match(
      /^\s*const\s+(\w+)\s*=\s*setInterval\(\s*\(\s*\)\s*=>\s*set(\w+)\(\s*new Date\(\)\s*\)\s*,\s*(\d+)\s*\);\s*return\s*\(\s*\)\s*=>\s*clearInterval\((\w+)\);\s*$/,
    );
    if (!iv) continue;
    const [, assignedId, setterName, ms, clearedId] = iv;
    if (assignedId !== clearedId) continue; // ids must match (sanity)
    const h = hookFor(Number(ms));
    return {
      safe: true,
      setter: `set${setterName}`,
      ms: Number(ms),
      hookName: h.name,
      hookCall: h.call,
      start: m.index,
      end: effectRe.lastIndex,
    };
  }
  return { safe: false, reason: 'no single pure ticker effect' };
}

function processFile(code) {
  const res = findSafeTicker(code);
  if (!res.safe) {
    return { changed: false, info: res };
  }

  // Choose a collision-free variable name for the hook time so we never shadow
  // an existing state variable (e.g. `const [time, setTime]`).
  let hookVar = 'clockTime';
  let suffix = 0;
  while (new RegExp(`\\b${hookVar}\\b`).test(code)) {
    suffix++;
    hookVar = `clockTime${suffix}`;
  }

  // Replace the ticker effect with hook-driven derivation.
  const after = [
    `  // Migrated from legacy interval to canonical rAF hook (${res.hookName}).`,
    `  // (was a pure ${res.ms}ms state ticker; state now derived from the hook time)`,
    `  const ${hookVar} = ${res.hookCall};`,
    `  useEffect(() => { ${res.setter}(${hookVar}); }, [${hookVar}, ${res.setter}]);`,
    '',
  ].join('\n');
  code = code.slice(0, res.start) + after + code.slice(res.end);

  // Ensure the canonical hook import exists.
  if (!/from ['"]@\/utils\/hooks['"]/.test(code)) {
    const importHook = `import { ${res.hookName} } from '@/utils/hooks';`;
    const importRe = /^(import .*\n)+/m;
    const head = code.match(importRe);
    if (head) {
      const insertAt = head.index + head[0].length;
      code = code.slice(0, insertAt) + `${importHook}\n` + code.slice(insertAt);
    } else {
      code = `${importHook}\n${code}`;
    }
  }

  return { changed: true, info: res, code };
}

/**
 * Classify a "needs review" file into an actionable sub-bucket so the manual
 * Pass 2 backlog is tractable. This is a TRIAGE ONLY — it never mutates code.
 *
 * Buckets:
 *   A: deprecated-import-only   - uses canonical useClockTime/useSecondClock
 *                                 (already safe for the time-hook rule); remaining
 *                                 violations are inline <style>/a11y/boilerplate.
 *                                 No action needed here.
 *   B: single-behavioral        - exactly one setInterval, but not a pure ticker
 *                                 (DOM/ref/animation). Needs manual judgment.
 *   C: multi-interval           - intervalCount >= 2. Needs manual judgment.
 *   D: deprecated-import+interval - imports useClockTime AND has its own
 *                                 setInterval for a subordinate behavior.
 */
function triageFile(code, reason) {
  const deprecatedImport =
    /useClockTime/.test(code) &&
    /@\/utils\/hooks/.test(code);
  const intervalCount = (code.match(/setInterval\(/g) || []).length;

  if (deprecatedImport && intervalCount === 1) {
    return { bucket: 'A', label: 'deprecated-import-only' };
  }
  if (deprecatedImport && intervalCount >= 2) {
    return { bucket: 'D', label: 'deprecated-import+interval' };
  }
  if (intervalCount >= 2) {
    return { bucket: 'C', label: 'multi-interval' };
  }
  return { bucket: 'B', label: 'single-behavioral', reason };
}

// ---- TRIAGE MODE ----
if (TRIAGE_MODE) {
  const files = walkClockFiles(PAGES);
  const triage = {
    generated: new Date().toISOString(),
    buckets: { A: [], B: [], C: [], D: [] },
  };
  for (const f of files) {
    const code = fs.readFileSync(f, 'utf8');
    if (!/setInterval\(/.test(code)) continue;
    // Skip files that are provably-safe (Pass 1 would transform them).
    const res = processFile(code);
    if (res.changed) continue;
    const rel = path.relative(ROOT, f);
    const t = triageFile(code, res.info.reason);
    triage.buckets[t.bucket].push({ file: rel, ...t });
  }
  fs.writeFileSync(TRIAGE, JSON.stringify(triage, null, 2));
  const total = Object.values(triage.buckets).reduce((n, arr) => n + arr.length, 0);
  console.log(`Triage report (total review files): ${total}`);
  for (const b of ['A', 'B', 'C', 'D']) {
    console.log(`  ${b}: ${triage.buckets[b].length} file(s)`);
  }
  console.log(`\nReport: ${TRIAGE}`);
  console.log('\nBucket A files (canonical time hook already used):');
  triage.buckets.A.forEach((f) => console.log(`  ${f.file}`));
  console.log(`\nBucket B files (single behavioral interval, needs manual review) — sample 10:`);
  triage.buckets.B.slice(0, 10).forEach((f) => console.log(`  ${f.file}  - ${f.reason}`));
  console.log(`\nBucket C files (multi-interval, needs manual review):`);
  triage.buckets.C.forEach((f) => console.log(`  ${f.file}`));
  console.log(`\nBucket D files (deprecated import + own interval):`);
  triage.buckets.D.forEach((f) => console.log(`  ${f.file}`));
  console.log('\nTriage is read-only. It does not modify any clock file.');
  process.exit(0);
}

const files = walkClockFiles(PAGES);
const catalog = { generated: new Date().toISOString(), safe: [], review: [] };

for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  if (!/setInterval\(/.test(code)) continue;
  const rel = path.relative(ROOT, f);
  const res = processFile(code);
  if (res.changed) catalog.safe.push({ file: rel, setter: res.info.setter, ms: res.info.ms, hook: res.info.hookName });
  else catalog.review.push({ file: rel, reason: res.info.reason });
}

const total = catalog.safe.length + catalog.review.length;

if (!APPLY) {
  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2));
  console.log(`Clock files with setInterval: ${total}`);
  console.log(`  SAFE (pure state ticker):  ${catalog.safe.length}`);
  console.log(`  Needs review:              ${catalog.review.length}`);
  console.log(`Catalog: ${CATALOG}`);
  console.log('\nSafe files:');
  catalog.safe.forEach((f) => console.log(`  ${f.file}  (setter=${f.setter}, ms=${f.ms}, ${f.hook})`));
  console.log(`\nReview files (sample ${Math.min(catalog.review.length, 20)}):`);
  catalog.review.slice(0, 20).forEach((f) => console.log(`  ${f.file}  - ${f.reason}`));
  console.log('\nRun with --apply to transform the safe files.');
  process.exit(0);
}

// ---- APPLY ----
let applied = 0;
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8'); // f is absolute already
  if (!/setInterval\(/.test(code)) continue;
  const res = processFile(code);
  if (res.changed) {
    fs.writeFileSync(f, res.code);
    applied++;
    console.log(`  applied ${path.relative(ROOT, f)}`);
  }
}
console.log(`\nApplied: ${applied} file(s).`);
console.log(`Run: node scripts/verify-all-clocks.js --csv clocks-report.csv`);

