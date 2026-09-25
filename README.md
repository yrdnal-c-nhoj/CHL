# BorrowedTime

A new clock every day.

[See it live](https://www.cubistheart.com) — an ongoing digital art project by [Cubist Heart Laboratories](https://cubistheart.com).

## Documentation

| Document | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | Authoritative application architecture and historical/current boundary |
| `docs/CLOCKS.md` | Current clock contract for September 2026 onward |
| `docs/PERFORMANCE.md` | Asset budgets, caching, compression, and bundle limits |
| `docs/OPERATIONS.md` | Build, deployment, release, and archive operations |
| `docs/ROADMAP.md` | Current priorities, technical debt, and sustainability plan |
| `docs/STATUS.md` | Recorded health checks, inventory, and known gaps |
| `CONTRIBUTING.md` | Human contribution workflow |
| `AGENTS.md` | AI coding-agent instructions |

## Architecture

BorrowedTime is both a current React/TypeScript/Vite application and a historical archive of daily clock artworks. **September 2026 is the current architectural boundary.** New clocks follow the current contract; historical clocks are generally preserved rather than mass-refactored.

The date-based structure remains:

`src/pages/YYYY/YY-MM/YY-MM-DD/`

See `docs/ARCHITECTURE.md` for the authoritative architecture and `docs/CLOCKS.md` for the current clock contract.

## Quick start

Requires Node.js 22.x.

```bash
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test:run` | Run tests |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format |
| `npm run status` | Print a reminder to run `verify:clocks` and `type-check`; `docs/STATUS.md` is currently updated manually |

## Tech stack

React + TypeScript + Vite

## License

MIT — see [LICENSE](LICENSE)
