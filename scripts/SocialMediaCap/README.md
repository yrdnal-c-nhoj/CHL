# Social Media Capture Scripts

> **Registry:** Clocks must already be listed in `clockpages.json` (manual). See [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md).

## Overview

This folder contains scripts for capturing screenshots of clock components for social media platforms and documentation purposes.

## Scripts

### `daily-screen-capture.ts`

A comprehensive screenshot capture tool that creates optimized images for different social media platforms with flexible date range support.

### `capture-clocks.mjs`

A thumbnail generation tool that creates consistent 500x500px thumbnails of all clock components for documentation and gallery display.

#### Features

- **Consistent Thumbnails**: 500x500px square format for all clocks
- **Batch Processing**: Scans entire `src/pages` directory for Clock.tsx files
- **High Quality**: 2x DPI with WebP format at 90% quality
- **Robust Capture**: Handles complex clocks with canvas/video elements
- **Error Resilience**: Continues processing if individual clocks fail
- **Thumbnail Mode**: CSS injection for clean, centered captures

#### Usage

```bash
# Generate thumbnails for all clocks
npm run capture:thumbnails

# Direct usage
node scripts/SocialMediaCap/capture-clocks.mjs
```

#### Technical Specifications

##### Thumbnail Format

- **Dimensions**: 500x500px (1:1 square)
- **Format**: WebP (optimized for web)
- **Quality**: 90%
- **DPI**: 2x (for high-resolution displays)
- **Wait Time**: 2 seconds for animations to settle

##### Capture Optimizations

- **Navigation Hiding**: Removes header, footer, and navigation elements
- **Content Centering**: Centers clock content in 500x500 viewport
- **Black Background**: Ensures consistent background color
- **Error Handling**: Graceful failure handling with detailed error messages

##### Browser Settings

- **Headless Mode**: Runs without UI for performance
- **Sandbox Disabled**: Prevents hangs in complex clocks
- **Timeout**: 15 seconds navigation, 5 seconds content wait

#### Output Directory Structure

```
src/assets/thumbnails/
├── 26-05-09-thumb.webp     # Thumbnail for May 9, 2026
├── 26-05-10-thumb.webp     # Thumbnail for May 10, 2026
└── ...
```

#### Integration with Workflow

The thumbnail generation complements the social media capture workflow:

1. **Component Development**: Create your clock component
2. **Finalization**: Run `npm run finalize` to validate and capture standard screenshot
3. **Thumbnails**: Run `npm run capture:thumbnails` for gallery display
4. **Social Media**: Use `npm run capture:instagram` etc. for platform-specific images

#### Usage

```bash
# Capture today's clock for all platforms
npm run capture:daily

# Capture specific date for all platforms
npm run capture:range 26-05-09

# Capture date range for all platforms
npm run capture:range 26-05-01..26-05-07

# Single platform capture
npm run capture:instagram 26-05-09
npm run capture:twitter 26-05-09
npm run capture:facebook 26-05-09

# Multiple platforms with date range
tsx scripts/SocialMediaCap/daily-screen-capture.ts 26-05-01..26-05-07 --instagram --twitter
```

#### Command Line Options

```bash
# Direct usage
tsx scripts/SocialMediaCap/daily-screen-capture.ts [date-range] [platform-flags]

# Date Range (first argument, optional)
26-05-09                    # Single date
26-05-01..26-05-31         # Date range
# (default)                  # Today's date

# Platform Flags
--instagram                  # Instagram square format (1080x1080)
--twitter                    # Twitter 16:9 format (1200x675)
--facebook                   # Facebook 16:9 format (1200x630)
# (no flags)                 # All platforms

# Examples
tsx scripts/SocialMediaCap/daily-screen-capture.ts                    # Today, all platforms
tsx scripts/SocialMediaCap/daily-screen-capture.ts 26-05-09             # Single date, all platforms
tsx scripts/SocialMediaCap/daily-screen-capture.ts 26-05-01..26-05-07  --instagram  # Date range, Instagram only
```

## Output Directory Structure

```
public/screenshots/
├── 26-05-09.webp        # Standard documentation screenshot
├── 26-05-09-instagram.webp  # Instagram format
├── 26-05-09-twitter.webp    # Twitter format
└── ...
```

## Technical Specifications

### Image Quality

- **Format**: WebP (optimized for web)
- **Quality**: Platform-specific (85-90%)
- **DPI**: 2x (for high-resolution displays)
- **Wait Time**: 1.5 seconds for animations to settle

### Platform Specifications

#### Instagram

- **Dimensions**: 1080x1080px (1:1 square)
- **Quality**: 90%
- **Optimizations**: Centered content with padding, hidden navigation
- **Best for**: Instagram posts, stories

#### Twitter

- **Dimensions**: 1200x675px (16:9 landscape)
- **Quality**: 85%
- **Optimizations**: Centered content, hidden navigation
- **Best for**: Twitter posts, cards

#### Facebook

- **Dimensions**: 1200x630px (16:9 landscape)
- **Quality**: 85%
- **Optimizations**: Centered content, hidden navigation
- **Best for**: Facebook posts, shares

### Platform Optimizations

- **Navigation Hiding**: Removes header, footer, and navigation elements
- **Content Centering**: Optimizes layout for each platform's aspect ratio
- **Background Control**: Ensures clean, consistent backgrounds
- **Responsive Scaling**: Adapts content to platform dimensions

## Integration with Finalize Workflow

The social media capture scripts work in conjunction with the component finalization process:

1. **Component Development**: Create your clock component
2. **Finalization**: Run `npm run finalize` to validate and capture standard screenshot
3. **Social Media**: Use `npm run capture:instagram` or `npm run capture:twitter` for platform-specific images

## Requirements

1. **Development Server**: Must be running on localhost:5173 or 5174
2. **Registry**: You must manually add clocks to `src/context/clockpages.json`
3. **Dependencies**: Playwright for screenshot capture

## Example Output

```bash
📸 Starting social media capture sequence...
📋 Found 156 clocks in registry

📷 Capturing Instagram format...
✅ 26-05-09-instagram.webp
✅ 26-05-10-instagram.webp
...

📷 Capturing Twitter format...
✅ 26-05-09-twitter.webp
✅ 26-05-10-twitter.webp
...

🎉 All social media screenshots complete!
📁 Images saved to public/screenshots/
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure dev server is running on port 5173 or 5174
2. **Missing Clocks**: Verify clocks are registered in `clockpages.json`
3. **Timeout Errors**: Increase wait time for complex animations

### Debug Mode

For detailed logging, run with verbose output:

```bash
DEBUG=true npm run capture:daily
```

## Related Scripts

- **UploadFinalize/finalize-component.ts**: Component validation and standard screenshot capture
- **capture-clock.ts**: Basic screenshot capture for all clocks

This social media capture system ensures consistent, high-quality images across all platforms while maintaining the technical standards of the BorrowedTime project.
