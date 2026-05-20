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

## Documentation

**Single source of truth:** [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — new clocks, manual registry, commands, CI, BTS.

| Doc | Use for |
|-----|---------|
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Workflow, policy, scripts, quality gates |
| [`src/templates/ARCHITECTURE.md`](src/templates/ARCHITECTURE.md) | Clock component patterns and hooks |
| [`ROADMAP.md`](ROADMAP.md) | Planned future work |
| [`docs/SITE_SURVEY.md`](docs/SITE_SURVEY.md) | Historical evaluation snapshot |

## Quick Start

```bash
npm ci
npm run dev    # http://localhost:5173
```

New clock (summary): `clock:new` → **you** edit `clockpages.json` → `finalize` → CI checks.  
Full steps: [`docs/DEVELOPMENT.md#new-clock-workflow`](docs/DEVELOPMENT.md#new-clock-workflow).


## Deployment

Main branch auto-deploys to Vercel. See [`docs/DEVELOPMENT.md#environment`](docs/DEVELOPMENT.md#environment) for env vars.

```bash
npm run build
npm run preview
```

---

## License

MIT - See [LICENSE](LICENSE)

**Cubist Heart Laboratories** - cubistheart@gmail.com
