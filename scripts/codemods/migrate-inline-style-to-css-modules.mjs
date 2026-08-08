#!/usr/bin/env node
/**
 * Conservative codemod: inline `<style>` → CSS Modules.
 *
 * This is intentionally *conservative* and mirrors the `setInterval` codemod's
 * philosophy: it FAILS CLOSED on anything it cannot prove is safe to convert.
 *
 * WHY CONSERVATIVE:
 *   CSS Modules scope/hash selector names. A naive auto-conversion of a
 *   `<style>{`...`}</style>` block into Clock.module.css would:
 *     - break `@font-face` blocks that use JS-templated URLs (`${var}`), and
 *     - silently break plain `.class{}` selectors referenced later by
 *       `className="class"` in JSX (the classname gets hashed but the JSX
 *       reference is not updated).
 *   So we classify every file first, then auto-migrate ONLY the provably-safe
 *   static subset (bucket A: static `@font-face` with no templates/classes).
 *
 * SAFE PATTERN THIS HANDLES (bucket A):
 *   <style>{`@font-face { ... } @font-face { ... }`}</style>
 *   where the template literal is STATIC (no `${...}`) and contains ONLY
 *   `@font-face` rules (no `@keyframes`, no `.class`/`#id`/element selectors).
 *
 * SAFETY RULES (all must hold):
 *   - The `<style>` block's content is a single template literal (backticks)
 *     OR a static string; it must NOT contain `${`.
 *   - The CSS inside must contain NO `@keyframes`, NO `.`/`#`/element selectors,
 *     only `@font-face` rules.
 *   - There must be a `Clock.module.css` sibling (created if missing) to host
 *     the extracted CSS.
 *
 * Anything else is left untouched and reported for manual review.
 *
 * Usage:
 *   node scripts/codemods/migrate-inline-style-to-css-modules.mjs           # dry-run (writes triage)
 *   node scripts/codemods/migrate-inline-style-to-css-modules.mjs --apply   # migrate bucket A
 *   node scripts/codemods/migrate-inline-style-to-css-modules.mjs --triage  # classify all 140 files
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES = path.join(ROOT, 'src', 'pages');
const TRIAGE = path.join(ROOT, 'scripts', 'codemods', 'inline-style-triage.json');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

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
 * Extract every `<style>` block's raw inner content (the part between the
 * opening `<style>` and closing `</style>`). Returns array of strings.
 */
function extractStyleBlocks(code) {
  const blocks = [];
  const re = /<style[\s>]([\s\S]*?)<\/style>/g;
  let m;
  while ((m = re.exec(code)) !== null) blocks.push(m[1]);
  return blocks;
}

/**
 * True iff the style block is a raw static CSS payload (no `${}` interpolation).
 * Returns the extracted CSS string, or null if it contains templates/dynamic.
 *
 * Handles the dominant JSX patterns:
 *   <style>{`...`}</style>          (expression-wrapped template literal)
 *   <style>{\n  `...`\n}</style>
 *   <style>{"..."}</style>          (expression-wrapped string)
 *   <style>{`...` + `...`}</style>  (concatenated static literals)
 *   <style>{fontStyle}</style>      (variable reference -> dynamic, null)
 */
function staticCss(block) {
  let css = block.trim();

  // Unwrap a JSX expression wrapper: { ... }
  if (css.startsWith('{') && css.endsWith('}')) {
    css = css.slice(1, -1).trim();
  }

  // Concatenation of multiple static literals: `a` + `b`  (no ${} anywhere)
  if (css.includes('+')) {
    // Only handle if the whole thing is backtick/quote-concatenated statics.
    const parts = css.split('+').map((p) => p.trim());
    const allStatic = parts.every(
      (p) =>
        (p.startsWith('`') &&
          p.endsWith('`') &&
          !p.includes('${')) ||
        ((p.startsWith('"') && p.endsWith('"')) ||
          (p.startsWith("'") && p.endsWith("'"))),
    );
    if (!allStatic) return null; // contains a variable/expression
    return parts
      .map((p) => p.slice(1, -1))
      .join('');
  }

  if (css.startsWith('`') && css.endsWith('`')) {
    if (css.includes('${')) return null; // template literal with interpolation
    css = css.slice(1, -1);
  } else if (
    (css.startsWith('"') && css.endsWith('"')) ||
    (css.startsWith("'") && css.endsWith("'"))
  ) {
    css = css.slice(1, -1);
  } else {
    // Not a single literal — could be a variable ref or JSX expression.
    return null;
  }
  return css;
}

/**
 * Classify a static CSS payload into a bucket.
 *   A: only @font-face rules
 *   B: has @keyframes (no class selectors)
 *   C: has class/id/element selectors (no keyframes)
 *   E: has keyframes AND class selectors, or unusual (mixed)
 *   D is determined at the file level (templated), not here.
 */
function classifyCss(css) {
  const hasKeyframes = /@keyframes/.test(css);
  const hasSelectors =
    /(^|\})\s*[.#a-zA-Z\[][^{]*\{/.test(css.replace(/@keyframes[\s\S]*?\}/g, ''));
  const hasFontFace = /@font-face/.test(css);

  if (hasKeyframes && hasSelectors) return 'E';
  if (hasKeyframes) return 'B';
  if (hasSelectors) return 'C';
  if (hasFontFace) return 'A';
  return 'E'; // odd/unknown
}

/**
 * Classify a whole file (may have multiple <style> blocks).
 * Returns { bucket, reason, cssBlocks }.
 */
function classifyFile(code) {
  const blocks = extractStyleBlocks(code);
  if (blocks.length === 0) return { bucket: 'none', reason: 'no <style>', cssBlocks: [] };

  const bucketSet = new Set();
  const parsed = [];
  for (const b of blocks) {
    const css = staticCss(b);
    if (css === null) {
      bucketSet.add('D'); // templated / dynamic
      parsed.push({ css: null, bucket: 'D' });
      continue;
    }
    const bucket = classifyCss(css);
    bucketSet.add(bucket);
    parsed.push({ css, bucket });
  }

  // Determine the file-level bucket: D (any templated) wins, then E, C, B, A.
  if (bucketSet.has('D')) return { bucket: 'D', reason: 'templated/dynamic content', cssBlocks: parsed };
  if (bucketSet.has('E')) return { bucket: 'E', reason: 'mixed selectors+keyframes', cssBlocks: parsed };
  if (bucketSet.has('C')) return { bucket: 'C', reason: 'class selectors referenced in JSX', cssBlocks: parsed };
  if (bucketSet.has('B')) return { bucket: 'B', reason: 'keyframes (scoped-name handling)', cssBlocks: parsed };
  if (bucketSet.has('A')) return { bucket: 'A', reason: 'static @font-face only', cssBlocks: parsed };
  return { bucket: 'E', reason: 'unknown', cssBlocks: parsed };
}

/**
 * Migrate a bucket-A file: strip <style> blocks, append their static @font-face
 * CSS to Clock.module.css, add `import styles from './Clock.module.css'`.
 * Returns { changed, code? }.
 */
function migrateBucketA(code, clockPath) {
  const { bucket, cssBlocks } = classifyFile(code);
  if (bucket !== 'A') return { changed: false };

  // All blocks must be static CSS (they are, since bucket A).
  const cssChunks = cssBlocks.map((b) => b.css).filter(Boolean);
  if (cssChunks.length === 0) return { changed: false };

  // Remove every <style>...</style> block from the JSX.
  let next = code.replace(/<style[\s>][\s\S]*?<\/style>\s*/g, '');

  // Ensure CSS module import exists.
  if (!/import styles from '\.\/Clock\.module\.css'/.test(next)) {
    const importRe = /^(import .*\n)+/m;
    const head = next.match(importRe);
    const importLine = `import styles from './Clock.module.css';\n`;
    if (head) {
      const insertAt = head.index + head[0].length;
      next = next.slice(0, insertAt) + importLine + next.slice(insertAt);
    } else {
      next = importLine + next;
    }
  }

  // Append the extracted CSS to Clock.module.css (create if missing).
  const cssPath = path.join(path.dirname(clockPath), 'Clock.module.css');
  const existing = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const addition = `\n/* Extracted from inline <style> by codemod */\n${cssChunks.join('\n')}\n`;
  fs.writeFileSync(cssPath, existing.endsWith('\n') ? existing + addition : existing + '\n' + addition);

  return { changed: true, code: next };
}

// ---- TRIAGE (default & explicit) ----
if (!APPLY) {
  const files = walkClockFiles(PAGES);
  const triage = {
    generated: new Date().toISOString(),
    buckets: { A: [], B: [], C: [], D: [], E: [] },
  };
for (const f of files) {
    const code = fs.readFileSync(f, 'utf8');
    if (!/<style[\s>]/.test(code)) continue;
    const rel = path.relative(ROOT, f);
    const t = classifyFile(code);
    if (!triage.buckets[t.bucket]) triage.buckets[t.bucket] = [];
    triage.buckets[t.bucket].push({ file: rel, reason: t.reason });
  }
  fs.writeFileSync(TRIAGE, JSON.stringify(triage, null, 2));
  const total = Object.values(triage.buckets).reduce((n, arr) => n + arr.length, 0);
  console.log(`Inline <style> files (total): ${total}`);
  for (const b of ['A', 'B', 'C', 'D', 'E']) {
    console.log(`  ${b}: ${triage.buckets[b].length} file(s)`);
  }
  console.log(`\nTriage report: ${TRIAGE}`);
  console.log('\nBucket A (static @font-face — safe to auto-migrate):');
  triage.buckets.A.forEach((f) => console.log(`  ${f.file}`));
  console.log(`\nBucket D (templated/dynamic — manual) — sample 10:`);
  triage.buckets.D.slice(0, 10).forEach((f) => console.log(`  ${f.file}`));
  console.log('\nTriage is read-only. Run with --apply to migrate bucket A.');
  process.exit(0);
}

// ---- APPLY (bucket A only) ----
let applied = 0;
const files = walkClockFiles(PAGES);
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  if (!/<style[\s>]/.test(code)) continue;
  const res = migrateBucketA(code, f);
  if (res.changed) {
    fs.writeFileSync(f, res.code);
    applied++;
    console.log(`  migrated ${path.relative(ROOT, f)}`);
  }
}
console.log(`\nApplied: ${applied} file(s).`);
console.log('Run: node scripts/verify-all-clocks.js --csv clocks-report.csv');
