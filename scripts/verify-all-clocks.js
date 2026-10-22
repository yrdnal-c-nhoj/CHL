#!/usr/bin/env node

/**
 * Verify clock pages against docs/CLOCKS.md.
 *
 * What is checked:
 *   - Every clock (current and historical) must "work": it has a default
 *     export, imports useClock/useSmoothClock, and does not use private timer
 *     loops (setInterval/setTimeout, requestAnimationFrame-as-clock) or
 *     deprecated hooks. These apply to current AND historical clocks alike.
 *   - Current clocks (September 2026 onward) must additionally meet the full
 *     technical standards: Clock.module.css present, displayName, semantic
 *     <time>/SRTime, no `any`, no inline <style> tags, etc.
 *   - Historical clocks (before September 2026) are preserved as they are;
 *     they need only satisfy the functional requirements above.
 *
 * Exit-code policy:
 *   - Full-fleet audit (no --changed, no --path) reports legacy debt but
 *     always exits 0, so historical violations do not block CI.
 *   - --changed (or --path) is strict: exits non-zero when a checked clock
 *     violates the applicable contract. CI uses this on changed pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hasIndependentClockTiming } from './clock-verifier-rules.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const METADATA_FILES = [
  path.join(ROOT, 'src', 'context', 'clockpages.json'),
  path.join(ROOT, 'src', 'context', 'testclocks.json'),
];
const DATE_PATTERN = /^\d{2}-\d{2}-\d{2}$/;

// September 2026 is the current architectural boundary.
// Clocks from 26-09-XX through today follow the current contract.
// Future-dated clocks are exempt unless explicitly checked with --path.
const CURRENT_BOUNDARY = '26-09';

function todayClockDate() {
  const today = new Date();
  return `${String(today.getFullYear()).slice(-2)}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function isFutureClockDate(date) {
  return (
    Number(date.replace(/-/g, '')) > Number(todayClockDate().replace(/-/g, ''))
  );
}

function isCurrentClock(date) {
  return date >= CURRENT_BOUNDARY && !isFutureClockDate(date);
}

const fail = (message) => {
  console.error(`Clock verification failed: ${message}`);
  process.exitCode = 1;
};

function parseArgs(argv) {
  const options = { changed: false, paths: [], quiet: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--changed') options.changed = true;
    else if (argument === '--quiet') options.quiet = true;
    else if (argument === '--path') {
      const value = argv[index + 1];
      if (!value) throw new Error('--path requires a file or date');
      options.paths.push(value);
      index += 1;
    } else if (argument === '--help') {
      console.log(
        'Usage: node scripts/verify-all-clocks.js [--changed] [--path <date|file>] [--quiet]',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return options;
}

function getChangedFiles() {
  const baseRef = process.env.GITHUB_BASE_REF;
  const revisions = baseRef ? [`origin/${baseRef}...HEAD`] : ['HEAD^'];

  for (const revision of revisions) {
    try {
      return execFileSync(
        'git',
        [
          'diff',
          '--name-only',
          '--diff-filter=ACMRTUXB',
          revision,
          '--',
          'src/pages',
        ],
        { cwd: ROOT, encoding: 'utf8' },
      )
        .split('\n')
        .filter(Boolean);
    } catch {
      // A shallow checkout may not contain the preferred comparison ref.
    }
  }

  return [];
}

function findClockFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) findClockFiles(fullPath, files);
    else if (entry.isFile() && entry.name === 'Clock.tsx') files.push(fullPath);
  }
  return files;
}

function dateFromPath(filePath) {
  const relativePath = path.relative(PAGES_DIR, filePath);
  return (
    relativePath.split(path.sep).find((part) => DATE_PATTERN.test(part)) ?? null
  );
}

function clockPathForDate(date) {
  const [year, month] = date.split('-');
  return path.join(
    PAGES_DIR,
    `20${year}`,
    `${year}-${month}`,
    date,
    'Clock.tsx',
  );
}

function metadataContainsDate(date) {
  return METADATA_FILES.every((filePath) => {
    if (!fs.existsSync(filePath)) return false;
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return entries.some((entry) => entry.path === date && entry.date === date);
  });
}

function verifyClock(filePath) {
  const date = dateFromPath(filePath);
  const relativePath = path.relative(ROOT, filePath);
  const errors = [];

  if (!date) errors.push('clock directory must use the YY-MM-DD format');
  const source = fs.readFileSync(filePath, 'utf8');
  const cssPath = path.join(path.dirname(filePath), 'Clock.module.css');

  const current = isCurrentClock(date);

  // --- Requirements shared by every clock: the clock must "work" ---
  // A clock is functional only if it can be loaded and draws its displayed time
  // from the shared clock infrastructure (useClock/useSmoothClock) rather than a
  // private timer. These apply to current AND historical clocks alike.
  if (!/export\s+default\s+\w+\s*;/.test(source)) {
    errors.push('missing default component export');
  }
  if (
    !/import\s*\{\s*[^}]*\b(?:useClock|useSmoothClock)\b[^}]*\}\s*from\s*['"]@\/utils\/hooks['"]/.test(
      source,
    )
  ) {
    errors.push('must import useClock or useSmoothClock from @/utils/hooks');
  }
  // Rendering loops are allowed for frames only: animation systems may use
  // requestAnimationFrame, but never to compute displayed clock time.
  if (/setInterval\s*\(|setTimeout\s*\(/.test(source)) {
    errors.push(
      'must not use direct timer loops for clock timekeeping or animation scheduling',
    );
  }
  if (hasIndependentClockTiming(source)) {
    errors.push(
      'must not use requestAnimationFrame as an independent clock time source; use useClock or useSmoothClock',
    );
  }
  if (/useClockTime|useSecondClock|useMillisecondClock/.test(source)) {
    errors.push('must not use deprecated clock hooks');
  }

  // --- Technical standards apply only to current clocks (Sept 2026+) ---
  // Historical clocks are preserved as they are; they need only satisfy the
  // functional requirements above. See docs/STANDARDS.md (S2).
  if (current) {
    if (!fs.existsSync(cssPath)) errors.push('missing Clock.module.css');
    if (!/displayName\s*=\s*['"][^'"]*_\d{2}_\d{2}_\d{2}['"]/.test(source)) {
      errors.push('displayName must end with _YY_MM_DD');
    }
    if (
      !/<time\b[^>]*\bdateTime\s*=/.test(source) &&
      !/\bSRTime\b/.test(source)
    ) {
      errors.push('must render a semantic <time> with dateTime');
    }
    if (!/\bSRTime\b/.test(source)) {
      errors.push('current clocks must use SRTime component for semantic time');
    }
    if (/styles\.srOnly/.test(source)) {
      errors.push(
        'current clocks must not use styles.srOnly directly; use SRTime instead',
      );
    }
    if (/<style(?:\s|>)/.test(source))
      errors.push('must not use inline style tags');
    if (/\bany\b/.test(source)) errors.push('must not use the any type');
  } else {
    // Historical clocks: if using styles.srOnly, the CSS module must define it.
    if (/styles\.srOnly/.test(source) && fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      if (!/\.srOnly\s*\{/.test(cssContent)) {
        errors.push(
          'Clock.module.css must define .srOnly when using styles.srOnly',
        );
      }
    }
  }
  // Clock metadata registration is handled separately.
  // Clocks need not be in clockpages.json/testclocks.json to pass verification.

  return { relativePath, date, errors };
}

function selectFiles(options) {
  if (options.paths.length > 0) {
    return options.paths
      .map((value) =>
        DATE_PATTERN.test(value)
          ? clockPathForDate(value)
          : path.resolve(ROOT, value),
      )
      .filter((filePath, index, files) => files.indexOf(filePath) === index);
  }

  if (options.changed) {
    const changedDates = getChangedFiles()
      .map((filePath) => path.resolve(ROOT, filePath))
      .map((filePath) => dateFromPath(filePath))
      .filter(Boolean)
      .filter((date) => !isFutureClockDate(date));
    return [...new Set(changedDates)].map((date) => clockPathForDate(date));
  }

  return findClockFiles(PAGES_DIR).filter((filePath) => {
    const date = dateFromPath(filePath);
    return date ? !isFutureClockDate(date) : true;
  });
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
    return;
  }

  const files = selectFiles(options).filter((filePath) =>
    fs.existsSync(filePath),
  );
  if (files.length === 0) {
    if (options.changed) {
      if (!options.quiet) console.log('No changed clock pages to verify.');
      return;
    }
    fail('no Clock.tsx files found');
    return;
  }

  const results = files.map(verifyClock);
  const failures = results.filter((result) => result.errors.length > 0);

  if (!options.quiet) {
    for (const result of results) {
      const status = result.errors.length === 0 ? 'PASS' : 'FAIL';
      console.log(`${status} ${result.relativePath}`);
      for (const error of result.errors) console.log(`  - ${error}`);
    }
  }

  if (failures.length > 0) {
    if (options.changed || options.paths.length > 0) {
      fail(
        `${failures.length} of ${results.length} clock page(s) violate the contract`,
      );
    } else if (!options.quiet) {
      console.log(
        `\nFull audit: ${failures.length} of ${results.length} clock page(s) violate the current contract.`,
      );
      console.log(
        'These are legacy debt from historical clocks; full audit does not fail CI.',
      );
      console.log(
        'To enforce the contract on new or changed clocks, use `npm run verify:clocks:changed`.',
      );
    }
  } else if (!options.quiet) {
    console.log(`Verified ${results.length} clock page(s).`);
  }
}

main();
