#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

/**
 * BorrowedTime Tactical Standards Verifier & Auto-Fixer
 * 
 * Tactical Standards:
 * 1. Asset Export: export const assets = [...]
 * 2. Precision Hook: useMillisecondClock()
 * 3. CSS Modules: Import styles from './Clock.module.css'
 * 4. Accessibility: <time> with aria-label and srOnly span
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
  const hookVarMatch = content.match(/const\s+(\w+)\s*=\s*useMillisecondClock\(\)/);
  const tVar = hookVarMatch ? hookVarMatch[1] : 'time';

  const rules = [
    {
      id: 'asset-export',
      label: 'Standard Asset Export',
      check: (code) => /export const assets\s*=\s*\[/.test(code),
      hint: 'Expected "export const assets = [...];" for preloading.'
    },
    {
      id: 'precision-hook',
      label: 'Precision Clock Hook',
      check: (code) => /useMillisecondClock\(\)/.test(code),
      hint: 'Use useMillisecondClock() for millisecond-level precision.'
    },
    {
      id: 'css-module',
      label: 'CSS Module Integration',
      check: (code) => /import styles from '\.\/Clock\.module\.css'/.test(code),
      hint: 'Relocate inline styles to Clock.module.css.'
    },
    {
      id: 'aria-label',
      label: 'Accessible Time Element',
      check: (code) => new RegExp(`<time[^>]+aria-label=\\{${tVar}\\.toLocaleTimeString\\(`).test(code),
      fix: (code) => code.replace(/<time([^>]*?)>/s, `<time$1 aria-label={${tVar}.toLocaleTimeString()}>`),
      hint: `The <time> tag needs an aria-label.`
    },
    {
      id: 'sr-only',
      label: 'SR-Only Timestamp',
      check: (code) => new RegExp(`className=\\{styles\\.srOnly\\}.*\\{${tVar}\\.toLocaleTimeString\\(`).test(code),
      fix: (code) => code.replace(/(<time[^>]*?>)/s, `$1\n      <span className={styles.srOnly}>{${tVar}.toLocaleTimeString()}</span>`),
      hint: `Include a visually hidden span for screen readers.`
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
      console.log(`   Run with ${colors.cyan}--fix${colors.reset} to resolve automatically.\n`);
    }
    process.exit(1);
  }
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}