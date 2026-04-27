# BorrowedTime: Development History

This document tracks the technical progress and architectural shifts of the project since inception.

## 🟢 The HTML Roots (Pre-V1)
- **Format**: Individual `.html` files.
- **Styling**: Inline CSS and global stylesheets.
- **Logic**: Vanilla JavaScript `setInterval` for time updates.
- **Constraint**: Heavy layout shifts and no shared navigation.

## 🟡 The Component Pivot (V1.0)
- **Framework**: Migration to React 18 + Vite.
- **Routing**: React Router v6 introduced to handle daily paths.
- **Registry**: Centralized metadata into `clockpages.json`.
- **Standardization**: Formalized the "BorrowedTime Technical Standard" (BTS) for all future modules.

## 🟠 Performance & Asset Hardening (V1.5)
- **Font Loading**: Developed `useSuspenseFontLoader` to eliminate "Flash of Unstyled Content" (FOUC).
- **Preloading**: Implemented an overlay-based loading system that waits for videos and images to buffer before revealing the art.
- **RAF Engine**: Switched from `setInterval` to `requestAnimationFrame` in `useClockTime` for perfectly synced 60fps rendering.
- **Semantic Refactor**: Migrated to `<main>` and `<time>` tags for accessibility and SEO.

## 🔵 Modern Architecture (Current)
- **Type Safety**: Ongoing migration from JS to **TypeScript**.
- **Scoped Styles**: Adoption of **CSS Modules** to isolate daily designs and prevent global style collisions.
- **Automation**: Full implementation of `import.meta.glob` for zero-config asset delivery in daily clocks (pioneered in 26-04-27).

## 🏗️ Technical Debt & Optimization Focus
- **Phase 1: Legacy Liquidation**: Remove all `.jsx` templates and unused test JSON files. (IN PROGRESS)
- **Phase 1.5: Dependency Purge**: Move backend/heavy libraries (Puppeteer, MongoDB, Express) to `devDependencies` to protect bundle size.
- **Phase 2: Semantic Retrofit**: Update 2025 components (starting with 25-04-25) to use the `<time>` tag and CSS Modules.
- **Phase 3: Hook Migration**: Replace manual `FontFace` loading in older components with `useSuspenseFontLoader`.
- **Phase 4: Asset Efficiency**: Implementing automated WebP conversion for the daily image pipeline to improve LCP (Largest Contentful Paint).

*Last Updated: 2026-04-27 - Audit Completed*
