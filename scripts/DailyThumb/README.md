# Daily Square Capture

> **Registry:** Manual entry in `clockpages.json` required. See [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md).

## Quick Start - How to Capture Clocks

### **Today's Clock**

```bash
npm run capture:daily-square
```

### **Yesterday's Clock**

```bash
# (Manually pass yesterday's date string)
npm run capture:daily-square 26-05-20
```

### **January 1, 2026**
```bash
npm run capture:daily-square 26-01-01
```

### **Any Specific Date**

```bash
npm run capture:daily-square YY-MM-DD
# Examples:
npm run capture:daily-square 26-05-09  # May 9, 2026
npm run capture:daily-square 26-12-25  # December 25, 2026
npm run capture:daily-square 26-01-01  # January 1, 2026
```

## Overview

This folder contains scripts for capturing daily square thumbnails of clock components, optimized like the regular thumbnails with a 2-second wait after component load.

## Scripts

### `daily-square-capture.ts`

A specialized capture tool that creates 500x500px square thumbnails of daily clock components with the same optimizations as the regular thumbnail generator.

#### Features

- **Square Format**: 500x500px square thumbnails
- **Thumbnail Optimizations**: Same styling as regular thumbnails
- **2-Second Wait**: Waits 2 seconds after component load (as requested)
- **Black Background**: Clean black background for consistency
- **Centered Content**: Clocks are perfectly centered
- **Navigation Hidden**: Removes UI elements for clean captures
- **Thumbnail Folder**: Saves to `src/assets/thumbnails/`

#### Usage

```bash
# Capture today's clock as square thumbnail
npm run capture:daily-square

# Capture specific date as square thumbnail
npm run capture:daily-square YY-MM-DD

# Direct usage (alternative syntax)
tsx scripts/DailyThumb/daily-square-capture.ts [YY-MM-DD]
```

#### Technical Specifications

##### Thumbnail Format

- **Dimensions**: 500x500px (1:1 square)
  - **Format**: WebP (optimized for web)
  - **Quality**: 90%
- **Background**: Black
- **Wait Time**: 2 seconds after component load

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
├── 26-05-09-thumb.webp          # Regular thumbnail
├── 26-05-09-daily-square.webp   # Daily square thumbnail
├── 26-05-10-thumb.webp          # Regular thumbnail
├── 26-05-10-daily-square.webp   # Daily square thumbnail
└── ...
```

#### Key Differences from Regular Thumbnails

| Feature          | Regular Thumbnails  | Daily Square             |
| ---------------- | ------------------- | ------------------------ |
| **Wait Time**    | 2 seconds           | 2 seconds (as requested) |
| **Format**       | WebP 90%            | WebP 90%                 |
| **Dimensions**   | 500x500px           | 500x500px                |
| **Background**   | Black               | Black                    |
| **Optimization** | Thumbnail mode      | Thumbnail mode           |
| **Naming**       | `{date}-thumb.webp` | `{date}-daily-square.webp` |

#### Integration with Workflow

The daily square capture complements the existing thumbnail workflow:

1. **Component Development**: Create your clock component
2. **Finalization**: Run `npm run finalize` to validate and capture standard screenshot
3. **Regular Thumbnails**: Run `npm run capture:thumbnails` for all clocks
4. **Daily Square**: Run `npm run capture:daily-square` for today's clock
5. **Social Media**: Use `npm run capture:instagram` etc. for platform-specific images

#### Requirements

1. **Development Server**: Must be running on localhost:5173 or 5174
2. **Clock Registration**: You must manually add the clock to `clockpages.json` (see DEVELOPMENT.md)
3. **Dependencies**: Playwright for screenshot capture

#### Example Output

```bash
📅 Looking for clock: 26-05-09
📸 Capturing square thumbnail (500x500px)
✅ Found clock: Lotus Meditation Clock [26-05-09]
Checking port 5173...
🚀 Starting capture sequence on http://localhost:5173
📸 Capturing: Lotus Meditation Clock [26-05-09]
⏱️ Waiting 2 seconds for component to fully load and settle...
✅ Square thumbnail saved to: /path/to/src/assets/thumbnails/26-05-09-daily-square.webp
🎉 Daily square capture complete!
📸 File saved in: /path/to/src/assets/thumbnails/
   - 26-05-09-daily-square.webp (500x500px square thumbnail)

```

#### Troubleshooting

##### Common Issues

1. **Port Conflicts**: Ensure dev server is running on port 5173 or 5174
2. **Missing Clock**: Verify clock is registered in `clockpages.json`
3. **Timeout Errors**: Increase wait time for complex animations
4. **Route Issues**: Check if the clock route exists and is accessible

##### Debug Mode

For detailed logging, run with verbose output:

```bash
DEBUG=true npm run capture:daily-square
```

This daily square capture tool ensures consistent, high-quality thumbnails with the requested 2-second wait time, perfect for daily documentation and social media preparation.
