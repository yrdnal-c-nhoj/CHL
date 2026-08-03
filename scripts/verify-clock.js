#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

/**
 * BorrowedTime Standards Verifier
 *
 * Aligned with ARCHITECTURE.md §4 (Clock Component Standards).
 *
 * Standards:
 * 1. Asset Export: export const assets = [...]
 * 2. Canonical Time Hook: useSecondClock() or useMillisecondClock() from '@/utils/hooks'
 * 3. CSS Modules: Import styles from './Clock.module.css'
 * 4. Accessibility: <time> element with dateTime + visually hidden (srOnly) time text
 * 5. Performance: React.memo + displayName
 * 6. Font Loading: useSuspenseFontLoader() from '@/utils/fontLoader' (if custom fonts used)
 */

const args = process.argv.slice(2);
const isFixMode = args.includes('--fix');
const targetPath = args.find(arg => arg !== '--fix');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

if (!targetPath || !fs.existsSync(targetPath)) {
  console.error(`${colors.red}Usage: node scripts/verify-clock.js <path-to-Clock.tsx> [--fix]${colors.reset}`);
  process.exit(1);
}

try {
  const originalContent = fs.readFileSync(targetPath, 'utf8');
  let content = originalContent;

  // Detect the variable name used for the clock (standardizing on 'time')
  const hookVarMatch = content.match(/const\s+(\w+)\s*=\s*use(?:Second|Millisecond)Clock\(/);
  const tVar = hookVarMatch ? hookVarMatch[1] : 'time';

  const rules = [
    {
      id: 'asset-export',
      label: 'Standard Asset Export',
      check: (code) => /export const assets\s*=\s*\[/.test(code),
      hint: 'Expected "export const assets = [...];" for preloading.'
    },
    {
      id: 'canonical-hook',
      label: 'Canonical Time Hook',
      check: (code) => /use(?:Second|Millisecond)Clock\(\)/.test(code),
      hint: 'Use useSecondClock() (default) or useMillisecondClock() (smooth/millisecond precision) from @/utils/hooks.'
    },
    {
      id: 'css-module',
      label: 'CSS Module Integration',
      check: (code) => /import styles from '\.\/Clock\.module\.css'/.test(code),
      hint: 'Relocate inline styles to Clock.module.css.'
    },
    {
      id: 'semantic-time',
      label: 'Semantic <time> Element',
      check: (code) => /<time[^>]+dateTime=/.test(code),
      hint: 'Include a semantic <time> element with a valid dateTime attribute.'
    },
    {
      id: 'sr-only',
      label: 'Screen-Reader Accessible Time',
      check: (code) => new RegExp(`className=\\{\\s*styles\\.srOnly\\s*\\}`).test(code),
      hint: 'Wrap the time text in a visually-hidden (srOnly) container so screen readers can announce it.'
    },
    {
      id: 'memo-displayname',
      label: 'React.memo + displayName',
      check: (code) => /memo\(/.test(code) && /displayName\s*=/.test(code),
      hint: 'Wrap the component in React.memo and set displayName (e.g., Clock_YY_MM_DD).'
    },
    {
      id: 'font-loader',
      label: 'Canonical Font Loader',
      check: (code) => /useSuspenseFontLoader/.test(code) || !/@\/assets\/fonts/.test(code),
      hint: 'Load custom fonts with useSuspenseFontLoader from @/utils/fontLoader.'
    }
  ];

  if (isFixMode) {
    let modified = content;
    rules.forEach(rule => { if (rule.fix) modified = rule.fix(modified); });
    if (modified !== originalContent) {
      fs.writeFileSync(targetPath, modified);
      content = modified;
      console.log(`${colors.green}✅ Applied fixes to ${path.basename(targetPath)}${colors.reset}`);
    }
  }

  console.log(`\n${colors.cyan}Verifying: ${targetPath}${colors.reset}\n`);

  let failures = 0;
  rules.forEach(rule => {
    if (rule.check(content)) {
      console.log(`  ${colors.green}✅${colors.reset} ${rule.label}`);
    } else {
      console.log(`  ${colors.red}❌${colors.reset} ${rule.label}`);
      console.log(`     ${colors.yellow}└─ ${rule.hint}${colors.reset}`);
      failures++;
    }
  });

  if (failures === 0) {
    console.log(`\n${colors.green}✨ World-class quality standards met.${colors.reset}\n`);
  } else {
    console.log(`\n${colors.yellow}⚠️  ${failures} violation(s) found.${colors.reset}`);
    if (!isFixMode) {
      console.log(`   Run with ${colors.cyan}--fix${colors.reset} to resolve automatically.`);
    }
    process.exit(1);
  }
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}

