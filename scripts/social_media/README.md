# Social Media Screenshot Generator

## Where the images are created

They are written to:
- `src/assets/social_media/<YY-MM-DD>/`

## Generates

Generates optimized images from your clock pages for sharing on **Twitter/X** and **Instagram**.

## Output

The script exports **two** crops into two folders:

- Instagram: `src/assets/social_media/instagram/<YY-MM-DD>/*-portrait_1080x1350.webp` (1080x1350)
- X (Twitter): `src/assets/social_media/x/<YY-MM-DD>/*-square_1080.webp` (1080x1080)

Crops are taken ~0.9s after the clock component finishes loading.

## Prerequisites


1. Start the dev server:

```bash
npm run dev
```

2. (If needed) install Playwright Chromium browsers:

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

### Range

```bash
node scripts/social_media/capture-social-images.mjs range 26-01-01 26-01-31
```

### All

```bash
node scripts/social_media/capture-social-images.mjs all
```

## Configuration

- `CLOCK_BASE_URL` (default `http://localhost:5173`)

```bash
CLOCK_BASE_URL=http://localhost:5173 node scripts/social_media/capture-social-images.mjs today
```

