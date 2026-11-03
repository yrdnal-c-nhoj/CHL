# Social Media Screenshot Generator

## Output (2 images per clock)

- **X/Twitter**: `src/assets/social_media/x/<YY-MM-DD>-square_1080.webp` (1080×1080)
- **Instagram Feed**: `src/assets/social_media/instagram/<YY-MM-DD>-portrait_1080x1350.webp` (1080×1350)

## Prerequisites

1. Start the dev server:

```bash
npm run dev
```

2. Install Playwright Chromium:

```bash
npx playwright install chromium
```

## Usage

### One clock

```bash
node scripts/social_media/capture-social-images.mjs 26-05-23
```

### Today

```bash
node scripts/social_media/capture-social-images.mjs today
```

### Range of dates

```bash
node scripts/social_media/capture-social-images.mjs range 26-01-01 26-01-31
```

### All clocks

```bash
node scripts/social_media/capture-social-images.mjs all
```

## Configuration

- `CLOCK_BASE_URL` (default `http://localhost:5173`)

```bash
CLOCK_BASE_URL=http://localhost:5173 node scripts/social_media/capture-social-images.mjs today
```
