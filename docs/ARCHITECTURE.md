# BorrowedTime Architecture

Last reviewed: 2026-09-21

## Overview

BorrowedTime is both a current web application and a growing historical archive of daily digital-art clocks. The architecture therefore has two responsibilities:

1. Keep the current application and shared infrastructure modern, maintainable, and testable.
2. Preserve older clock artworks without forcing historical implementations through today's standards.

## Architectural Boundary

**September 2026 is the current architectural boundary.**

| Scope | Policy |
|---|---|
| Before September 2026 | Historical / legacy archive |
| September 2026 onward | Current architecture |
| New clock | Must follow the current contract |
| Existing historical clock | Do not rewrite solely for consistency |
| Shared infrastructure | Must follow current architecture |

This boundary is a maintenance policy, not a visual style requirement. Historical clocks may use older JavaScript, CSS, hooks, or rendering techniques.

## Design Principles

- Preserve the artwork and its original behavior where practical.
- Keep current code clean rather than continuously migrating the archive.
- Prefer small, explicit abstractions over framework-wide indirection.
- Keep a clock's visual implementation local to its date directory.
- Extract code only when it is genuinely shared or independently testable.
- Separate timekeeping from visual rendering.
- Treat local images, video, fonts, and other media as part of the application architecture.
- Do not add dependencies when existing project infrastructure can solve the problem.

## Application Structure

```text
src/
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
│   └── YYYY/
│       └── YY-MM/
│           └── YY-MM-DD/
│               ├── Clock.tsx
│               ├── Clock.module.css
│               └── optional local helpers
├── templates/
├── types/
└── utils/
```

The date-based page structure is intentional: each daily artwork remains independently identifiable and maintainable.

## Clock Lifecycle

A new clock normally follows this sequence:

1. Create the date directory.
2. Add `Clock.tsx` and `Clock.module.css` when CSS Modules are appropriate.
3. Keep artwork-specific logic local.
4. Import and register every local asset used by the clock.
5. Use the shared clock/time infrastructure.
6. Provide an accessible representation of the current time.
7. Account for responsive layouts and reduced motion where animation is used.
8. Run the narrowest relevant verifier.
9. Run type-check, lint, tests, and build as applicable.
10. Perform a visual/browser smoke check.
11. Deploy through the canonical production path.

## Shared Infrastructure

Shared infrastructure includes time hooks, font and asset loading, routing, clock discovery, metadata, types, accessibility components, tests, and build/deployment tooling.

Shared code must remain compatible with the historical archive where reasonably possible. Do not weaken current standards merely to make old artwork conform.

## Timekeeping and Rendering

Clock time comes from the shared time infrastructure, such as `useClock` or `useSmoothClock`.

A rendering loop is not inherently timekeeping. WebGL/Three.js clocks may use `requestAnimationFrame` to render frames, provided displayed clock time is still derived from the shared time source. Do not create independent `setInterval`, `setTimeout`, or manual timing loops to maintain the clock value.

## Current vs Historical Code

Historical clocks are not automatically bugs because they violate a current rule.

Modify historical code when there is a concrete reason, such as:

- production breakage;
- build or deployment failure;
- security issue;
- serious accessibility problem;
- incompatibility with shared infrastructure;
- material performance or browser failure.

Otherwise, leave the historical implementation intact.

## Growth and Archive Sustainability

The archive grows continuously. Source assets, Git history, production build artifacts, and deployment output must therefore be monitored separately.

When repository or deployment size becomes materially limiting, evaluate external object storage/CDN delivery, archival builds, or separating the active application from older static artwork. Do not delete historical artwork merely to reduce repository size.

## Decision

The project intentionally uses a **forward-looking architecture with a preserved historical archive**. New work follows current standards; old work remains stable unless there is a concrete production reason to change it.
