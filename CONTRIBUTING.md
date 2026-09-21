# Contributing to BorrowedTime

BorrowedTime is an ongoing digital-art project. Contributions should preserve the distinction between current engineering standards and the historical clock archive.

## Before You Change Code

1. Identify the exact clock, shared module, or tooling being changed.
2. Determine whether it is historical or within the September 2026 current boundary.
3. Read the relevant contract:
   - `docs/ARCHITECTURE.md`
   - `docs/CLOCKS.md`
   - `docs/PERFORMANCE.md`
4. Inspect an existing current implementation before introducing a new pattern.
5. Prefer the smallest complete change.

## Adding a Clock

Use the date-based structure:

```text
src/pages/YYYY/YY-MM/YY-MM-DD/
  Clock.tsx
  Clock.module.css
```

Keep the visual implementation local. Use shared hooks and utilities rather than creating parallel infrastructure.

Register all imported assets in the exported `assets` array.

## Validation

Run the checks appropriate to the change. For a new clock, the normal baseline is:

```bash
npm run type-check
npm run lint
npm run test:run
npm run verify:clocks:changed
npm run build
```

Also perform a browser/visual smoke check for the clock itself.

If a check fails because of pre-existing legacy debt, identify that accurately rather than bypassing or hiding it.

## Historical Clocks

Do not mass-refactor historical clocks merely to make the repository uniform. Change them when there is a concrete production, security, accessibility, deployment, or shared-infrastructure reason.

## Dependencies and Assets

Avoid adding dependencies when existing project utilities are sufficient. Keep media local and follow the performance budgets. Do not rename historical assets without a specific reason.

## Pull Requests

A useful change description should state:

- what changed;
- why it changed;
- which files were affected;
- which validation commands were run;
- any known failures or follow-up work.

Keep unrelated refactors out of a focused change.
