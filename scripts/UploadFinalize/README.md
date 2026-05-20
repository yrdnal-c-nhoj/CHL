# Component Finalization Script

> **Canonical workflow:** [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md).  
> `finalize` does **not** edit `clockpages.json` — register clocks manually before captures.

## Overview

The `finalize-component.ts` script validates clock components against BTS standards (see DEVELOPMENT.md), auto-fixes common asset issues, and captures standardized screenshots.

## Usage

### Basic Usage (Auto-detect current component)
```bash
npm run finalize
```

### Specific Component
```bash
npm run finalize -- src/pages/2026/26-05/26-05-09/Clock.tsx
```

## What It Does

### 1. Validation Checks
- ✅ **TypeScript Compilation**: Ensures no TypeScript errors
- ✅ **ESLint Validation**: Checks against linting rules
- ✅ **File Structure**: Verifies required files exist (Clock.tsx, .module.css)
- ✅ **Technical Standards**: Validates against BTS ([`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md))
- ✅ **Asset Structure**: Checks for proper asset organization
- ✅ **Font Loading**: Ensures proper font loading with suspense
- ✅ **Semantic HTML**: Checks for proper time element usage
- ✅ **CSS Modules**: Validates CSS module usage over inline styles

### 2. Auto-Fixes
- 📁 **Creates Missing Directories**: Asset and font directories
- 📄 **Creates CSS Modules**: Default CSS module file if missing
- 🎨 **Code Formatting**: Applies Prettier formatting
- 📂 **Asset Organization**: Creates proper folder structure
- 🔄 **Asset Moving**: Moves misplaced assets to correct date folders
- 🔗 **Path Relinking**: Updates import paths after moving assets
- 🗑️ **Cleanup**: Removes orphaned (unused) assets
- 📝 **Font Renaming**: Renames fonts to follow YY-MM-DD-name.ext convention

### 3. Screenshot Capture
- 📸 **Standardized Screenshots**: 1200x800 with 2x DPI
- 🎯 **Component Isolation**: Captures only the component
- 📁 **Organized Storage**: Saves to `screen-caps/` directory
- 🏷️ **Consistent Naming**: Uses date format (e.g., `26-05-09.webp`)

### 4. GitHub Readiness
- ✅ **Pre-commit Validation**: All checks passed
- ✅ **Code Quality**: Formatted and linted
- ✅ **Documentation**: Screenshot for README/docs
- ✅ **Standards Compliance**: Follows project conventions

## Output Directory Structure

```
screen-caps/
├── 26-05-09.webp    # Component screenshot
├── 26-05-10.webp    # Another component
└── ...
```

## Validation Details

### Technical Standards Checked
- Use of `useClockTime()` or `useSmoothClock()` hooks
- Proper font loading with `useSuspenseFontLoader()`
- Semantic HTML with `<time dateTime={...}>`
- CSS modules instead of inline styles (where possible)
- Proper asset naming conventions
- Performance budget compliance
- Asset organization and placement

### Asset Organization Validation
The script now performs comprehensive asset organization checks:

#### Images
- **Location Check**: Ensures images are in `assets/images/YY-MM/YY-MM-DD/`
- **Reference Validation**: Checks if imported/background images exist
- **Path Detection**: Finds misplaced images in wrong directories
- **Orphan Detection**: Identifies unused image assets

#### Fonts
- **Location Check**: Ensures fonts are in `assets/fonts/YYYY/`
- **Naming Convention**: Validates `YY-MM-DD-name.ext` format
- **Reference Validation**: Checks if imported fonts exist
- **Orphan Detection**: Identifies unused font assets

### Auto-Fix Capabilities
- Missing CSS module files
- Asset directory structure
- Font directory structure
- Code formatting issues
- **Asset Moving**: Automatically moves misplaced assets to correct folders
- **Path Relinking**: Updates import statements after moving assets
- **Font Renaming**: Renames fonts to follow naming conventions
- **Orphan Cleanup**: Removes unused assets to keep repo clean

### Screenshot Specifications
- **Resolution**: 1200x800px
- **DPI**: 2x (for high-quality thumbnails)
- **Format**: WebP (optimized for web)
- **Quality**: 85%
- **Wait Time**: 2 seconds for animations to settle

## Requirements

1. **Development Server**: Must be running on localhost:5173 or 5174
2. **Component Location**: Should be in a component directory when using auto-detect
3. **Dependencies**: Playwright for screenshot capture

## Example Output

```
🚀 Starting component finalization...
📋 Validating component: 26-05-09 Clock

📊 Validation Results:
✅ All checks passed!

🔧 Applying auto-fixes...
✅ Created CSS module file
✅ Applied code formatting

📸 Capturing screenshot...
✅ Screenshot saved: screen-caps/26-05-09.webp

🎯 Final GitHub Readiness Checklist:
✅ Component follows technical standards
✅ TypeScript compilation successful
✅ ESLint validation passed
✅ Code formatted with Prettier
✅ Screenshot captured for documentation

🎉 Component is ready for GitHub!
💡 Next steps: Commit your changes and create a pull request
```

## Integration with Workflow

Use this script as the final step before committing any clock component:

1. **Develop** your clock component
2. **Test** it locally (`npm run dev`)
3. **Finalize** with `npm run finalize`
4. **Commit** and push to GitHub
5. **Create** pull request

This ensures all components follow consistent standards and have proper documentation.
