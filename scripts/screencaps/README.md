# Screen Capture Script

This directory contains the script used to automatically capture screenshots of the clock components. This is essential for generating visual documentation and ensuring consistent presentation across different versions of the clocks.

## Quick Start Guide

To successfully capture screenshots, you need to ensure your development server is running and accessible.

1. **Start the Development Server**

```bash
npm run dev
```

2. **Run the Capture Script**

This repo’s capture script in this folder targets **host/port 5173** by default and saves thumbnails to `src/assets/thumbnails/`.


node scripts/screencaps/capture today```bash
```

Replace `today` with:
- `all`
- `YY-MM-DD` (e.g. `26-04-27`)
- `range YY-MM-DD YY-MM-DD` (e.g. `range 26-01-01 26-01-31`)


## Troubleshooting

### `net::ERR_CONNECTION_REFUSED`

This error indicates that the capture script could not connect to the development server. Ensure that:
-   The development server (`npm run dev`) is running in a separate terminal.
- The port the capture script is trying to access (default: `5173`) matches the port your development server is actually running on. If they differ, run with:

- `CLOCK_BASE_URL=http://localhost:<PORT> node scripts/screencaps/capture ...`

or update the default in `scripts/screencaps/capture`.

