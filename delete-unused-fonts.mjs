import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const reportPath = path.join(rootDir, 'unused-fonts-report.txt');

async function deleteUnusedFonts() {
  if (!fs.existsSync(reportPath)) {
    console.log(`Error: Font audit report not found at ${reportPath}. Please run 'node scripts/audit-fonts.mjs' first.`);
    return;
  }

  const reportContent = fs.readFileSync(reportPath, 'utf8');
  const lines = reportContent.split('\n');
  const unusedFiles = [];
  let inUnusedSection = false;

  for (const line of lines) {
    if (line.startsWith('Unused Font Files:')) {
      inUnusedSection = true;
      continue;
    }
    if (inUnusedSection && line.startsWith('- ')) {
      const relativePath = line.substring(2).trim();
      unusedFiles.push(path.join(rootDir, relativePath));
    } else if (inUnusedSection && line.trim() === '') {
      // End of unused files section or empty line after section header
      break;
    }
  }

  if (unusedFiles.length === 0) {
    console.log('No unused font files found in the report. Nothing to delete.');
    return;
  }

  console.log('The following font files are marked as unused and will be deleted:');
  unusedFiles.forEach(file => console.log(`- ${path.relative(rootDir, file)}`));
  console.log('\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question('Are you sure you want to delete these files? (yes/no): ', resolve);
  });

  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('Deletion cancelled.');
    return;
  }

  console.log('Deleting files...');
  let deletedCount = 0;
  let errorCount = 0;

  for (const file of unusedFiles) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${path.relative(rootDir, file)}`);
      deletedCount++;
    } catch (error) {
      console.error(`Error deleting ${path.relative(rootDir, file)}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\nDeletion complete. Successfully deleted ${deletedCount} files. Encountered ${errorCount} errors.`);
  if (deletedCount > 0) {
    console.log('It is recommended to run the audit script again to generate an updated report.');
  }
}

deleteUnusedFonts();