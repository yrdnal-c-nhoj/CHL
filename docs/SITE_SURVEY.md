# BorrowedTime (CHL) — Site Survey & Evaluation

> **Historical snapshot (2026-05-20).** For current workflow, registry policy, and commands, use **[`DEVELOPMENT.md`](./DEVELOPMENT.md)** — the single source of truth. Metrics and CI status below may be outdated.

**Survey date:** 2026-05-20  
**Live site:** [cubistheart.com](https://www.cubistheart.com)  
**Repository:** [yrdnal-c-nhoj/CHL](https://github.com/yrdnal-c-nhoj/CHL)

Point-in-time survey of development status, gaps vs state-of-the-art practice, deletion candidates, and optimization priorities.

---

## Executive summary

BorrowedTime is a **mature, production-deployed digital art clock archive** (~425 daily clock modules) on a **solid modern stack** (React 18, Vite 7, TypeScript, registry-driven routing). Core architecture is coherent and shippable.

The main gaps vs “state-of-the-art” are **asset weight** (~268 MB fonts + images in repo), **incomplete standards migration** (137 clocks still use raw `setInterval`), **missing automation scripts** referenced in docs, **CI that does not run type-check or tests**, and **no performance/a11y regression suite** (Lighthouse, visual diff).

Prior work ([repo audit session](8c6df15f-be3e-4e69-b45e-5271afd3640c)) fixed runtime/docs drift (entrypoint, `.env.example`, GA env naming, Docker Node 24, GitHub CI templates). This survey extends that with **live asset metrics** and a **forward roadmap**.

---

## Where the project is today

| Area | Status | Notes |
|------|--------|-------|
| **Product** | Strong | Daily clocks, archive navigation, live deployment |
| **Architecture** | Strong | `clockpages.json` + `import.meta.glob` code-splitting |
| **TypeScript** | Good / mixed | Clock pages are `.tsx`; core has type-check errors; `strict: true` in `tsconfig` |
| **Time hooks** | In progress | ~151 clocks use `useClockTime`; ~137 still use `setInterval` in page code |
| **Assets** | Heavy | ~40 MB fonts, ~228 MB images; 59% images not WebP |
| **CI** | Basic → improved | *At survey time:* lint + build only; *now:* see [`DEVELOPMENT.md#ci`](./DEVELOPMENT.md#ci-github-actions) |
| **Security** | Improved | High-severity npm advisories addressed in prior session |
| **Mobile UX** | Known issues | Blank pages / nav clipping reported in [mobile Chrome session](8a352ebf-1d67-4c3f-bc79-b0399746c531) |
| **PWA / offline** | Not implemented | No manifest or service worker despite historical README claims |
| **Docs** | Consolidated | *Now:* [`DEVELOPMENT.md`](./DEVELOPMENT.md) is canonical |

### Scale (2026-05-20)

| Metric | Value |
|--------|------:|
| `Clock.tsx` modules | 425 |
| Registry entries (`clockpages.json`) | 412 |
| Unregistered folders (exist, not in registry) | 13 |
| Font files | 331 (~40 MB) |
| Image files | 1,094 (~228 MB) |
| Production JS chunk `three` (brotli) | ~154 KB |
| Production framework chunk (brotli) | ~39 KB |

### Registry integrity

**13 clock folders are not registered** (reachable only via direct path if routed, not in list/archive UX):

- `25-04-01`
- `26-01-26`
- `26-05-21` … `26-05-31` (11 May 2026 clocks)

**0 registry entries** point to missing folders.

---

## Where it should be (state-of-the-art target)

For a daily-published creative web app at this scale, a reasonable “state-of-the-art” bar:

1. **Correctness:** `type-check` + tests in CI; registry ↔ folder parity enforced.
2. **Performance:** Per-clock budgets enforced; WebP-first assets; lazy heavy libs (Three.js) only on pages that need them.
3. **Standards:** 100% new/edited clocks on `useClockTime` / `useSmoothClock`; no raw `setInterval` in clock pages.
4. **Quality gates:** `finalize` contract + optional Lighthouse CI on representative routes.
5. **Hygiene:** Audited unused assets removed; docs match runnable commands.
6. **Accessibility & mobile:** Viewport-safe nav; no blank routes on mobile Chrome; semantic `<time>` everywhere.
7. **Observability:** Error boundary + optional client error reporting (non-blocking).

---

## Asset deletion recommendations

> **Rule:** Run `npm run audit:fonts` and `npm run audit:images`, review reports, then delete in small PRs. Heuristic scans can miss dynamic path construction—spot-check before bulk delete.

### Safe-first deletes (high confidence)

| Category | Count | Action |
|----------|------:|--------|
| Unused fonts (heuristic) | 7 | Delete after visual grep confirm |
| Misplaced JSX under `assets/images/` | 2 | Move or remove (`x.jsx`, `MedievalSVG.jsx`) |
| Broken doc-only scripts | — | Removed `standardize:fonts` from `package.json` until script exists |

**Unused fonts (candidate list):**

- `src/assets/fonts/2025/25-09-14-swi.ttf`
- `src/assets/fonts/2025/25-06-20-inde1.ttf`
- `src/assets/fonts/2025/25-05-20-fla.ttf`
- `src/assets/fonts/2025/25-06-20-inde2.ttf`
- `src/assets/fonts/2026/26-03-02-ripple.ttf`
- `src/assets/fonts/2026/26-03-01-270west.ttf`
- `src/assets/fonts/2026/26-05-07-droplet.ttf`

### Review-before-delete (medium confidence)

| Category | Count | Action |
|----------|------:|--------|
| Unused images (heuristic) | 149 | Review `unused-images-only-report.txt`; delete in batches by month |
| Non-standard font names | 12 | Rename via manual/script to `YY-MM-DD-name.ext` (do not delete) |

### Do not delete without migration plan

| Category | Count | Action |
|----------|------:|--------|
| Legacy JPG/PNG/GIF (still referenced) | ~446+ | Convert to WebP with `npm run optimize:images`, update imports |
| Archive clock source under `src/pages/` | 425 | Required for site; optimize per-page bundles instead |

### AGENTS.md note

Earlier sprint text cited **270 unused fonts**. A fresh heuristic scan finds **7 unused** and **12 non-standard names**. Treat **270** as stale; re-run audits after each cleanup pass and update `AGENTS.md`.

---

## Optimization recommendations

### 1. Images (highest ROI)

- **648** image files are not WebP (~59% of image count).
- Run `npm run optimize:images` on staged folders; update clock imports to `.webp`.
- Target: align with BTS rule (keep descriptive names for images; prefix fonts with dates).
- Expected repo savings: tens of MB+ depending on JPEG quality.

### 2. Fonts

- Repo fonts ~40 MB for 331 files; only 7 flagged unused.
- Enforce naming: `YY-MM-DD-name.{ttf|otf|woff2}`.
- Prefer WOFF2 for new clocks where conversion is acceptable.
- Per-clock budget: **100 KB** (per `AGENTS.md`).

### 3. JavaScript bundles

- `three` chunk ~748 KB raw / ~154 KB brotli — ensure Three.js clocks are code-split (they are via dynamic imports; verify no accidental eager imports).
- Keep `manualChunks` strategy in `vite.config.ts`; run `npm run perf:analyze` when adding heavy deps.

### 4. Clock logic migration

- **137** clock files still reference `setInterval(`.
- Migrate to `useClockTime()` (1s) or `useSmoothClock()` (RAF) per `src/templates/ARCHITECTURE.md`.
- Prioritize 2026 clocks and any clocks touched for bugs.

### 5. CI / quality

- Add to `.github/workflows/ci.yml`: `npm run type-check`, `npm run test:run`.
- Fix local ESLint config if `@typescript-eslint` plugin resolution fails in clean installs.
- Add registry parity check script (folder date ∈ `clockpages.json`).

### 6. Mobile

- Re-test routes from [mobile session](8a352ebf-1d67-4c3f-bc79-b0399746c531): viewport, `100dvh`, nav safe-area, font loading timeouts.
- Add one Playwright mobile smoke test for `/` and today’s clock path.

---

## Documentation updates (this survey)

| File | Change |
|------|--------|
| `docs/SITE_SURVEY.md` | **Created** — this survey |
| `ROADMAP.md` | **Updated** — phased plan with asset/CI/mobile work |
| `AGENTS.md` | **Updated** — sprint metrics from live audit |
| `scripts/audit-fonts.mjs` | **Created** — restores `npm run audit:fonts` |
| `scripts/audit-images.mjs` | **Created** — restores `npm run audit:images` |
| `package.json` | **Updated** — audit script paths |

### Still missing vs README

| Command | Status |
|---------|--------|
| `npm run clock:new` | **Restored** — scaffolds files only; **does not** edit `clockpages.json` |
| Registry | **Always manual** — see [`DEVELOPMENT.md`](./DEVELOPMENT.md) |

---

## Health check snapshot (at survey time)

| Check | Result (2026-05-20) |
|-------|--------|
| `npm run build` | Pass |
| `npm run type-check` | Fail (core errors; since fixed — run locally) |
| `npm run lint` | Fail locally (since fixed — run locally) |
| `npm run audit:fonts` | Restored via new script |
| `npm run audit:images` | Restored via new script |

**Current checks:** [`DEVELOPMENT.md#commands`](./DEVELOPMENT.md#commands)

---

## Related conversations

| Topic | Transcript |
|-------|------------|
| Repo/docs/tooling audit + fixes | [8c6df15f-be3e-4e69-b45e-5271afd3640c](8c6df15f-be3e-4e69-b45e-5271afd3640c) |
| Mobile Chrome layout | [8a352ebf-1d67-4c3f-bc79-b0399746c531](8a352ebf-1d67-4c3f-bc79-b0399746c531) |

---

*Cubist Heart Laboratories*
