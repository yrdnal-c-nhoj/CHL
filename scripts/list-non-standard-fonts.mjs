import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import chalk from 'chalk';

/**
 * Identifies fonts in the assets folder that do not follow 
 * the YY-MM-DD-filename.ext naming convention.
 */
async function listNonStandardFonts() {
  console.log(chalk.blue('🔍 Auditing font filenames for BTS compliance...\n'));

  // Get all font files in the assets directory
  const fonts = await globby('src/assets/fonts/**/*.{ttf,otf,woff,woff2}');
  const nonStandard = [];

  const datePrefixRegex = /^\d{2}-\d{2}-\d{2}-/;

  fonts.forEach(fontPath => {
    const fileName = path.basename(fontPath);
    if (!datePrefixRegex.test(fileName)) {
      nonStandard.push(fontPath);
    }
  });

  if (nonStandard.length === 0) {
    console.log(chalk.green('✅ All fonts in the assets folder are correctly dated!'));
  } else {
    const reportPath = path.join(process.cwd(), 'non-standard-fonts.txt');
    const reportContent = nonStandard.join('\n');
    fs.writeFileSync(reportPath, reportContent);

    console.log(chalk.yellow(`🚩 Found ${nonStandard.length} fonts missing date prefixes. List saved to: ${chalk.white(reportPath)}`));
    nonStandard.forEach(file => console.log(chalk.red(`  • ${file}`)));
    console.log(chalk.cyan('\nRun "npm run standardize:fonts" to automatically prefix these based on their Clock.tsx usage.'));
  }
}

listNonStandardFonts().catch(console.error);