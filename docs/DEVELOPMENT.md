# BorrowedTime — Development Guide (canonical)

**This is the single source of truth** for how to work in this repository. Other docs link here for workflow, registry policy, quality gates, and commands.

| Document                                        | Role                                           |
| ---------------------------------------------- | ---------------------------------------------- |
| **This file**                                   | Policy, workflow, commands, CI, registry rules |
| [`CLOCK_MODULE_CONTRACT.md`](./CLOCK_MODULE_CONTRACT.md) | Clock component requirements, exports, naming |
| [`README.md`](../README.md)                     | Project intro, stack, links                    |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md)           | Clock component patterns, hooks, CSS           |
| [`ROADMAP.md`](../ROADMAP.md)                   | Future phases and backlog only                 |
| [`SITE_SURVEY.md`](./SITE_SURVEY.md)             | Historical evaluation snapshot (2026-05-20)    |
| [`scripts/README.md`](../scripts/README.md)    | Script commands summary                        |
| `AGENTS.md` (gitignored)                        | Cursor agent shorthand — must match this file  |

---

## Architecture

**Registry-discovery pattern** — no per-clock routes in `App.tsx`.

1. Clock code: `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`
2. Registry: `src/context/clockpages.json` (you maintain this manually)
3. Loader: `import.meta.glob` in `src/hooks/useClockPage.ts`

```
src/
├── pages/YYYY/YY-MM/YY-MM-DD/   # Clock modules
├── context/clockpages.json      # Registry (manual edits only)
├── templates/BaseClock.tsx      # Scaffold source
└── utils/hooks/                 # useClockTime, useSmoothClock, etc.
```

---

## New clock workflow

### Policy: manual registry only

| Tool                  | Touches `clockpages.json`?             |
| --------------------- | -------------------------------------- |
| `npm run clock:new`   | **No** — files only                    |
| `npm run finalize`    | **No** — validate, assets, screenshots |
| CI / scripts / agents | **No** — never auto-register           |

**You** add each clock to `src/context/clockpages.json` when it should appear in the site, archive, and capture scripts.

### Steps

**1. Scaffold**

```bash
npm run clock:new
# Optional date:
npm run clock:new -- 26-05-21
```

Creates:

- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx` (from `BaseClock.tsx`)
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css`

**2. Register manually (required)**

Edit `src/context/clockpages.json` and append:

```json
{ "path": "26-05-21", "date": "26-05-21", "title": "My Clock Title" }
```

Use the same `YY-MM-DD` string for `path` and `date`. No script will do this for you.

**3. Implement**

- Follow patterns in [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- Images: src/assets/images/YYYY/YY-MM/YY-MM-DD/ (WebP: descriptive-name.webp)
- Fonts: src/assets/fonts/YYYY/ (descriptive-name.ext)
- Fonts: src/assets/fonts/YYYY/ (YY-MM-DD-name.ext)

**4. Quality gate**

```bash
npm run finalize
```

Validates standards, organizes assets, captures `screen-caps/` thumbnails. Still does **not** edit the registry.

**5. Verify before PR**

```bash
npm run type-check && npm run lint && npm run test:run && npm run build
```

### Manual scaffold (alternative)

```bash
mkdir -p src/pages/2026/26-05/26-05-01
cp src/templates/BaseClock.tsx src/pages/2026/26-05/26-05-01/Clock.tsx
cp src/templates/BaseClock.module.css src/pages/2026/26-05/26-05-01/Clock.module.css
# Then register manually in clockpages.json (step 2 above)
```

---

## BorrowedTime Standard (BTS)

| Rule        | Requirement                                                                |
| ----------- | -------------------------------------------------------------------------- |
| Type safety | `.tsx` for clocks; avoid `any`                                             |
| Styles      | `.module.css` per clock; Tailwind for shared UI                            |
| Markup      | `<main>` wrapper; `<time dateTime={...}>` for time display                 |
| Time        | `useClockTime()` or `useSmoothClock()` — not raw `setInterval` in new work |
| Fonts       | `useSuspenseFontLoader()`                                                  |
| DOM         | `useRef` only — no `document.querySelector`                                |
| Cleanup     | Clear `setTimeout`, `setInterval`, `requestAnimationFrame` on unmount      |
| PR gate     | `npm run finalize` + CI checks below                                       |

Detail and examples: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Commands

### Daily

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Dev server (http://localhost:5173) |
| `npm run build`   | Production build                   |
| `npm run preview` | Preview `dist/`                    |

### New clock

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm run clock:new` | Scaffold `Clock.tsx` + CSS (**no registry**)               |
| `npm run finalize`  | Validate, fix assets, capture thumbnails (**no registry**) |

### Quality (matches CI)

| Command                  | Purpose                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run type-check`     | TypeScript — core app (`tsconfig.ci.json`, excludes `src/pages/**`) |
| `npm run type-check:all` | Full repo including archive clock pages                             |
| `npm run lint`           | ESLint                                                              |
| `npm run test:run`       | Vitest single run                                                   |
| `npm run build`          | Vite production build                                               |

**Pre-commit / PR:**

```bash
npm run type-check && npm run lint && npm run test:run && npm run build
```

### Assets

| Command                   | Purpose                                                                         |
| ------------------------- | ------------------------------------------------------------------------------- |
| `npm run audit:fonts`     | Writes `unused-fonts-report.txt`, `non-standard-fonts.txt` (gitignored)         |
| `npm run audit:images`    | Writes `unused-images-report.txt`, `unused-images-only-report.txt` (gitignored) |
| `npm run optimize:images` | Batch WebP conversion (review diffs before commit)                              |
| `npm run perf:analyze`    | Bundle size analysis                                                            |

### Environment

```bash
cp .env.example .env
```

| Variable                 | Purpose                      |
| ------------------------ | ---------------------------- |
| `VITE_ENVIRONMENT`       | `development` / `production` |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics (optional)  |
| `VITE_BASE_URL`          | Canonical site URL           |

---

## CI (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

On every push/PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run type-check` (core scope)
4. `npm run test:run`
5. `npm run build`

Node version: **24.x** (see `package.json` `engines`).

---

## Performance budgets

| Metric                 | Limit    |
| ---------------------- | -------- |
| Clock bundle           | 5 MB max |
| Font assets per clock  | 100 KB   |
| Image assets per clock | 2 MB     |
| Total page             | 6 MB max |

---

## Registry format

`src/context/clockpages.json` is a JSON **array**:

```json
[{ "path": "25-04-02", "date": "25-04-02", "title": "Deep Space Clock" }]
```

- **DEV** uses `testclocks.json` via `DataContext.tsx` when `import.meta.env.DEV` is true.
- A folder under `src/pages/` without a registry entry will not appear in lists/navigation.
- Orphan registry entries (no matching folder) break routing for that date.

---

## Related docs (not SSOT)

- **Future work:** [`ROADMAP.md`](../ROADMAP.md)
- **2026-05-20 audit snapshot:** [`SITE_SURVEY.md`](./SITE_SURVEY.md) — metrics may be stale; policy is this file
- **Component deep-dive (legacy):** [`COMPONENT_SURVEY.md`](./COMPONENT_SURVEY.md) — prefer this guide + ARCHITECTURE
- **Capture scripts:** `npm run capture:daily`, `npm run capture:range last-month` (social media thumbs, requires clock in `clockpages.json`)

---

_Cubist Heart Laboratories_
