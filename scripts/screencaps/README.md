# Screencap Generator - Website Thumbnails

## Output (2 images per clock)

- **Full screenshot**: `src/assets/thumbnails/<YY-MM-DD>.webp` (1080×1080 @2x device scale, 90% quality)
- **Thumbnail**: `src/assets/thumbnails/<YY-MM-DD>-thumb.webp` (max 200px wide, 65% quality)

## Usage

### Capture all clocks

```bash
npx ts-node scripts/screencaps/capture.ts
```

### Capture specific clock(s)

```bash
npx ts-node scripts/screencaps/capture.ts 26-09-01
npx ts-node scripts/screencaps/capture.ts 26-09-01 26-09-02
```

### Optimize existing thumbnails only

```bash
npx ts-node scripts/screencaps/capture.ts --optimize
```

### Custom port

```bash
npx ts-node scripts/screencaps/capture.ts --port 3000
```

## Prerequisites

1. Dev server running (or script will start one):

```bash
npm run dev
```

2. Playwright Chromium installed:

```bash
npx playwright install chromium
```
