# Project AI Instructions

## Project Principle

BorrowedTime is both software and a historical digital-art archive. **September 2026 is the current architectural boundary.** New work follows the current architecture; historical clocks are not rewritten merely to make the archive uniform.

## Required Reading

Before editing, read:
- `docs/ARCHITECTURE.md`
- `docs/CLOCKS.md` for clock work
- `docs/PERFORMANCE.md` for assets, fonts, media, loading, or bundle work

Use `docs/CONTRIBUTING.md` for the human contribution workflow.

## Before Editing

1. Identify the target clock, shared module, or tooling.
2. Determine whether it is historical or current.
3. Inspect the existing implementation and relevant shared utilities.
4. Search for an existing current-project pattern before introducing a new one.
5. Make the smallest complete change that preserves intended behavior.

## Current Clock Rules

- Use React + TypeScript + Vite patterns already established by the project.
- Keep artwork-specific implementation local to its date directory.
- Use shared time hooks and infrastructure.
- Export every imported image, font, and media asset through the clock's `assets` array.
- Use CSS Modules for static styles; inline styles only for genuinely dynamic values.
- Do not use Tailwind for new work.
- Avoid fixed-pixel layout dimensions; prefer `dvh`, `vw`, `vmin`, `rem`, `%`, and `fr`.
- Provide semantic time/accessibility output.
- Provide an appropriate `prefers-reduced-motion` treatment for animated clocks.
- Do not introduce scrolling unless the artwork requires it.
- Do not add dependencies when existing infrastructure is sufficient.

## Timekeeping

Use `useClock` or `useSmoothClock`.

Do not use `setInterval`, `setTimeout`, `Date.now()`, or a manual `requestAnimationFrame` loop as an independent source of displayed clock time.

A Three.js/WebGL render loop is allowed when it only renders frames and the displayed time comes from the shared clock infrastructure.

## Historical Code

Do not broad-refactor historical clocks. Modify them only for a concrete reason such as:
- production breakage;
- build/deployment failure;
- security;
- serious accessibility issues;
- shared-infrastructure incompatibility;
- material browser/performance failure.

## Assets

Keep assets in established directories. Do not rename historical assets or introduce unexplained root-level media. Check asset size and format against `docs/PERFORMANCE.md`.

## Validation

Run the checks appropriate to the change. For a new or substantially changed current clock, normally run:

```bash
npm run type-check
npm run lint
npm run test:run
npm run verify:clocks:changed
npm run build
```

Run a browser/visual smoke check for clock changes.

Never claim a check passed unless it was actually run. Record pre-existing failures accurately.

## Change Discipline

Prefer small, focused changes. Do not modify unrelated clock implementations. Shared infrastructure should remain compatible with the archive where reasonably possible.
