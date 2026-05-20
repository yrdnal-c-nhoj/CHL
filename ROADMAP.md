# BorrowedTime Roadmap

Phased backlog from the [site survey](./docs/SITE_SURVEY.md) (2026-05-20).

**Canonical workflow and policy:** [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) — not this file.

---

## Phase 0 — Truth & tooling (1–2 days)

**Goal:** Every documented command works; CI reflects real quality bar.

- [x] Restore `npm run clock:new` (scaffold only — **manual** `clockpages.json` registration).
- [x] Add CI steps: `npm run type-check`, `npm run test:run`.
- [x] Fix ESLint flat-config (`@typescript-eslint` plugin registration).
- [x] Core `type-check` via `tsconfig.ci.json` (excludes `src/pages/**` archive).
- [x] Run `npm run audit:fonts` and `npm run audit:images`; report artifacts gitignored (regenerate locally).
- [ ] **Manual only:** Register unlisted clocks in `clockpages.json` when you choose (never automated) — not a Phase 0 gate; see deliverables.

**Verify:** `npm ci && npm run lint && npm run type-check && npm run test:run && npm run build` — **passed 2026-05-20**

**Phase 0 status:** Complete (registry parity for 13 clocks remains manual — start Phase 1 or register when ready).

---

## Phase 1 — Asset hygiene (1–2 weeks)

**Goal:** Smaller repo, faster clones, predictable naming.

### Delete (after audit review)

- [x] Remove **7 unused fonts** listed in `unused-fonts-report.txt`.
- [ ] Remove **unused images** in batches from `unused-images-only-report.txt` (start with oldest months).
- [ ] Remove misplaced `src/assets/images/**/{x.jsx,MedievalSVG.jsx}` or relocate to `src/components/`.

### Rename (do not delete)

- [ ] Fix **12 non-standard font filenames** → `YY-MM-DD-name.ext` (`non-standard-fonts.txt`).

### Optimize (keep files, change format)

- [ ] Convert legacy JPG/PNG/GIF → WebP (`npm run optimize:images`), update imports per month.
- [ ] Track progress: target **0 non-WebP** for newly touched clocks.

**Verify:** Re-run audits; repo size trend down; sample clocks load correctly in `npm run preview`.

---

## Phase 2 — Clock standards migration (ongoing)

**Goal:** BTS time and font rules applied consistently.

- [ ] Migrate **137** clocks from raw `setInterval` → `useClockTime` / `useSmoothClock` (prioritize 2026 pages).
- [ ] New/edited clocks: `.tsx` only, `useSuspenseFontLoader`, CSS Modules, `<time dateTime>`.
- [ ] Extend `npm run finalize` with `--contract-only` for CI (exports, hooks, asset naming).

**Verify:** `rg setInterval src/pages` trends to zero; finalize passes on template + 3 representative clocks.

---

## Phase 3 — Performance & mobile (2–3 weeks)

**Goal:** Meet AGENTS performance budgets; fix known mobile regressions.

- [ ] Per-clock bundle check via `npm run perf:analyze` for Three.js / Pixi / heavy GSAP clocks.
- [ ] Lazy-load heavy libs only on routes that need them (audit eager imports).
- [ ] Mobile: fix blank routes and bottom nav clipping (see survey + prior mobile transcript).
- [ ] Add Playwright smoke: home, `/list`, one analog + one WebGL clock, mobile viewport.

**Verify:** Lighthouse mobile ≥ 90 on `/` and one representative clock; nav visible on iOS Chrome.

---

## Phase 4 — State-of-the-art quality gates (later)

**Goal:** Prevent regressions automatically.

- [ ] Unify preload contract (images vs video/audio) in `useClockPage` + docs.
- [ ] Lighthouse CI workflow (baseline scores stored in repo).
- [ ] Optional visual regression on `/list` + 2 clock routes.
- [ ] Optional client error reporting from `ErrorBoundary`.
- [ ] PWA: only if product requires offline—add manifest + SW or remove claims from docs.

---

## Phase 5 — Documentation & DX (continuous)

- [ ] Single **Clock Module Contract** doc (link from README, `ARCHITECTURE.md`, `finalize` README).
- [ ] Keep `docs/SITE_SURVEY.md` updated quarterly or after major refactors.
- [ ] Script README under `scripts/` lists all runnable npm scripts truthfully.

---

## Quick reference — npm workflows

```bash
npm run dev
npm run clock:new             # scaffold only (manual registry)
npm run finalize              # validate + capture thumbnails
npm run audit:fonts
npm run audit:images
npm run type-check && npm run lint && npm run test:run && npm run build
```

Full command reference: [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md).

---

## Deliverables checklist

- [x] `docs/SITE_SURVEY.md` — evaluation snapshot
- [x] `ROADMAP.md` — this file
- [x] `scripts/audit-fonts.mjs`, `scripts/audit-images.mjs`
- [x] CI: type-check + tests
- [ ] Registry parity for 13 clocks
- [ ] Asset deletion PRs (fonts → images)
- [ ] `setInterval` migration tracking issue/label

---

*See also: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md), [src/templates/ARCHITECTURE.md](./src/templates/ARCHITECTURE.md)*
