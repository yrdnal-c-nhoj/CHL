# Thumbnail Capture Automation

This directory contains the automation logic for generating the `300x300` WebP thumbnails used throughout the site.

## 🚀 Quick Start

Ensure your local development server is running (`npm run dev`) before executing these:

- **Capture Today's Clock:** (or the most recent if today is missing)
  ```bash
  npm run capture:daily
  ```
- **Capture Specific Date:**
  ```bash
  npm run capture:daily -- 26-05-22
  ```
- **Capture Date Range:** (clears existing thumbnails first)
  ```bash
  npm run capture:range -- 26-01-01 26-01-31
  ```

## 🛠 How it Works

The script (`capture.ts`) performs the following steps:

1.  **Registry Lookup:** It reads `src/context/clockpages.json` to find valid routes and titles.
2.  **Date Logic:** 
    - If no arguments are provided, it looks for an entry matching the current system date. 
    - If today's entry is missing, it automatically targets the most recent entry in the registry.
3.  **Browser Automation:** Uses **Playwright** to open `localhost:5173`, navigates to the clock, hides the UI (footer navigation), and takes a square screenshot of the `body` element.
4.  **Optimization:** Uses **Sharp** to:
    - Resize the capture to exactly `300x300` pixels.
    - Convert to **WebP** format.
    - Apply high-effort compression to minimize file size.
5.  **Output:** Saves files to `src/assets/thumbnails/` using the naming convention `YY-MM-DD-title.webp`.

## 📋 Requirements

- **Node.js 24.x** (as specified in `package.json`).
- **Local Server:** The script expects the site to be live at `http://localhost:5173`.
- **Registry:** The clock must be manually registered in `clockpages.json` before it can be captured.

## ⚠️ Troubleshooting

- **Timeouts:** If the script fails with a timeout, ensure the development server is actually responding. Heavy 3D clocks might occasionally require increasing the `timeout` value in the script.
- **Empty Screenshots:** The script waits 1 second for assets to settle. If a clock has a long intro animation, you may need to adjust the `page.waitForTimeout` value.

---
*Cubist Heart Laboratories*