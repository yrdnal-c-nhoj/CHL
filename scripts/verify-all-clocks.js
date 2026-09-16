#!/usr/bin/env node

/**
 * Verify clock pages against docs/CLOCK_CONTRACT.md.
 *
 * Full-fleet verification reports legacy debt. Use --changed in CI to fail
 * only when a changed clock introduces contract violations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const METADATA_FILES = [
  path.join(ROOT, 'src', 'context', 'clockpages.json'),
  path.join(ROOT, 'src', 'context', 'testclocks.json'),
];
const DATE_PATTERN = /^\d{2}-\d{2}-\d{2}$/;

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
  const revisions = baseRef
    ? [`origin/${baseRef}...HEAD`]
    : ['HEAD^'];

  for (const revision of revisions) {
    try {
      return execFileSync(
        'git',
        ['diff', '--name-only', '--diff-filter=ACMRTUXB', revision, '--', 'src/pages'],
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
  return relativePath.split(path.sep).find((part) => DATE_PATTERN.test(part)) ?? null;
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

  if (!fs.existsSync(cssPath)) errors.push('missing Clock.module.css');
  if (!/export\s+default\s+\w+\s*;/.test(source)) {
    errors.push('missing default component export');
  }
  if (!/displayName\s*=\s*['"][^'"]*_\d{2}_\d{2}_\d{2}['"]/.test(source)) {
    errors.push('displayName must end with _YY_MM_DD');
  }
  if (!/import\s*\{\s*(?:useClock|useSmoothClock)\s*\}\s*from\s*['"]@\/utils\/hooks['"]/.test(source)) {
    errors.push('must import useClock or useSmoothClock from @/utils/hooks');
  }
  if (!/export\s+const\s+assets(?:\s*:\s*[^=]+)?\s*=\s*\[/.test(source)) {
    errors.push('must export an assets array');
  }
  if (!/<time\b[^>]*\bdateTime\s*=/.test(source) && !/\bSRTime\b/.test(source)) {
    errors.push('must render a semantic <time> with dateTime');
  }
  if (/setInterval\s*\(|setTimeout\s*\(|requestAnimationFrame\s*\(/.test(source)) {
    errors.push('must not use direct timer or requestAnimationFrame loops');
  }
  if (/<style(?:\s|>)/.test(source)) errors.push('must not use inline style tags');
  if (/\bany\b/.test(source)) errors.push('must not use the any type');
  if (/useClockTime|useSecondClock|useMillisecondClock/.test(source)) {
    errors.push('must not use deprecated clock hooks');
  }
  if (!metadataContainsDate(date)) {
    errors.push('date must be registered in both clock metadata files');
  }

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
      .filter(Boolean);
    return [...new Set(changedDates)].map((date) =>
      clockPathForDate(date),
    );
  }

  return findClockFiles(PAGES_DIR);
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
    return;
  }

  const files = selectFiles(options).filter((filePath) => fs.existsSync(filePath));
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
    fail(`${failures.length} of ${results.length} clock page(s) violate the contract`);
  } else if (!options.quiet) {
    console.log(`Verified ${results.length} clock page(s).`);
  }
}

main();
