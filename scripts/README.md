# Scripts Directory

This directory contains automation scripts for the BorrowedTime project, organized by functionality.

## Directory Structure

```
scripts/
├── README.md                    # This file - overview of all scripts
├── UploadFinalize/              # Component finalization and GitHub preparation
│   ├── README.md                # Detailed documentation for finalize workflow
│   └── finalize-component.ts    # Main validation and finalization script
├── SocialMediaCap/              # Social media screenshot capture
│   ├── README.md                # Social media capture documentation
│   └── daily-screen-capture.ts  # Multi-platform screenshot capture
├── DailyThumb/                  # Daily square thumbnail capture
│   ├── README.md                # Daily thumb documentation
│   └── daily-square-capture.ts  # Thumbnail capture script
├── capture-clocks.mjs           # Thumbnail generation for clocks
└── [other utility scripts]      # Various project utilities
```

## Script Categories

### 🚀 Upload & Finalize (`UploadFinalize/`)

**Purpose**: Component validation, asset organization, and GitHub preparation

**Main Script**: `finalize-component.ts`

**Usage**:
```bash
npm run finalize                    # Auto-detect current component
npm run finalize -- path/to/Clock.tsx  # Specific component
```

**Features**:
- ✅ Technical standards validation
- 🔄 Asset organization and moving
- 🔗 Path relinking after asset moves
- 📸 Standardized screenshot capture
- 🗑️ Orphaned asset cleanup
- 🎨 Code formatting and linting

**Documentation**: See `UploadFinalize/README.md`

### 📱 Social Media Capture (`SocialMediaCap/`)

**Purpose**: Platform-specific screenshot generation and thumbnail creation

**Main Scripts**: 
- `daily-screen-capture.ts` - Social media platform captures
- `capture-clocks.mjs` - Thumbnail generation

**Usage**:
```bash
npm run capture:daily        # Standard documentation format
npm run capture:instagram   # Instagram square (1080x1080)
npm run capture:twitter     # Twitter 16:9 (1200x675)
npm run capture:facebook    # Facebook 16:9 (1200x630)
npm run capture:thumbnails  # Generate 500x500 thumbnails
```

**Features**:
- 📸 Multi-platform support (Instagram, Twitter, Facebook)
- 🎯 Batch processing with date ranges
- 🖼️ High-quality WebP/PNG output
- 📱 Platform-optimized dimensions
- 🖼️ Consistent thumbnail generation
- 🔄 Date range support

**Documentation**: See `SocialMediaCap/README.md`

## Workflow Integration

### Development Workflow

1. **Develop** your clock component
2. **Test** locally (`npm run dev`)
3. **Finalize** with validation and standard screenshot (`npm run finalize`)
4. **Capture** social media images (`npm run capture:instagram`, `npm run capture:twitter`)
5. **Commit** and push to GitHub
6. **Create** pull request

### Asset Organization

The scripts work together to maintain proper asset organization:

- **Images**: `assets/images/YY-MM/YY-MM-DD/`
- **Fonts**: `assets/fonts/YYYY/`
- **Screenshots**: `public/screenshots/` and `screen-caps/`

## Package.json Scripts

All scripts are accessible via npm commands:

```json
{
  "finalize": "tsx scripts/UploadFinalize/finalize-component.ts",
  "capture:daily": "tsx scripts/SocialMediaCap/daily-screen-capture.ts",
  "capture:instagram": "tsx scripts/SocialMediaCap/daily-screen-capture.ts --instagram",
  "capture:twitter": "tsx scripts/SocialMediaCap/daily-screen-capture.ts --twitter",
}
```

## Requirements

### Common Dependencies
- **Node.js**: 24.x
- **Playwright**: For screenshot capture
- **Development Server**: Must run on localhost:5173 or 5174

### Script-Specific Requirements
- **Finalize Script**: Component must be in proper directory structure
- **Capture Scripts**: Clocks must be registered in `clockpages.json`

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure dev server is running on correct port
2. **Missing Clocks**: Verify registration in `clockpages.json`
3. **Asset Path Issues**: Run `npm run finalize` to fix organization
4. **TypeScript Errors**: Check imports and component structure

### Debug Mode

Most scripts support verbose output:
```bash
DEBUG=true npm run finalize
DEBUG=true npm run capture:daily
```

## Contributing

When adding new scripts:

1. **Organize** in appropriate subdirectory
2. **Document** with README file
3. **Update** package.json scripts
4. **Test** with various components
5. **Follow** existing naming conventions

## Related Documentation

- **AGENTS.md**: Technical standards and coding guidelines
- **CSS_ARCHITECTURE.md**: CSS organization and best practices
- **Project README**: Overall project documentation

This organized structure ensures maintainability and makes it easy to find and use the right script for each task in the development workflow.
