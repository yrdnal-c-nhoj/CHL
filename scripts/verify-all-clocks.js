#!/usr/bin/env node

/**
 * BorrowedTime Batch Standards Verifier
 *
 * Runs the ARCHITECTURE.md §4 standards (same rules as scripts/verify-clock.js)
 * across every Clock component in src/pages and emits a comprehensive,
 * sorted report showing which clocks need migration work and why.
 *
 * Usage:
 *   node scripts/verify-all-clocks.js                # full report (console)
 *   node scripts/verify-all-clocks.js --csv report.csv
 *   node scripts/verify-all-clocks.js --min 1        # only clocks with ≥1 violation
 *   node scripts/verify-all-clocks.js --limit 20     # top 20 worst offenders
 *   node scripts/verify-all-clocks.js --quiet        # summary only, no per-file lines
 *   node scripts/verify-all-clocks.js --no-color     # plain text output
 *
 * Exit codes:
 *   0 – no violations (all clocks meet standards)
 *   1 – at least one violation found
 *   2 – usage / fatal error
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

// ---------------------------------------------------------------------------
// Standards rules — identical to scripts/verify-clock.js
// ---------------------------------------------------------------------------

const RULES = [
  {
    id: 'asset-export',
    label: 'Standard Asset Export',
    check: (code) => /export const assets\s*=\s*\[/.test(code),
    hint: 'Expected "export const assets = [...];" for preloading pipeline.',
  },
  {
    id: 'canonical-hook',
    label: 'Canonical Time Hook',
    check: (code) => /use(?:Second|Millisecond)Clock\(\)/.test(code),
    hint: 'Use useSecondClock() (default) or useMillisecondClock() from @/utils/hooks.',
  },
  {
    id: 'css-module',
    label: 'CSS Module Integration',
    check: (code) => /import styles from '\.\/Clock\.module\.css'/.test(code),
    hint: 'Relocate inline styles to Clock.module.css.',
  },
  {
    id: 'semantic-time',
    label: 'Semantic <time> Element',
    check: (code) => /<time[^>]+dateTime=/.test(code),
    hint: 'Include a semantic <time> element with a valid dateTime attribute.',
  },
  {
    id: 'sr-only',
    label: 'Screen-Reader Accessible Time',
    check: (code) =>
      new RegExp(`className=\\{\\s*styles\\.srOnly\\s*\\}`).test(code),
    hint: 'Wrap the time text in a visually-hidden (srOnly) container.',
  },
  {
    id: 'memo-displayname',
    label: 'React.memo + displayName',
    check: (code) => /memo\(/.test(code) && /displayName\s*=/.test(code),
    hint: 'Wrap the component in React.memo and set displayName (e.g., Clock_YY_MM_DD).',
  },
  {
    id: 'font-loader',
    label: 'Canonical Font Loader',
    check: (code) =>
      /useSuspenseFontLoader/.test(code) || !/@\/assets\/fonts/.test(code),
    hint: 'Load custom fonts with useSuspenseFontLoader from @/utils/fontLoader.',
  },
];

// Additional "legacy / prohibited pattern" detectors grouped by severity.
const PROHIBITED = [
  {
    id: 'set-interval',
    label: 'Prohibited setInterval',
    severity: 'critical',
    check: (code) => /setInterval/.test(code),
    hint: 'Replace setInterval with useSecondClock()/useMillisecondClock().',
  },
  {
    id: 'inline-style',
    label: 'Inline <style> tag',
    severity: 'critical',
    check: (code) => /<style[\s>]/.test(code),
    hint: 'Replace inline <style> blocks with CSS Modules.',
  },
  {
    id: 'enhanced-font-loader',
    label: 'Deprecated enhancedFontLoader',
    severity: 'major',
    check: (code) => /enhancedFontLoader/.test(code),
    hint: 'Replace enhancedFontLoader with useSuspenseFontLoader from @/utils/fontLoader.',
  },
  {
    id: 'deprecated-clock-utils',
    label: 'Deprecated useClockTime/assetLoader fonts',
    severity: 'major',
    check: (code) =>
      /useClockTime/.test(code) ||
      /useFontLoader/.test(code) ||
      /useMultiFontLoader/.test(code),
    hint: 'Import time hooks from @/utils/hooks and fonts from @/utils/fontLoader.',
  },
  {
    id: 'root-not-main',
    label: 'Root element is <div> not <main>',
    severity: 'minor',
    check: (code) => /\s*<div\s+className=\{?styles\.container/.test(code),
    hint: 'Use semantic <main> as the root landmark element.',
  },
  {
    id: 'no-assets',
    label: 'Missing export const assets',
    severity: 'major',
    check: (code) => !/export const assets\s*=\s*\[/.test(code),
    hint: 'Export an assets array for the preloading pipeline.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const color = (code, useColor) => (useColor ? COLORS[code] ?? '' : '');
const paint = (text, code, useColor) =>
  `${color(code, useColor)}${text}${useColor ? '\x1b[0m' : ''}`;

function parseArgs(argv) {
  const opts = {
    csv: null,
    min: 0,
    limit: Infinity,
    quiet: false,
    color: true,
    sortBy: 'violations',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--csv' || arg === '--output') opts.csv = argv[++i] || 'clocks-report.csv';
    else if (arg === '--min') opts.min = Number.parseInt(argv[++i], 10) || 0;
    else if (arg === '--limit') opts.limit = Number.parseInt(argv[++i], 10) || Infinity;
    else if (arg === '--quiet') opts.quiet = true;
    else if (arg === '--no-color') opts.color = false;
    else if (arg === '--sort-by-violations') opts.sortBy = 'violations';
    else if (arg === '--sort-by-date') opts.sortBy = 'date';
    else if (arg === '--help') opts.help = true;
  }
  return opts;
}

function extractDate(relPath) {
  // Paths look like: 2026/26-07/26-07-30/Clock.tsx
  const match = relPath.match(/\b(\d{2}-\d{2}-\d{2})\b/);
  return match ? match[1] : relPath;
}

function walkClockPages(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkClockPages(full, results);
    } else if (entry.isFile() && entry.name === 'Clock.tsx') {
      results.push(full);
    }
  }
  return results;
}

function fileHasCssModule(clockFile) {
  return fs.existsSync(path.join(path.dirname(clockFile), 'Clock.module.css'));
}

function verifyFile(clockPath) {
  const code = fs.readFileSync(clockPath, 'utf8');
  const relPath = path.relative(ROOT, clockPath);
  const date = extractDate(relPath);

  const violations = RULES.filter((r) => !r.check(code)).map((r) => ({
    rule: r.id,
    label: r.label,
    hint: r.hint,
    severity: 'required',
  }));

  PROHIBITED.forEach((p) => {
    if (p.check(code)) {
      violations.push({ rule: p.id, label: p.label, hint: p.hint, severity: p.severity });
    }
  });

  return {
    path: clockPath,
    relPath,
    date,
    cssModule: fileHasCssModule(clockPath),
    violations,
    count: violations.length,
  };
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------

function renderReport(results, opts) {
  const useColor = opts.color;
  const filtered = results
    .filter((r) => r.count >= opts.min)
    .sort((a, b) => {
      if (opts.sortBy === 'date') return a.date.localeCompare(b.date);
      return b.count - a.count || a.date.localeCompare(b.date);
    })
    .slice(0, opts.limit);

  const total = results.length;
  const compliant = results.filter((r) => r.count === 0).length;
  const needsWork = total - compliant;
  const totalViolations = results.reduce((sum, r) => sum + r.count, 0);
  const critical = results.filter((r) =>
    r.violations.some((v) => v.severity === 'critical'),
  ).length;

  const line = (t) => console.log(t);

  line('');
  line(
    `${paint('BorrowedTime — Batch Clock Standards Report', 'bold', useColor)}`,
  );
  line('='.repeat(60));

  // Summary
  line(`  ${paint('Total clock components:', 'cyan', useColor)}  ${total}`);
  line(
    `  ${paint('Fully compliant:', 'green', useColor)}        ${compliant}${useColor ? '\x1b[0m' : ''}`,
  );
  line(
    `  ${paint('Need work:', 'yellow', useColor)}             ${needsWork}`,
  );
  line(
    `  ${paint('Critical violations:', useColor ? 'red' : '', useColor)}  ${critical}`,
  );
  line(
    `  ${paint('Total violations:', useColor ? 'red' : '', useColor)}   ${totalViolations}`,
  );
  line('='.repeat(60));

  if (filtered.length === 0) {
    line(`${paint('  ✨ All clocks meet ARCHITECTURE.md standards!', 'green', useColor)}`);
    return results;
  }

  if (!opts.quiet) {
    line('');
    for (const r of filtered) {
      const marker = r.count === 0 ? '✅' : r.count > 3 ? '❌' : '⚠️';
      const colorCode = r.count === 0 ? 'green' : r.count > 3 ? 'red' : 'yellow';
      line(
        `  ${marker} ${paint(r.date, 'cyan', useColor)}  ${paint(r.relPath, 'dim', useColor)}  ${paint(`[${r.count} violation${r.count === 1 ? '' : 's'}]`, colorCode, useColor)}`,
      );

      if (opts.min > 0 || r.count > 0) {
        for (const v of r.violations) {
          const sevColor =
            v.severity === 'critical'
              ? 'red'
              : v.severity === 'major'
                ? 'yellow'
                : 'dim';
          line(
            `      ${paint('•', sevColor, useColor)} ${paint(v.label, sevColor, useColor)}`,
          );
        }
      }
    }
    line('');
  }

  line(
    `${paint('Compliance rate:', 'cyan', useColor)} ${Math.round((compliant / total) * 100)}%`,
  );
  line(
    `${paint('Next action:', 'cyan', useColor)} migrate critical violations (setInterval / <style> tags) first.`,
  );
  line('');

  return results;
}

function writeCsv(results, filePath) {
  const rows = results.map((r) => {
    const ruleCsv = RULES.map((rule) => (rule.check(fs.readFileSync(r.path, 'utf8')) ? '1' : '0')).join(
      ',',
    );
    const prohibitedCsv = PROHIBITED.map((p) =>
      p.check(fs.readFileSync(r.path, 'utf8')) ? '1' : '0',
    ).join(',');

    return [
      r.date,
      r.relPath,
      r.count,
      ruleCsv,
      prohibitedCsv,
      r.cssModule ? '1' : '0',
    ].join(',');
  });

  const header = [
    'date',
    'path',
    'violations',
    ...RULES.map((r) => `rule:${r.id}`),
    ...PROHIBITED.map((p) => `prohib:${p.id}`),
    'has_css_module',
  ].join(',');

  fs.writeFileSync(filePath, `${header}\n${rows.join('\n')}\n`, 'utf8');
  console.log(`${paint('📄 CSV report written to:', 'cyan', Boolean(true))} ${filePath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(`
  BorrowedTime Batch Standards Verifier

  Usage:
    node scripts/verify-all-clocks.js [options]

  Options:
    --csv <file>          Write a CSV report (default: clocks-report.csv)
    --min <n>             Only show clocks with ≥ n violations
    --limit <n>           Show only the top n worst offenders
    --quiet               Summary only, omit per-file detail lines
    --no-color            Plain text (no ANSI colors)
    --sort-by-date        Sort report by clock date instead of violation count
    --help                Show this help
`);
    process.exit(0);
  }

  const clockFiles = walkClockPages(PAGES_DIR);
  if (clockFiles.length === 0) {
    console.error('No Clock.tsx files found under src/pages.');
    process.exit(2);
  }

  const results = clockFiles.map(verifyFile);
  renderReport(results, opts);

  if (opts.csv) {
    writeCsv(results, path.resolve(ROOT, opts.csv));
  }

  const anyViolations = results.some((r) => r.count > 0);
  process.exit(anyViolations ? 1 : 0);
}

main();

