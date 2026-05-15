# BorrowedTime 🧊🫀🔭

[![CI](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml/badge.svg)](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A new clock every day.

Online digital art project by Cubist Heart Laboratories. [See it live](https://www.cubistheart.com).

---

## Stack

- React 18 + Vite 7
- TypeScript 5 (Strict)
- React Router v6
- CSS Modules + TailwindCSS 4
- GSAP + RAF animations
- Vitest + React Testing Library
- ESLint 9 + Prettier 3
- Node 24.x LTS

## Architecture

Registry-Discovery pattern. Zero manual routing.

1. Create clock: `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`
2. Register in `src/context/clockpages.json`
3. Vite's `import.meta.glob` handles code-splitting

```
src/
├── pages/YYYY/YY-MM/YY-MM-DD/    # Clock modules
├── components/                   # Shared UI
├── utils/hooks/                  # Time hooks
├── assets/images/                # Imagery
├── assets/fonts/YYYY/            # Typefaces
├── context/clockpages.json      # Registry
└── templates/                    # Starters
```

## BorrowedTime Standard (BTS)

| Rule | Enforcement |
|------|-------------|
| Type Safety | `.tsx` only, no `any` |
| Styles | `.module.css` for clocks, Tailwind for UI |
| Markup | `<main>` containers, `<time datetime>` displays |
| Time | `useClockTime` hook |
| Fonts | `useSuspenseFontLoader` for FOUC prevention |
| Cleanup | Clear timers/RAF on unmount |
| DOM | `useRef` only, no `querySelector` |

## Development

```bash
npm ci
npm run dev          # http://localhost:5173
npm run clock:new    # Create today's clock
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run build:with-types` | Type-check + production build |
| `npm run type-check` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Tests (watch) |
| `npm run test:run` | Tests (CI) |
| `npm run clock:new` | New clock from template |
| `npm run audit:fonts` | Find unused fonts |
| `npm run audit:images` | Find unused images |
| `npm run standardize:fonts` | Auto-fix non-standard font names |
| `npm run optimize:images` | Convert image assets to WebP |
| `npm run perf:analyze` | Bundle analysis |

## New Clock

```bash
npm run clock:new
# Edit src/context/clockpages.json to register
```

Or manually:

```bash
mkdir -p src/pages/2026/26-05/26-05-01
cp src/templates/BaseClock.tsx src/pages/2026/26-05/26-05-01/Clock.tsx
touch src/pages/2026/26-05/26-05-01/Clock.module.css
```

## Testing

```bash
npm run test        # Watch mode
npm run test:run    # CI mode
npm run test:ui     # Browser UI
```

**Pre-commit:**
```bash
npm run type-check && npm run lint && npm run build
```

## Audit & Hygiene

```bash
# Asset audits
npm run audit:images
npm run audit:fonts

# Naming normalization
npm run standardize:fonts

# Delivery checks
npm run type-check
npm run lint
npm run build
```

Generated audit artifacts:
- `unused-images-report.txt`
- `unused-images-only-report.txt`
- `unused-videos-report.txt`
- `unused-fonts-report.txt`
- `non-standard-fonts.txt`

## Roadmap & Quality Goals

1. **Type Zero**: Eliminate `any` usage in all clock modules.
2. **Asset Optimization**: Migrate all legacy images to WebP.
3. **Automated Vitals**: Integrate Lighthouse CI for performance monitoring.
4. **Visual Regression**: Use Playwright to ensure component integrity during updates.

## Deployment

Main branch auto-deploys to Vercel.

```bash
npm run build
npm run preview
```

**Env vars:** `cp .env.example .env`

- `VITE_SITE_URL` - Canonical URL

---

## License

MIT - See [LICENSE](LICENSE)

**Cubist Heart Laboratories** - cubistheart@gmail.com
