# AGENTS.md

Technical guidance for AI coding agents and automated build tools.

## 🏗️ Core Architecture

### Data Flow
*   **Registry**: `src/context/clockpages.json` is the source of truth for all modules.
*   **Loading**: `useClockPage.ts` uses `import.meta.glob` to resolve paths dynamically based on the registry.

### Hooks & Utilities
*   **Time Source**: `useClockTime()` from `@/utils/hooks`.
*   **Font Loader**: `useSuspenseFontLoader()` handles font injections via React Suspense.
*   **Asset Loader**: `useImageLoader` / `useVideoLoader` handle pre-buffering.

## 💎 Coding Standards (BTS)

1.  **Strict Typing**: All new files must use `.tsx`. Avoid `any`.
2.  **CSS Modules**: Use `.module.css` for clock art; Tailwind for UI.
3.  **Semantic SEO**: Wrap clock face content in `<time dateTime={...}>`.
4.  **No Direct DOM**: Avoid `document.querySelector`. Use `useRef` for canvas/animations.
5.  **Clean Up**: Always clear `setTimeout`, `setInterval`, and `requestAnimationFrame` on unmount.

## 🛠️ CLI Operations

*   `npm run type-check`: Validates project-wide types.
*   `npm run audit:fonts`: Runs the font usage audit script.
*   `npm run test:run`: Executes Vitest suite.

## 📂 Directory Map
*   `src/pages/YYYY/YY-MM/YY-MM-DD/`: Location for daily clock modules.
*   `src/utils/`: Core logic (Hooks, Asset Loaders).
*   `src/assets/fonts/2025/`: Standard location for daily typefaces.

---
Guidance provided by Cubist Heart Laboratories.
