import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const full = join(dir, file);
    const s = statSync(full);
    if (s.isDirectory()) {
      results = results.concat(walk(full));
    } else if (extname(file) === '.tsx' || extname(file) === '.ts') {
      results.push(full);
    }
  }
  return results;
}

const files = walk(SRC_DIR);
let fixed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // 1. Replace imports from '@/utils/enhancedFontLoader' with deprecated names
  //    - useGlobalStyles, useKeyframes, useEnhancedFontLoader, useFontLoader, useMultipleFontLoader
  //    These should be removed entirely (use CSS Modules / useSuspenseFontLoader instead)
  content = content.replace(
    /import\s+\{\s*useGlobalStyles[^}]*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useKeyframes[^}]*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useEnhancedFontLoader[^}]*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useFontLoader[^}]*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useMultipleFontLoader[^}]*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    ''
  );

  // 2. Replace canonical imports from '@/utils/enhancedFontLoader' → '@/utils/fontLoader'
  content = content.replace(
    /import\s+\{\s*(useSuspenseFontLoader|ClockLoadingFallback)(?:\s*,\s*(useSuspenseFontLoader|ClockLoadingFallback))*\s*\}\s+from\s+['"]@\/utils\/enhancedFontLoader['"];?/g,
    "import { useSuspenseFontLoader, ClockLoadingFallback } from '@/utils/fontLoader';"
  );

  // 3. Replace deprecated imports from '@/utils/assetLoader'
  content = content.replace(
    /import\s+\{\s*useFontLoader[^}]*\}\s+from\s+['"]@\/utils\/assetLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useMultiFontLoader[^}]*\}\s+from\s+['"]@\/utils\/assetLoader['"];?/g,
    ''
  );
  content = content.replace(
    /import\s+\{\s*useMultipleFontLoader[^}]*\}\s+from\s+['"]@\/utils\/assetLoader['"];?/g,
    ''
  );

  // Clean up double blank lines left by removed imports
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    writeFileSync(file, content);
    fixed++;
  }
}

console.log(`Fixed ${fixed} files.`);
process.exit(0);
