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
- [ ] **Phase 2.5: BTS Enforcement**: Implement a CLI tool to audit `Clock.tsx` files for `useClockTime` and `<time>` tag compliance.
- **Phase 4: Asset Efficiency**: Implementing automated WebP and WOFF2 conversion for the daily image/font pipeline to improve LCP (Largest Contentful Paint).

*Last Updated: 2026-04-27 - Global Audit & BTS Refactor Phase 1 Completed*
