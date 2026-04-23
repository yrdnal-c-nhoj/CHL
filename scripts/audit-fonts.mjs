import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Recursively finds files in a directory matching specific extensions
 */
function getFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions));
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const fontExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
const codeExtensions = ['.tsx', '.jsx', '.ts', '.js', '.css', '.scss'];

const allFonts = getFiles(path.join(rootDir, 'src/assets/fonts'), fontExtensions)
  .map(f => path.resolve(f));
// Scan all of src to catch fonts used in templates, shared components, or context
const allSourceFiles = getFiles(path.join(rootDir, 'src'), codeExtensions);

const usedFonts = new Set();

// Broad regex to find any string ending in a font extension, catching imports and CSS urls
// Handles: '@/assets/...', './fonts/...', and Vite '?url' suffixes
const fontImportRegex = /['"]([^'"]+\.(?:ttf|otf|woff2?)(?:\?[^'"]*)?)['"]/g;

allSourceFiles.forEach(clockPath => {
  const content = fs.readFileSync(clockPath, 'utf8');
  let match;

  while ((match = fontImportRegex.exec(content)) !== null) {
    let importPath = match[1].split('?')[0]; // Remove Vite query params like ?url

    let absolutePath;
    if (importPath.startsWith('@/')) {
      absolutePath = path.resolve(rootDir, importPath.replace('@/', 'src/'));
    } else {
      absolutePath = path.resolve(path.dirname(clockPath), importPath);
    }

    // Only add to set if it actually points to a file that exists in our fonts folder
    if (allFonts.includes(absolutePath)) {
      usedFonts.add(absolutePath);
    }
  }
});

const unusedFonts = allFonts.filter(font => !usedFonts.has(font));

const reportPath = path.join(rootDir, 'unused-fonts-report.txt');
let report = '--- Font Audit Report ---\n';
report += `Generated on: ${new Date().toLocaleString()}\n`;
report += `Total fonts found: ${allFonts.length}\n`;
report += `Used fonts: ${usedFonts.size}\n`;
report += `Unused fonts: ${unusedFonts.length}\n\n`;

if (unusedFonts.length > 0) {
  report += 'Unused Font Files:\n';
  unusedFonts.forEach(font => {
    report += `- ${path.relative(rootDir, font)}\n`;
  });
} else {
  report += 'Amazing! All fonts are currently in use.\n';
}

console.log(report);
fs.writeFileSync(reportPath, report);
console.log(`Report saved to: ${reportPath}`);

if (allFonts.length === 0) {
  console.warn('Warning: No fonts found in src/assets/fonts. Check your path.');
}