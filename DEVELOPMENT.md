# BorrowedTime — Development Guide

**Single source of truth** for workflow, registry policy, coding standards, and commands.

| Document | Role |
|----------|------|
| **This file** | Policy, workflow, commands, CI, registry rules |
| [`README.md`](./README.md) | Project intro, stack, live link |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Clock component patterns, hooks, CSS conventions |

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
├── templates/BaseClock.tsx      # Scaffold source (BaseClock.tsx)
└── hooks/                       # useClockTime, useSmoothClock, etc.
```

---

## New Clock Workflow

### Policy: manual registry only

| Tool | Touches `clockpages.json`? |
|------|---------------------------|
| `npm run clock:new` | **No** — files only |
| `npm run finalize` | **No** — validate, assets, screenshots |
| CI / scripts / agents | **No** — never auto-register |

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

- Follow patterns in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Images: `src/assets/images/YYYY/YY-MM/YY-MM-DD/` (WebP preferred)
- Fonts: `src/assets/fonts/YYYY/` (format: `YY-MM-DD-name.ext`)

**4. Quality gate**

```bash
npm run finalize
```

Validates standards, organizes assets, captures thumbnails. Does **not** edit the registry.

**5. Verify before PR**

```bash
npm run type-check && npm run lint && npm run test:run && npm run build
```

### Manual Scaffold (Alternative)

```bash
mkdir -p src/pages/2026/26-05/26-05-01
cp src/templates/BaseClock.tsx src/pages/2026/26-05/26-05-01/Clock.tsx
cp src/templates/BaseClock.module.css src/pages/2026/26-05/26-05-01/Clock.module.css
# Then register manually in clockpages.json (step 2 above)
```

---

## Coding Standards

| Rule | Requirement |
|------|-------------|
| Type safety | `.tsx` for clocks; avoid `any` |
| Styles | `.module.css` per clock; Tailwind for shared UI |
| Markup | `<main>` wrapper; `<time dateTime={...}>` for time display |
| Time | `useClockTime()` or `useSmoothClock()` — not raw `setInterval` in new work |
| Fonts | `useSuspenseFontLoader()` |
| DOM | `useRef` only — no `document.querySelector` |
| Cleanup | Clear `setTimeout`, `setInterval`, `requestAnimationFrame` on unmount |
| PR gate | `npm run finalize` + CI checks below |

Details and examples: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Commands

### Environment Setup

This project requires **Node.js 24.x**. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage versions:

```bash
# Install nvm (if not present)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 24 && nvm use 24
```

### Daily

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (http://localhost:5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview `dist/` |

### Shortcuts

| Command | Purpose |
|---------|---------|
| `git config alias.save "commit -m 'chore: clock update'"` | Create a shortcut for default commits |
| `git save` | Commit all changes with the default message |

### New Clock

| Command | Purpose |
|---------|---------|
| `npm run clock:new` | Scaffold `Clock.tsx` + CSS (**no registry**) |
| `npm run finalize` | Validate, fix assets, capture thumbnails (**no registry**) |

### Quality (Matches CI)

| Command | Purpose |
|---------|---------|
| `npm run type-check` | TypeScript — core app (`tsconfig.ci.json`, excludes `src/pages/**`) |
| `npm run type-check:all` | Full repo including archive clock pages |
| `npm run lint` | ESLint |
| `npm run test:run` | Vitest single run |
| `npm run build` | Vite production build |

**Pre-commit / PR:**

```bash
npm run type-check && npm run lint && npm run test:run && npm run build
```

### Assets

| Command | Purpose |
|---------|---------|
| `npm run audit:fonts` | Writes `unused-fonts-report.txt`, `non-standard-fonts.txt` (gitignored) |
| `npm run audit:images` | Writes `unused-images-report.txt`, `unused-images-only-report.txt` (gitignored) |
| `npm run optimize:images` | Batch WebP conversion (review diffs before commit) |
| `npm run perf:analyze` | Bundle size analysis |

### Environment

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `VITE_ENVIRONMENT` | `development` / `production` |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics (optional) |
| `VITE_BASE_URL` | Canonical site URL |

---

## Commit Message Automation

To avoid typing commit messages manually, you can use a local template:

1. Create `.gitmessage` in the root with your default text.
2. Run: `git config commit.template .gitmessage`

Alternatively, use the project-standard alias for quick updates:
`git config --global alias.up "commit -am 'chore: routine clock update'"`

---

## CI (GitHub Actions)

On every push/PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run type-check` (core scope)
4. `npm run test:run`
5. `npm run build`

Node version: **24.x** (see `package.json` `engines`).

---

## Performance Budgets

| Metric | Limit |
|--------|-------|
| Clock bundle | 5 MB max |
| Font assets per clock | 100 KB |
| Image assets per clock | 2 MB |
| Total page | 6 MB max |

---

## Registry Format

`src/context/clockpages.json` is a JSON **array**:

```json
[{ "path": "25-04-02", "date": "25-04-02", "title": "Deep Space Clock" }]
```

- **DEV** uses `testclocks.json` via `DataContext.tsx` when `import.meta.env.DEV` is true.
- A folder under `src/pages/` without a registry entry will not appear in lists/navigation.
- Orphan registry entries (no matching folder) break routing for that date.

---

## Capture Scripts

```bash
npm run capture:daily        # Today's thumbnail
npm run capture:range last-month  # Monthly range for social
```

Requires the clock to be registered in `clockpages.json`.

---

_Cubist Heart Laboratories_