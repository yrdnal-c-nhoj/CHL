# Current Clock Contract

Last reviewed: 2026-09-21

This document defines the engineering contract for new and actively maintained clocks. It applies from the September 2026 architectural boundary forward.

## Scope

- **September 2026 onward:** current contract applies.
- **Before September 2026:** historical implementations are generally preserved.
- A historical clock may be changed when a concrete production, security, accessibility, deployment, or shared-infrastructure issue requires it.

Do not weaken the current contract to accommodate legacy artwork.

## Required Structure

A current clock normally contains:

```text
src/pages/YYYY/YY-MM/YY-MM-DD/
├── Clock.tsx
├── Clock.module.css
└── optional local helpers
```

CSS Modules are the default for static styling. A clock may omit a module stylesheet only when its implementation genuinely does not need static CSS.

## Component Contract

Every current clock must:

- export a default React component;
- set a date-specific `Clock.displayName`;
- export an `assets` array containing imported assets used by the clock;
- use the shared clock/time infrastructure;
- provide a semantic `<time>` representation or the shared `SRTime` component;
- use strict TypeScript for in-scope code;
- avoid unnecessary dependencies.

## Assets

- Import local assets from the established asset directories.
- Register every image, font, video, and other loaded local asset in `assets`.
- Do not introduce unexplained root-level media files.
- Prefer WebP/AVIF for raster images and WOFF2 for fonts when suitable.
- Follow the limits in `docs/PERFORMANCE.md`.
- Do not rename or move existing historical assets merely to satisfy current conventions.

## Time

Use `useClock` for normal once-per-second clock displays and `useSmoothClock` when sub-second movement is visibly required.

Do not use `setInterval`, `setTimeout`, `Date.now()`, or a manual `requestAnimationFrame` loop as an independent source of displayed clock time.

A Three.js/WebGL render loop is permitted when it is used only to render frames and the clock value comes from the shared time infrastructure.

## Accessibility

Provide a semantic time value that assistive technology can interpret. Use a valid ISO `dateTime` value.

Artwork that is purely decorative should not create redundant accessible content. Meaningful images require useful alternative text.

## Motion

Animated clocks should provide an appropriate `prefers-reduced-motion: reduce` treatment. The treatment may pause, simplify, slow, or otherwise reduce non-essential motion while preserving access to the time.

## Responsive Layout

Current clocks must work across:

- desktop;
- mobile portrait;
- mobile landscape;
- tablet-sized viewports where applicable.

Do not introduce page scrolling unless the artwork explicitly requires it.

Prefer `dvh`, `vw`, `vmin`, `rem`, `%`, and `fr` for responsive layout. Fixed pixels are acceptable for deliberately sized visual details, not as the default layout system.

## Styling

- CSS Modules for static styles.
- Inline styles only for genuinely dynamic values such as computed transforms or imported asset CSS variables.
- No Tailwind for new clocks.
- No inline `<style>` injection.
- No global body/head mutation from a clock.
- Keep artwork-specific styles local.

## Verification

For current clocks, use the relevant project checks:

```bash
npm run type-check
npm run lint
npm run test:run
npm run verify:clocks:changed
npm run build
```

Not every change requires every command, but a completed implementation must report which checks were actually run. Never claim an unrun check passed.

## Principle

Current clocks should share a stable engineering contract without being visually standardized. The architecture constrains reliability and maintainability, not artistic expression.
