# CHL Current Status

Last reviewed: 2026-08-25

This file is the current source of truth for repository health. Historical audit
reports live in `docs/archive/`.

## Live Check Summary

These results are from local checks run on 2026-08-25.

| Check | Command | Result |
|---|---|---|
| Clock standards | `node scripts/verify-all-clocks.js` | 510 clocks, 176 fully compliant, 334 need work, 119 critical violations, 2,435 total violations |
| Production build | `npm run build` | Passes, with warnings |
| Tests | `npm run test:run` | Fails: 7 failed / 106 total tests |
| Lint | `npm run lint` | Fails: 841 errors, 1,732 warnings |

## Current Interpretation

The application builds, but the repository is not yet clean. The most important
delivery risks are failing tests, lint noise, unresolved build warnings, and
remaining clock fleet compliance debt.

The current test and lint numbers are inflated by files under `.kilo/worktrees/`.
If those worktrees are not part of the product, `vitest.config.js` and
`eslint.config.js` should explicitly exclude them.

## Build Warnings To Address

- Duplicate JSX `className` attributes in several clock components.
- Deprecated Vite `import.meta.glob({ as: 'url' })` usage. Use
  `query: '?url', import: 'default'` instead.
- Unresolved asset/font paths that remain as runtime URLs.
- Brotli output paths appearing as `dist//Users/john/Desktop/CHL/...`, which
  suggests compression output path handling should be reviewed.

## Priority Order

1. Exclude non-product worktrees and generated folders from test/lint discovery.
2. Fix the failing product tests after discovery is scoped correctly.
3. Remove duplicate `className` attributes and unresolved build-time asset URLs.
4. Update Vite glob URL imports to the current `query` syntax.
5. Continue reducing clock standards debt, starting with the 119 critical
   violations.

## Related Docs

- Technical standards: `src/templates/ARCHITECTURE.md`
- Historical reports: `docs/archive/`
