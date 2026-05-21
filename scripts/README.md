# Scripts

> **Canonical workflow:** [`docs/DEVELOPMENT.md`](../docs/DEVELOPMENT.md).
> Scripts do **not** edit `clockpages.json` — registration is always manual.

## At a glance

| Command                    | What it does                                                   |
| -------------------------- | -------------------------------------------------------------- |
| `npm run clock:new`        | Scaffold `Clock.tsx` + `.module.css` from template (no registry)|
| `npm run finalize`        | Validate BTS standards, fix asset paths, capture screenshot    |
| `npm run capture:daily`    | Social-media PNG (1080×1350) for today's clock                |
| `npm run capture:range`    | Social-media PNGs for a date or range (e.g. `26-05-01..26-05-07`)|
| `npm run audit:fonts`      | Report unused / non-standard font files (gitignored output)   |
| `npm run audit:images`     | Report unused image files (gitignored output)                  |
| `npm run optimize:images`  | Convert JPG/PNG/GIF → WebP in staged folders                   |

## Details

### Finalize (`UploadFinalize/`)

`npm run finalize` or `npm run finalize -- src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`

Validates against BTS, auto-fixes asset organization, renames fonts to `YY-MM-DD-name.ext`, and captures a `screen-caps/YY-MM-DD.webp` thumbnail.

### Social captures (`SocialMediaCap/`)

Requires the clock to be registered in `clockpages.json`.

```bash
npm run capture:daily              # today
npm run capture:range 26-05-01..26-05-07   # range
npm run capture:range last-month    # last 30 days
```

Captures 1080×1350 PNG at 2× DPI with 0.9s warmup for animations.

### Audit scripts (`audit-*.mjs`)

Outputs go to `scripts/unused-*report.txt` (gitignored — regenerate locally after cleanup).

```bash
npm run audit:fonts
npm run audit:images
```

## Requirements

- Node 24.x
- Dev server running on `localhost:5173` or `5174` (for capture scripts)
- For captures: clock must be in `clockpages.json`