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
    } else if (extensions.some(ext => fullPath.toLowerCase().endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.svg'];
const codeExtensions = ['.tsx', '.jsx', '.ts', '.js', '.css', '.scss'];

const allImages = getFiles(path.join(rootDir, 'src/assets/images'), imageExtensions)
  .map(f => path.resolve(f));
  
// Scan all of src to catch images used in templates, shared components, or context
const allSourceFiles = getFiles(path.join(rootDir, 'src'), codeExtensions);

const usedImages = new Set();

// Broad regex to find any string ending in an image extension
const imageImportRegex = /['"]([^'"]+\.(?:webp|jpg|jpeg|png|gif|mp4|svg)(?:\?[^'"]*)?)['"]/gi;

allSourceFiles.forEach(sourcePath => {
  const content = fs.readFileSync(sourcePath, 'utf8');
  let match;

  while ((match = imageImportRegex.exec(content)) !== null) {
    let importPath = match[1].split('?')[0]; // Remove Vite query params

    let absolutePath;
    if (importPath.startsWith('@/')) {
      absolutePath = path.resolve(rootDir, importPath.replace('@/', 'src/'));
    } else if (importPath.startsWith('src/')) {
      absolutePath = path.resolve(rootDir, importPath);
    } else {
      absolutePath = path.resolve(path.dirname(sourcePath), importPath);
    }

    // Only add to set if it actually points to a file that exists in our images folder
    if (allImages.includes(absolutePath)) {
      usedImages.add(absolutePath);
    }
  }
});

const unusedImages = allImages.filter(img => !usedImages.has(img));

const reportPath = path.join(rootDir, 'unused-images-report.txt');
let report = '--- Image Audit Report ---\n';
report += `Generated on: ${new Date().toLocaleString()}\n`;
report += `Total images found: ${allImages.length}\n`;
report += `Used images: ${usedImages.size}\n`;
report += `Unused images: ${unusedImages.length}\n\n`;

// Calculate storage size
let totalSize = 0;
let unusedSize = 0;

allImages.forEach(img => {
  const stats = fs.statSync(img);
  totalSize += stats.size;
});

unusedImages.forEach(img => {
  const stats = fs.statSync(img);
  unusedSize += stats.size;
  report += `- ${path.relative(rootDir, img)} (${(stats.size / 1024).toFixed(1)} KB)\n`;
});

report += `\n\nTotal image storage: ${(totalSize / (1024 * 1024)).toFixed(2)} MB\n`;
report += `Unused image storage: ${(unusedSize / (1024 * 1024)).toFixed(2)} MB\n`;
report += `Potential savings: ${((unusedSize / totalSize) * 100).toFixed(1)}%\n`;

console.log(report);
fs.writeFileSync(reportPath, report);
console.log(`\nReport saved to: ${reportPath}`);

if (allImages.length === 0) {
  console.warn('Warning: No images found in src/assets/images. Check your path.');
}
