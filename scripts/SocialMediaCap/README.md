# Social Media Capture Scripts

> **Registry:** Clocks must already be listed in `clockpages.json` (manual). See `docs/DEVELOPMENT.md`.

## Quick Start

### Capture Today
```bash
npm run capture:daily
```

### Capture Specific Date
```bash
# Single date (YY-MM-DD)
npm run capture:range 26-05-21
```

### Capture Date Range
```bash
# Use double dots (..) as a separator
npm run capture:range 26-05-01..26-05-07
```

### Capture Last 30 Days
```bash
npm run capture:range last-month
```

---

## Overview

This folder contains the primary script for generating high-quality assets optimized for social media. It produces high-resolution 4:5 portrait PNGs, which are the standard for Instagram and mobile sharing.

## Primary Script

### `daily-screen-capture.ts`

This script automates the capture of registered clocks. It automatically detects active development servers, applies UI optimizations, and manages standardized output naming.

#### Features

- **Standardized Aspect Ratio**: Generates 1080x1350 (4:5) portrait assets.
- **UI Optimization**: Automatically hides headers, footers, and navigation for a clean capture.
- **Precision Timing**: Waits exactly 0.9 seconds for shaders and animations to stabilize before capturing.
- **Flexible Ranges**: Supports single dates, ranges, and aliases like `last-month`.
- **High Quality**: Uses lossless PNG format at 2x DPI.

## Technical Specifications

| Setting | Value |
| :--- | :--- |
| **Dimensions** | 1080 x 1350 px |
| **Aspect Ratio** | 4:5 (Portrait) |
| **Format** | PNG (Lossless) |
| **DPI** | 2x |
| **Warmup Time** | 0.9 seconds |
| **Output Path** | `screen-caps/` |

## CLI Usage

You can run the script directly using `tsx` if needed:

```bash
tsx scripts/SocialMediaCap/daily-screen-capture.ts [date-range]
```

**Arguments:**
- `date-range` (Optional): 
    - `YY-MM-DD` (e.g., `26-05-20`)
    - `YY-MM-DD..YY-MM-DD` (e.g., `26-05-01..26-05-07`)
    - `last-month` (alias for the last 30 days)
    - Defaults to **today** if omitted.

## Workflow Integration

1. **Develop**: Create your clock component in `src/pages/`.
2. **Register**: Add the clock entry manually to `src/context/clockpages.json`.
3. **Finalize**: Run `npm run finalize` to validate and capture documentation screenshots.
4. **Capture**: Run `npm run capture:daily` to generate social media assets.

## Troubleshooting

### Server Not Found
Ensure your development server is running on port **5173** or **5174**. The script will attempt to check both before failing.

### Missing Asset
If the script completes but no file is generated, check that the clock's `date` in `clockpages.json` matches the directory name and the argument you passed.

### Animation Issues
The 0.9s warmup is sufficient for most GLSL shaders. If a clock requires more time, you may need to temporarily adjust the `waitForTimeout` value in the script.
