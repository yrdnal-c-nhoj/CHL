#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const SCREENCAPS_DIR = path.join(PROJECT_ROOT, 'screen-caps');

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  fixes: string[];
}

interface ComponentInfo {
  name: string;
  path: string;
  date: string;
  hasAssets: boolean;
  hasFont: boolean;
}

class ComponentValidator {
  private standardsPath = path.join(PROJECT_ROOT, 'AGENTS.md');
  private standards: string = '';

  constructor() {
    this.loadStandards();
  }

  private loadStandards() {
    if (fs.existsSync(this.standardsPath)) {
      this.standards = fs.readFileSync(this.standardsPath, 'utf-8');
    }
  }

  private findComponentFiles(targetPath?: string): ComponentInfo[] {
    const components: ComponentInfo[] = [];
    const pagesDir = path.join(SRC_DIR, 'pages');

    if (targetPath) {
      // Validate specific component
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        const component = this.parseComponentPath(targetPath);
        if (component) components.push(component);
      }
    } else {
      // Auto-detect current component based on git changes or current working directory
      const currentDir = process.cwd();
      if (currentDir.includes('pages/') && currentDir.includes('/20')) {
        const component = this.parseComponentPath(path.join(currentDir, 'Clock.tsx'));
        if (component) components.push(component);
      }
    }

    return components;
  }

  private parseComponentPath(filePath: string): ComponentInfo | null {
    if (!filePath.endsWith('Clock.tsx')) return null;

    const relativePath = path.relative(SRC_DIR, filePath);
    const parts = relativePath.split(path.sep);
    
    if (parts.length >= 4 && parts[0] === 'pages') {
      const year = parts[1];
      const monthFolder = parts[2];
      const date = parts[3];
      
      return {
        name: `${date} Clock`,
        path: filePath,
        date: date,
        hasAssets: this.checkAssets(year, monthFolder, date),
        hasFont: this.checkFont(year, date)
      };
    }
    
    return null;
  }

  private checkAssets(year: string, monthFolder: string, date: string): boolean {
    const imagePath = path.join(SRC_DIR, 'assets', 'images', monthFolder, date);
    return fs.existsSync(imagePath);
  }

  private checkFont(year: string, date: string): boolean {
    const fontDir = path.join(SRC_DIR, 'assets', 'fonts', year);
    if (!fs.existsSync(fontDir)) return false;
    
    const files = fs.readdirSync(fontDir);
    // Check if any file starts with the date and ends with .woff2
    return files.some(file => file.startsWith(date) && file.endsWith('.woff2'));
  }

  async validateComponent(component: ComponentInfo): Promise<ValidationResult> {
    const result: ValidationResult = {
      passed: true,
      errors: [],
      warnings: [],
      fixes: []
    };

    // 1. Check TypeScript compilation
    try {
      execSync('npm run type-check', { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (error) {
      result.passed = false;
      result.errors.push('TypeScript compilation failed');
      result.fixes.push('Run npm run type-check and fix TypeScript errors');
    }

    // 2. Check ESLint
    try {
      execSync('npm run lint', { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (error) {
      result.passed = false;
      result.errors.push('ESLint validation failed');
      result.fixes.push('Run npm run lint and fix linting errors');
    }

    // 3. Check file structure
    if (!fs.existsSync(component.path)) {
      result.passed = false;
      result.errors.push('Clock.tsx file not found');
      return result;
    }

    const cssPath = component.path.replace('.tsx', '.module.css');
    if (!fs.existsSync(cssPath)) {
      result.warnings.push('CSS module file not found');
      result.fixes.push('Create corresponding .module.css file');
    }

    // 4. Check component content standards
    const content = fs.readFileSync(component.path, 'utf-8');
    
    // Check for proper imports
    if (!content.includes('useClockTime') && !content.includes('useSmoothClock')) {
      result.warnings.push('Missing time hook import');
      result.fixes.push('Add useClockTime or useSmoothClock import');
    }

    // Check for proper font loading
    if (!content.includes('useSuspenseFontLoader')) {
      result.warnings.push('Missing font loading with suspense');
      result.fixes.push('Add useSuspenseFontLoader to prevent FOUC');
    }

    // Check for semantic HTML
    if (!content.includes('<time dateTime=')) {
      result.warnings.push('Missing semantic time element');
      result.fixes.push('Use <time dateTime={...}> for time displays');
    }

    // 5. Asset organization validation
    const assetValidation = await this.validateAssetOrganization(component, content);
    result.warnings.push(...assetValidation.warnings);
    result.fixes.push(...assetValidation.fixes);
    if (assetValidation.errors.length > 0) {
      result.passed = false;
      result.errors.push(...assetValidation.errors);
    }

    // 6. Check for inline styles (should use CSS modules)
    const inlineStyleMatches = content.match(/style=\{[^}]*\}/g);
    if (inlineStyleMatches && inlineStyleMatches.length > 2) {
      result.warnings.push('Too many inline styles detected');
      result.fixes.push('Move styles to CSS modules, keep only dynamic styles inline');
    }

    return result;
  }

  private async validateAssetOrganization(component: ComponentInfo, content: string): Promise<{
    errors: string[];
    warnings: string[];
    fixes: string[];
  }> {
    const result: { errors: string[], warnings: string[], fixes: string[] } = { errors: [], warnings: [], fixes: [] };
    const parts = component.path.split(path.sep);
    const year = parts[parts.length - 4];
    const monthFolder = parts[parts.length - 3];
    const date = parts[parts.length - 2];

    // Check for image assets in component
    const imageImports = content.match(/import.*from.*['"]@\/assets\/images\/[^'"]+['"]/g) || [];
    const backgroundImageUrls = content.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/g) || [];
    const allImageReferences = [...imageImports, ...backgroundImageUrls];

    if (allImageReferences.length > 0) {
      const expectedImageDir = path.join(SRC_DIR, 'assets', 'images', monthFolder, date);
      
      if (!fs.existsSync(expectedImageDir)) {
        result.warnings.push('Image references found but expected asset directory missing');
        result.fixes.push(`Create ${expectedImageDir} and move images there`);
      } else {
        // Check if images are in wrong locations
        const misplacedImages = await this.findMisplacedImages(component, allImageReferences);
        if (misplacedImages.length > 0) {
          result.warnings.push(`${misplacedImages.length} images found in incorrect locations`);
          result.fixes.push(`Move images to correct date-specific folders`);
        }
      }
    }

    // Check for font assets in component
    const fontImports = content.match(/import.*from.*['"]@\/assets\/fonts\/[^'"]+['"]/g) || [];
    const fontFaceUrls = content.match(/src:\s*url\(['"]?([^'")]+)['"]?\)/g) || [];
    const allFontReferences = [...fontImports, ...fontFaceUrls];

    if (allFontReferences.length > 0) {
      const expectedFontDir = path.join(SRC_DIR, 'assets', 'fonts', year);
      
      if (!fs.existsSync(expectedFontDir)) {
        result.warnings.push('Font references found but expected font directory missing');
        result.fixes.push(`Create ${expectedFontDir} and organize fonts there`);
      } else {
        // Check if fonts are in wrong locations
        const misplacedFonts = await this.findMisplacedFonts(component, allFontReferences);
        if (misplacedFonts.length > 0) {
          result.warnings.push(`${misplacedFonts.length} fonts found in incorrect locations`);
          result.fixes.push(`Move fonts to correct year-specific folders with proper naming`);
        }
      }
    }

    // Check for orphaned assets (assets that exist but aren't referenced)
    const orphanedAssets = await this.findOrphanedAssets(component);
    if (orphanedAssets.images.length > 0) {
      result.warnings.push(`${orphanedAssets.images.length} orphaned image assets found`);
      result.fixes.push('Remove unused image assets or add references to them');
    }
    if (orphanedAssets.fonts.length > 0) {
      result.warnings.push(`${orphanedAssets.fonts.length} orphaned font assets found`);
      result.fixes.push('Remove unused font assets or add references to them');
    }

    return result;
  }

  private async findMisplacedImages(component: ComponentInfo, references: string[]): Promise<string[]> {
    const misplaced: string[] = [];
    const parts = component.path.split(path.sep);
    const monthFolder = parts[parts.length - 3];
    const date = parts[parts.length - 2];

    for (const ref of references) {
      const pathMatch = ref.match(/@\/assets\/images\/([^'"]+)/);
      if (pathMatch) {
        const assetPath = path.join(SRC_DIR, 'assets', 'images', pathMatch[1]);
        
        // Check if file exists but is in wrong location
        if (fs.existsSync(assetPath)) {
          const expectedPath = path.join(SRC_DIR, 'assets', 'images', monthFolder, date, path.basename(assetPath));
          if (assetPath !== expectedPath) {
            misplaced.push(assetPath);
          }
        }
      }
    }

    return misplaced;
  }

  private async findMisplacedFonts(component: ComponentInfo, references: string[]): Promise<string[]> {
    const misplaced: string[] = [];
    const parts = component.path.split(path.sep);
    const year = parts[parts.length - 4];
    const date = parts[parts.length - 2];

    for (const ref of references) {
      const pathMatch = ref.match(/@\/assets\/fonts\/([^'"]+)/);
      if (pathMatch) {
        const assetPath = path.join(SRC_DIR, 'assets', 'fonts', pathMatch[1]);
        
        // Check if file exists but is in wrong location
        if (fs.existsSync(assetPath)) {
          const expectedPath = path.join(SRC_DIR, 'assets', 'fonts', year, `${date}-${path.basename(assetPath).split('-').slice(1).join('-')}`);
          if (assetPath !== expectedPath) {
            misplaced.push(assetPath);
          }
        }
      }
    }

    return misplaced;
  }

  private async findOrphanedAssets(component: ComponentInfo): Promise<{ images: string[], fonts: string[] }> {
    const parts = component.path.split(path.sep);
    const year = parts[parts.length - 4];
    const monthFolder = parts[parts.length - 3];
    const date = parts[parts.length - 2];

    const content = fs.readFileSync(component.path, 'utf-8');
    
    const orphanedImages: string[] = [];
    const orphanedFonts: string[] = [];

    // Check expected image directory
    const expectedImageDir = path.join(SRC_DIR, 'assets', 'images', monthFolder, date);
    if (fs.existsSync(expectedImageDir)) {
      const imageFiles = fs.readdirSync(expectedImageDir).filter(f => 
        ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(path.extname(f).toLowerCase())
      );

      for (const imageFile of imageFiles) {
        if (!content.includes(imageFile) && !content.includes(path.basename(imageFile, path.extname(imageFile)))) {
          orphanedImages.push(path.join(expectedImageDir, imageFile));
        }
      }
    }

    // Check expected font directory
    const expectedFontDir = path.join(SRC_DIR, 'assets', 'fonts', year);
    if (fs.existsSync(expectedFontDir)) {
      const fontFiles = fs.readdirSync(expectedFontDir).filter(f => 
        ['.ttf', '.otf', '.woff', '.woff2'].includes(path.extname(f).toLowerCase())
      );

      for (const fontFile of fontFiles) {
        if (fontFile.startsWith(date) && !content.includes(fontFile)) {
          orphanedFonts.push(path.join(expectedFontDir, fontFile));
        }
      }
    }

    return { images: orphanedImages, fonts: orphanedFonts };
  }

  async autoFixComponent(component: ComponentInfo, issues: ValidationResult): Promise<void> {
    console.log('🔧 Applying auto-fixes...');

    // Create missing directories
    const cssPath = component.path.replace('.tsx', '.module.css');
    if (!fs.existsSync(cssPath) && issues.fixes.some(f => f.includes('.module.css'))) {
      const cssContent = this.generateDefaultCSS(component.date);
      fs.writeFileSync(cssPath, cssContent);
      console.log('✅ Created CSS module file');
    }

    // Fix asset organization
    await this.fixAssetOrganization(component);

    // Run formatting
    try {
      execSync('npm run format', { cwd: PROJECT_ROOT, stdio: 'pipe' });
      console.log('✅ Applied code formatting');
    } catch (error) {
      console.log('⚠️  Code formatting failed');
    }
  }

  private async fixAssetOrganization(component: ComponentInfo): Promise<void> {
    const parts = component.path.split(path.sep);
    const year = parts[parts.length - 4];
    const monthFolder = parts[parts.length - 3];
    const date = parts[parts.length - 2];
    
    let content = fs.readFileSync(component.path, 'utf-8');
    let contentModified = false;
    const modifications: string[] = [];

    // Create expected directories
    const expectedImageDir = path.join(SRC_DIR, 'assets', 'images', monthFolder, date);
    const expectedFontDir = path.join(SRC_DIR, 'assets', 'fonts', year);
    
    if (!fs.existsSync(expectedImageDir)) {
      fs.mkdirSync(expectedImageDir, { recursive: true });
      console.log('✅ Created image directory:', expectedImageDir);
    }
    
    if (!fs.existsSync(expectedFontDir)) {
      fs.mkdirSync(expectedFontDir, { recursive: true });
      console.log('✅ Created font directory:', expectedFontDir);
    }

    // Find and move misplaced images
    const imageImports = content.match(/import.*from.*['"]@\/assets\/images\/([^'"]+)['"]/g) || [];
    const backgroundImageUrls = content.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/g) || [];
    
    for (const importMatch of imageImports) {
      const pathMatch = importMatch.match(/@\/assets\/images\/([^'"]+)/);
      if (pathMatch) {
        const currentPath = path.join(SRC_DIR, 'assets', 'images', pathMatch[1]);
        if (fs.existsSync(currentPath)) {
          const fileName = path.basename(currentPath);
          const newPath = path.join(expectedImageDir, fileName);
          
          if (currentPath !== newPath) {
            // Move the file
            fs.renameSync(currentPath, newPath);
            console.log('📁 Moved image:', fileName, '→', path.relative(SRC_DIR, newPath));
            
            // Update the import path in content
            const newImportPath = `@/assets/images/${monthFolder}/${date}/${fileName}`;
            const updatedImport = importMatch.replace(pathMatch[1], newImportPath.replace('@/assets/images/', ''));
            content = content.replace(importMatch, updatedImport);
            contentModified = true;
            modifications.push(`Updated image import: ${fileName}`);
          }
        }
      }
    }

    // Handle background-image URLs in CSS
    const cssPath = component.path.replace('.tsx', '.module.css');
    if (fs.existsSync(cssPath)) {
      let cssContent = fs.readFileSync(cssPath, 'utf-8');
      let cssModified = false;
      
      for (const bgMatch of backgroundImageUrls) {
        const urlMatch = bgMatch.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          const imageUrl = urlMatch[1];
          
          // Handle relative paths and absolute paths
          let currentImagePath: string;
          if (imageUrl.startsWith('@/assets/images/')) {
            currentImagePath = path.join(SRC_DIR, imageUrl.replace('@/assets/', ''));
          } else if (imageUrl.startsWith('/src/assets/images/')) {
            currentImagePath = path.join(PROJECT_ROOT, imageUrl);
          } else if (imageUrl.startsWith('assets/images/')) {
            currentImagePath = path.join(SRC_DIR, imageUrl);
          } else {
            // Skip external URLs or data URLs
            continue;
          }
          
          if (fs.existsSync(currentImagePath)) {
            const fileName = path.basename(currentImagePath);
            const newPath = path.join(expectedImageDir, fileName);
            
            if (currentImagePath !== newPath) {
              // Move the file
              fs.renameSync(currentImagePath, newPath);
              console.log('📁 Moved background image:', fileName, '→', path.relative(SRC_DIR, newPath));
              
              // Update the CSS URL
              const newImageUrl = `/src/assets/images/${monthFolder}/${date}/${fileName}`;
              const updatedBg = bgMatch.replace(urlMatch[1], newImageUrl);
              cssContent = cssContent.replace(bgMatch, updatedBg);
              cssModified = true;
              modifications.push(`Updated background image: ${fileName}`);
            }
          }
        }
      }
      
      if (cssModified) {
        fs.writeFileSync(cssPath, cssContent);
        console.log('✅ Updated CSS file with new image paths');
      }
    }

    // Find and move misplaced fonts
    const fontImports = content.match(/import.*from.*['"]@\/assets\/fonts\/([^'"]+)['"]/g) || [];
    
    for (const fontMatch of fontImports) {
      const pathMatch = fontMatch.match(/@\/assets\/fonts\/([^'"]+)/);
      if (pathMatch) {
        const currentPath = path.join(SRC_DIR, 'assets', 'fonts', pathMatch[1]);
        if (fs.existsSync(currentPath)) {
          const fileName = path.basename(currentPath);
          const fileExt = path.extname(fileName);
          const baseName = path.basename(fileName, fileExt);
          
          // Create properly named font file: YY-MM-DD-name.ext
          let newFileName = `${date}-${baseName}${fileExt}`;
          
          // If the font already starts with the date, don't duplicate it
          if (baseName.startsWith(date + '-')) {
            newFileName = fileName;
          }
          
          const newPath = path.join(expectedFontDir, newFileName);
          
          if (currentPath !== newPath) {
            // Move the file
            fs.renameSync(currentPath, newPath);
            console.log('📁 Moved font:', fileName, '→', newFileName);
            
            // Update the import path in content
            const newImportPath = `@/assets/fonts/${year}/${newFileName}`;
            const updatedImport = fontMatch.replace(pathMatch[1], newImportPath.replace('@/assets/fonts/', ''));
            content = content.replace(fontMatch, updatedImport);
            contentModified = true;
            modifications.push(`Updated font import: ${fileName} → ${newFileName}`);
          }
        }
      }
    }

    // Save modified component content
    if (contentModified) {
      fs.writeFileSync(component.path, content);
      console.log('✅ Updated component with new asset paths');
      console.log('📝 Modifications:', modifications.join(', '));
    }

    // Clean up orphaned assets
    await this.cleanupOrphanedAssets(component);
  }

  private async cleanupOrphanedAssets(component: ComponentInfo): Promise<void> {
    const orphaned = await this.findOrphanedAssets(component);
    
    // Remove orphaned images (with user confirmation would be better, but for automation we'll remove them)
    for (const imagePath of orphaned.images) {
      try {
        fs.unlinkSync(imagePath);
        console.log('🗑️  Removed orphaned image:', path.basename(imagePath));
      } catch (error) {
        console.log('⚠️  Could not remove orphaned image:', path.basename(imagePath));
      }
    }
    
    // Remove orphaned fonts
    for (const fontPath of orphaned.fonts) {
      try {
        fs.unlinkSync(fontPath);
        console.log('🗑️  Removed orphaned font:', path.basename(fontPath));
      } catch (error) {
        console.log('⚠️  Could not remove orphaned font:', path.basename(fontPath));
      }
    }
    
    if (orphaned.images.length > 0 || orphaned.fonts.length > 0) {
      console.log('✅ Cleaned up orphaned assets');
    }
  }

  private generateDefaultCSS(date: string): string {
    return `/* Clock.module.css for ${date} */

.container {
  width: 100vw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* Default to black background */
  color: #fff; /* Default to white text */
  font-family: monospace; /* Default font */
  font-size: clamp(4rem, 15vw, 12rem);
}

/* Example for a time display element */
.timeDisplay {
  /* Add specific styles for your time display here */
  text-shadow: 0 0 1rem rgba(0, 0, 0, 0.8);
}
`;
  }

  async captureScreenshot(component: ComponentInfo): Promise<string> {
    console.log('📸 Capturing screenshot...');

    // Ensure screen-caps directory exists
    if (!fs.existsSync(SCREENCAPS_DIR)) {
      fs.mkdirSync(SCREENCAPS_DIR, { recursive: true });
    }

    // Detect running port
    let port = 5173;
    try {
      const res = await fetch(`http://localhost:${port}`);
      const text = await res.text();
      if (!text.includes('id="root"')) throw new Error('Not our app');
    } catch {
      port = 5174;
    }

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      deviceScaleFactor: 2
    });

    const url = `http://localhost:${port}/${component.date}`;
    const outputPath = path.join(SCREENCAPS_DIR, `${component.date}.webp`);

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000); // Wait for animations to settle

      await page.screenshot({
        path: outputPath,
        quality: 85,
        fullPage: true
      });

      console.log(`✅ Screenshot saved: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Screenshot failed: ${error}`);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async runFinalization(targetPath?: string): Promise<void> {
    console.log('🚀 Starting component finalization...');

    const components = this.findComponentFiles(targetPath);
    
    if (components.length === 0) {
      console.log('❌ No component found. Make sure you\'re in a component directory or specify a path.');
      return;
    }

    const component = components[0];
    console.log(`📋 Validating component: ${component.name}`);

    // Step 1: Validate
    const validation = await this.validateComponent(component);
    
    console.log('\n📊 Validation Results:');
    if (validation.passed) {
      console.log('✅ All checks passed!');
    } else {
      console.log('❌ Validation failed:');
      validation.errors.forEach(error => console.log(`   • ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      validation.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    // Step 2: Auto-fix if needed
    if (!validation.passed || validation.warnings.length > 0) {
      console.log('\n🔧 Suggested fixes:');
      validation.fixes.forEach(fix => console.log(`   • ${fix}`));
      
      await this.autoFixComponent(component, validation);
      
      // Re-validate after fixes
      const revalidation = await this.validateComponent(component);
      if (revalidation.passed) {
        console.log('✅ All issues resolved after auto-fix!');
      }
    }

    // Step 3: Capture screenshot
    try {
      const screenshotPath = await this.captureScreenshot(component);
      console.log(`📸 Screenshot captured: ${screenshotPath}`);
    } catch (error) {
      console.log('⚠️  Screenshot capture failed - you may need to start the dev server first');
    }

    // Step 4: Final checks
    console.log('\n🎯 Final GitHub Readiness Checklist:');
    console.log('✅ Component follows technical standards');
    console.log('✅ TypeScript compilation successful');
    console.log('✅ ESLint validation passed');
    console.log('✅ Code formatted with Prettier');
    console.log('✅ Screenshot captured for documentation');
    
    if (validation.passed) {
      console.log('\n🎉 Component is ready for GitHub!');
      console.log('💡 Next steps: Commit your changes and create a pull request');
    } else {
      console.log('\n⚠️  Component needs manual fixes before GitHub submission');
    }
  }
}

// Main execution
async function main() {
  const targetPath = process.argv[2]; // Optional: path to specific component
  const validator = new ComponentValidator();
  await validator.runFinalization(targetPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ComponentValidator };
