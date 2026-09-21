# Clock Standards

> **Compatibility note:** The authoritative contract for current clocks is [docs/CLOCKS.md](./CLOCKS.md).
>
> This document is retained as a compatibility/reference page for older documentation and existing workflows. It must not define rules that differ from CLOCKS.md.

## Authority

Use the project documentation hierarchy as follows:

1. [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — overall architecture and historical/current boundary.
2. [docs/CLOCKS.md](./CLOCKS.md) — authoritative contract for current clock implementations.
3. [docs/PERFORMANCE.md](./PERFORMANCE.md) — performance requirements and budgets.
4. [docs/AI_DEVELOPMENT_GUIDE.md](./AI_DEVELOPMENT_GUIDE.md) — AI development workflow.
5. This document — compatibility/reference material only.

If this document conflicts with CLOCKS.md, **CLOCKS.md wins**.

## Current Clock Contract

The current contract applies from the September 2026 architectural boundary forward.

- Current clocks are under `src/pages/YYYY/YY-MM/YY-MM-DD/`.
- Current clocks normally contain `Clock.tsx` and `Clock.module.css`; the stylesheet may be omitted when genuinely unnecessary.
- Current clocks use the shared clock/time infrastructure.
- Current clocks export an `assets` array containing imported local assets used at runtime.
- Current clocks provide semantic time information.
- Current clocks use strict TypeScript.
- CSS Modules are the default for static styling.
- Tailwind is not used for new clocks.
- Avoid unnecessary dependencies and global style mutations.

See [docs/CLOCKS.md](./CLOCKS.md) for the complete contract.

## Timekeeping vs. Rendering

This distinction is important for both implementation and automated verification.

### Clock timekeeping

The displayed clock time must come from the shared time infrastructure:

- `useClock` for normal once-per-second displays.
- `useSmoothClock` when visibly smooth/sub-second movement is required.

Do not create an independent displayed-time source with:

- `setInterval`;
- `setTimeout`;
- `Date.now()`;
- `new Date()` used to calculate displayed clock time independently;
- `performance.now()` used as an independent clock source.

### Rendering

A rendering loop is not itself a prohibited timing mechanism.

`requestAnimationFrame` is permitted for visual rendering and animation, including Three.js/WebGL render loops, **provided the displayed clock value comes from the shared clock infrastructure**.

For implementation details, follow docs/CLOCKS.md and the current shared hook implementations.

## Accessibility

Current clocks should provide a semantic time value with a valid ISO `dateTime` value.

Use the shared `SRTime` component where appropriate. Check its current export API before importing it.

Meaningful images need useful alternative text. Decorative artwork should not create redundant accessible content.

## Styling

Current clocks should:

- use CSS Modules for static styles;
- use inline styles only for genuinely dynamic values;
- avoid inline `<style>` injection;
- avoid global body/head mutations;
- keep artwork-specific styles local.

Responsive layouts should follow the guidance in docs/CLOCKS.md.

## Assets and Performance

Register imported local runtime assets in the clock's `assets` export.

Do not impose asset format or size rules here. The authoritative requirements live in docs/PERFORMANCE.md, and current clock requirements live in docs/CLOCKS.md.

Historical assets and implementations should not be changed merely to conform to current conventions.

## Historical Clocks

The project contains a large historical archive.

Earlier clocks are preserved unless a concrete production, security, accessibility, deployment, or shared-infrastructure issue requires a change.

Do not use this document as justification for broad historical refactoring.

## Verification

Use the current project verification commands documented in docs/CLOCKS.md:

```bash
npm run type-check
npm run lint
npm run test:run
npm run verify:clocks:changed
npm run build
```

Run the smallest relevant checks for the change and report only checks that were actually run.

## Legacy Material

Older examples, implementation details, and optimization advice previously contained in this file are intentionally removed from this compatibility page because they duplicated or contradicted the current contract.

For implementation examples, inspect current clocks in the repository and follow docs/CLOCKS.md rather than treating an old example here as canonical.

---

**Last reviewed:** 2026-09-21  
**Status:** Compatibility/reference document; docs/CLOCKS.md is authoritative.
