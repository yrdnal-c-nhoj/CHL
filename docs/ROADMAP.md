# BorrowedTime Development Roadmap

Last reviewed: 2026-09-17

This is the single source of truth for BorrowedTime project health, standards,
and the concrete plan to reach them. It supersedes scattered notes in
`docs/STATUS.md`, GitHub issues, and commit messages.

- **Contract:** `docs/CLOCK_STANDARDS.md`
- **Performance budgets:** `docs/PERFORMANCE.md`
- **Live status / test results:** `docs/STATUS.md`
- **Architecture / templates:** `src/templates/BaseClock.tsx`

---

## 1. Project Overview

**BorrowedTime** is a daily digital art project that publishes a unique clock
design every day. It is a React + TypeScript + Vite single-page application
with heavy creative use of Canvas, Three.js
(@react-three/fiber + drei), custom fonts, and date-based routing (`/YY-MM-DD`).

The project values artistic freedom, performance, and accessibility. The
`CLOCK_STANDARDS.md` exists to keep the fleet of daily clock pages consistent
and maintainable.

---

## 2. Current State (2026-09-17)

### Strengths
- Modern stack: React 19, Vite 7, TypeScript 5.9, strict TS options
- Clear clock contract and template architecture
- Good performance budgets and CI intent
- Security-conscious dependency management
- Strong accessibility requirements in contract

### Critical Gaps
| Area | State | Impact |
|---|---|---|
| Tests | ✅ Pass (115 tests) | — |
| Lint (full fleet) | ❌ Failed (legacy debt) | Hundreds of legacy clock violations |
| Lint (26-09 clocks) | ✅ Pass | Recent clocks clean |
| TypeScript (full fleet) | ❌ Failed (legacy debt) | Thousands of legacy errors |
| TypeScript (in-scope, tsconfig.ci.json) | ✅ Pass | `npm run type-check` clean |
| Clock verification (full fleet) | ❌ Failed (legacy debt) | 397/534 clocks violate contract |
| Clock verification (changed) | ✅ Pass | Recent changes verified |
| Three.js bundle | ~190KB br (target <150KB) | Misses performance budget |
| Consistency | Fleet-wide drift | Hundreds of clocks, uneven enforcement |

### Quick Metrics
- **Clocks:** 2025 full year + 2026 Jan–Aug + **2026-09 (17 clocks, through 26-09-17)**
- **Test files:** 16 files, 115 tests passing
- **Lint problems (full):** ~2400 (legacy); **26-09 clocks: 0 errors**
- **TypeScript errors (full fleet):** thousands; **in-scope (tsconfig.ci.json): 0**
- **Status doc:** Manually maintained; `scripts/generate-status.js` does not exist

---

## 3. Standards (Summary)

The authoritative lists live in `docs/CLOCK_STANDARDS.md` and `docs/PERFORMANCE.md`.

### Non-negotiable rules for every clock
1. **File pair:** `Clock.tsx` + `Clock.module.css` in the date folder
2. **Time hooks:** `useClock` or `useSmoothClock` from `@/utils/hooks` only
3. **Styling:** CSS Modules for static styles; inline only for dynamic values
4. **Accessibility:** semantic `<time>` with `dateTime` + screen-reader-only copy
5. **Height:** `100dvh` for full-height containers
6. **Assets:** export used assets via `assets` array; fonts TTF/OTF/WOFF2 allowed, max 2 families
7. **Memoization:** `useMemo` only for genuinely expensive work; never read `ref.current` inside
8. **Index access:** guard against `undefined` under `noUncheckedIndexedAccess`
9. **No prohibited patterns:** no `setInterval`, `requestAnimationFrame`, `useGlobalStyles`, inline `<style>` tags, `any`

### Performance budgets (highlights)
- Initial JS: `< 150KB` gzipped
- Three.js: `< 150KB` gzipped *(currently over)*
- Clock page chunk: `< 50KB` gzipped
- Images: `< 200KB`; video: `< 2MB`

---

## 4. Roadmap

### Phase 0: Immediate Stabilization (1–3 days, High Priority) — **COMPLETED**

| # | Action | Status |
|---|---|---|
| 0.1 | Isolate tests: add `.kilo/` and worktrees to Vitest `test.exclude` or delete stale worktrees | ✅ Done (tests pass) |
| 0.2 | Re-run `npm run test:run` until green or isolate remaining failures | ✅ Done (115 tests pass) |
| 0.3 | Restore `scripts/generate-status.js` to regenerate `docs/STATUS.md` | ⏸️ Deferred; status now manual |
| 0.4 | Restore `scripts/verify-all-clocks.js` against `CLOCK_STANDARDS.md` rules | ✅ Done (active, used in CI) |
| 0.5 | Fix `react-hooks/refs` violation in `26-08-24/Clock.tsx:134` | ⏳ Legacy; tracked in Phase 1 |
| 0.6 | Guard indexed access in `26-08-23/Clock.tsx` and `26-08-28/useMazeRenderer.ts` | ⏳ Legacy; tracked in Phase 1 |
| 0.7 | Update CI to surface lint/type results; keep tests+build hard-gated | ✅ Done (CI uses type-check, verify:clocks:changed) |
| 0.8 | Commit clean baseline and update `docs/STATUS.md` | ✅ Done |

### Phase 1: Quality Foundation (1–2 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 1.1 | Run `npm run lint:fix` where safe; remove `any` and non-null assertions in clusters | — | M | Lint error count drops materially |
| 1.2 | Enable stricter ESLint rules on new files; track legacy relaxations | — | M | **DONE** — eslint config enforces `@typescript-eslint/no-explicit-any: error`, `no-non-null-assertion: error`, `no-unused-vars: error` for `src/pages/2026/26-09/**` |
| 1.3 | Adopt `tsconfig.ci.json` progressively; target zero new errors on new clocks | — | M | **DONE** — tsconfig.ci.json excludes legacy months explicitly; `npm run type-check` passes |
| 1.4 | Wire `verify-all-clocks.js` into CI / pre-commit | — | S | **DONE** — CI runs `verify:clocks:changed` |
| 1.5 | Update `CLOCK_STANDARDS.md` to match current hook names and React 19 patterns | — | S | ⏳ Pending (hook names correct; React 19 patterns in use) |
| 1.6 | Fix test harness: wrap context-provider-dependent tests in real providers | — | M | Tests currently pass |
| 1.7 | Add 3–5 golden-path tests for recent clocks and routing/data layer | — | M | ⏳ Future |
| 1.8 | Address Three.js bundle: lazy-load or split `@react-three/drei` | — | M | ⏳ Planned |

### Phase 2: Process & Automation (2–4 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 2.1 | Build `npm run new-clock YYYY-MM-DD` generator from `BaseClock.tsx` | — | M | New clocks are contract-compliant by construction |
| 2.2 | Add GitHub Action / pre-commit hook that runs `verify-all-clocks.js` | — | M | Bad clocks blocked before merge |
| 2.3 | Expand `README.md` with architecture overview, adding-a-clock guide, and links to docs | — | S | Onboarding is fast |
| 2.4 | Make `docs/STATUS.md` auto-generated and treat as single source of truth | — | M | Requires `generate-status.js` implementation |
| 2.5 | Add bundle-size checks to CI (fail if budgets exceeded) | — | M | Budgets enforced |
| 2.6 | Add Dependabot / Renovate for dependency updates | — | S | Security and freshness |
| 2.7 | Run Lighthouse / axe spot-checks on a sample of clocks | — | M | A11y gaps quantified |

### Phase 3: Sustainability & Debt Retirement (1–2 months)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 3.1 | Treat 2025 fleet as legacy; document and freeze | — | S | Scope bounded |
| 3.2 | Migrate 2026 clocks month-by-month to contract compliance | — | L | Debt reduces monotonically |
| 3.3 | Track compliance % in `docs/STATUS.md` | — | S | Progress is visible |
| 3.4 | Enforce image/font budgets in verify script or build step | — | M | Performance protected |
| 3.5 | Add Conventional Commits + lint-staged pre-commit hook | — | S | History is readable |
| 3.6 | Evaluate further shared logic extraction across clocks | — | M | Maintenance burden drops |
| 3.7 | Monitor Core Web Vitals on live site | — | M | Real-user performance tracked |

---

## 5. Success Criteria

- `npm run test:run`, `npm run type-check`, and `npm run verify:clocks:changed` are green
- `npm run lint` on recent (26-09+) clocks is green; full fleet debt is tracked
- Three.js and initial bundles meet documented budgets, or budgets are consciously revised
- New clocks are contract-compliant by construction
- `docs/STATUS.md` accurately reflects reality after every significant change
- Live site remains performant and accessible

---

## 6. Contribution & Workflow

1. Read `docs/CLOCK_STANDARDS.md` before adding or modifying a clock.
2. Run `npm run lint`, `npm run test:run`, `npm run type-check`, and `npm run build` before opening a PR.
3. Use `npm run new-clock YYYY-MM-DD` once available; otherwise follow the file structure in the contract.
4. Do not bypass lint or test failures; fix or track them explicitly.

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| `docs/CLOCK_STANDARDS.md` | Clock component structure, hooks, styling, and prohibited patterns |
| `docs/PERFORMANCE.md` | Asset budgets, cache headers, compression, chunk limits |
| `docs/STATUS.md` | Live check results, test details, lint details, clock inventory, known gaps |
| `src/templates/BaseClock.tsx` | Canonical clock template and shared structure |
| `src/utils/hooks/` | Time hooks (`useClock`, `useSmoothClock`) |
| `src/components/SRTime.tsx` | Shared screen-reader-only time component |