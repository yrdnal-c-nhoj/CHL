#!/usr/bin/env node

/**
 * Test version of module cleanup script - processes a single module
 * Use this to test the cleanup before running on all modules
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Test on a specific module - change this to test different modules
const TEST_MODULE = 'src/pages/2025/25-04/25-04-01/Clock.tsx';

// Simplified BTS standards for testing
const BTS_STANDARDS = {
  forbidden: [
    'document.querySelector',
    'document.getElementById',
    'setInterval(',
    'setTimeout(',
    'any',
    '@ts-ignore',
    'console.log',
    'console.warn',
    'console.error'
  ],
  
  required: [
    'useSuspenseFontLoader',
    'fontConfigs'
  ],
  
  maxLinesPerFunction: 50
};

class TestCleanup {
  async run() {
    console.log('🧪 Testing CHL Module Cleanup on single module...\n');
    
    const modulePath = path.join(PROJECT_ROOT, TEST_MODULE);
    
    try {
      // Check if module exists
      await fs.access(modulePath);
      
      console.log(`🔧 Testing on: ${TEST_MODULE}`);
      
      // Read original content
      const originalContent = await fs.readFile(modulePath, 'utf-8');
      console.log(`📄 Original file size: ${originalContent.split('\n').length} lines`);
      
      // Apply cleanup
      const cleanedContent = this.cleanupModule(originalContent);
      
      // Show what would change
      if (cleanedContent !== originalContent) {
        console.log('🔄 Changes detected:');
        this.showChanges(originalContent, cleanedContent);
        
        // Ask if user wants to apply changes
        console.log('\n❓ Apply these changes? (Run the full script to apply)');
        console.log('💡 To apply: npm run cleanup:modules');
        
        // Write to a test file to preview
        const testOutputPath = modulePath.replace('.tsx', '.test.tsx');
        await fs.writeFile(testOutputPath, cleanedContent, 'utf-8');
        console.log(`📝 Preview written to: ${testOutputPath}`);
        
      } else {
        console.log('✅ No changes needed - module is already compliant');
      }
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      
      if (error.code === 'ENOENT') {
        console.log(`💡 Module not found: ${TEST_MODULE}`);
        console.log('🔍 Available modules:');
        await this.listModules();
      }
    }
  }

  cleanupModule(content) {
    let fixed = content;
    
    // 1. Fix imports
    fixed = this.fixImports(fixed);
    
    // 2. Eliminate forbidden patterns
    fixed = this.eliminateForbiddenPatterns(fixed);
    
    // 3. Ensure required patterns
    fixed = this.ensureRequiredPatterns(fixed);
    
    // 4. Fix TypeScript issues
    fixed = this.fixTypeScriptIssues(fixed);
    
    return fixed;
  }

  fixImports(content) {
    const lines = content.split('\n');
    const imports = [];
    const nonImports = [];
    let inImports = true;
    
    for (const line of lines) {
      if (inImports && (line.trim().startsWith('import') || line.trim() === '')) {
        if (line.trim().startsWith('import')) {
          imports.push(line);
        }
      } else {
        inImports = false;
        nonImports.push(line);
      }
    }
    
    // Sort imports
    const sortedImports = imports.sort((a, b) => {
      const order = ['react', '@/utils', '@/assets', '@/types', './Clock.module.css'];
      
      for (const category of order) {
        if (a.includes(category) && !b.includes(category)) return -1;
        if (b.includes(category) && !a.includes(category)) return 1;
      }
      
      return a.localeCompare(b);
    });
    
    return [...sortedImports, '', ...nonImports].join('\n');
  }

  eliminateForbiddenPatterns(content) {
    let fixed = content;
    
    const replacements = {
      'document.querySelector': '// TODO: Replace with useRef',
      'document.getElementById': '// TODO: Replace with useRef',
      'console.log': '// TODO: Replace with proper logging',
      'console.warn': '// TODO: Replace with proper logging',
      'console.error': '// TODO: Replace with proper logging',
      ': any': ': unknown',
      '@ts-ignore': '// @ts-expect-error - TODO: Fix this type issue'
    };
    
    for (const [forbidden, replacement] of Object.entries(replacements)) {
      fixed = fixed.replace(new RegExp(forbidden, 'g'), replacement);
    }
    
    fixed = fixed.replace(
      /setInterval\(/g,
      'useClockTime() // Replace setInterval with useClockTime hook'
    );
    
    return fixed;
  }

  ensureRequiredPatterns(content) {
    let fixed = content;
    
    // Ensure useSuspenseFontLoader is present
    if (!fixed.includes('useSuspenseFontLoader')) {
      if (!fixed.includes('@/utils/fontLoader')) {
        fixed = `import { useSuspenseFontLoader } from '@/utils/fontLoader';\n${fixed}`;
      }
      
      if (!fixed.includes('useSuspenseFontLoader(')) {
        fixed = fixed.replace(
          /(const Clock.*= \(\) => \{)/,
          '$1\n  useSuspenseFontLoader(fontConfigs);'
        );
      }
    }
    
    // Ensure fontConfigs is defined
    if (!fixed.includes('fontConfigs')) {
      fixed = fixed.replace(
        /(useSuspenseFontLoader\(fontConfigs\);)/,
        'const fontConfigs = [];\n  $1'
      );
    }
    
    return fixed;
  }

  fixTypeScriptIssues(content) {
    let fixed = content;
    
    // Fix common TypeScript issues
    fixed = fixed.replace(/: React\.FC<\{\}>/g, ': React.FC');
    fixed = fixed.replace(/React\.useEffect\(/g, 'useEffect(');
    fixed = fixed.replace(/React\.useState\(/g, 'useState(');
    fixed = fixed.replace(/React\.useRef\(/g, 'useRef(');
    
    return fixed;
  }

  showChanges(original, modified) {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    const changes = [];
    
    for (let i = 0; i < Math.max(originalLines.length, modifiedLines.length); i++) {
      const originalLine = originalLines[i] || '';
      const modifiedLine = modifiedLines[i] || '';
      
      if (originalLine !== modifiedLine) {
        if (originalLine && !modifiedLine) {
          changes.push(`- ${originalLine}`);
        } else if (!originalLine && modifiedLine) {
          changes.push(`+ ${modifiedLine}`);
        } else {
          changes.push(`- ${originalLine}`);
          changes.push(`+ ${modifiedLine}`);
        }
      }
    }
    
    // Show first 10 changes
    const preview = changes.slice(0, 10);
    preview.forEach(change => console.log(`  ${change}`));
    
    if (changes.length > 10) {
      console.log(`  ... and ${changes.length - 10} more changes`);
    }
  }

  async listModules() {
    try {
      const pagesDir = path.join(PROJECT_ROOT, 'src', 'pages');
      const modules = [];
      
      const scanDir = async (dir, prefix = '') => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(PROJECT_ROOT, fullPath);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath, `${prefix}${entry.name}/`);
          } else if (entry.name === 'Clock.tsx') {
            modules.push(relativePath);
          }
        }
      };
      
      await scanDir(pagesDir);
      
      modules.slice(0, 10).forEach(module => {
        console.log(`  📁 ${module}`);
      });
      
      if (modules.length > 10) {
        console.log(`  ... and ${modules.length - 10} more modules`);
      }
      
    } catch (error) {
      console.log('Could not list modules:', error.message);
    }
  }
}

// Run the test
const test = new TestCleanup();
test.run().catch(console.error);
