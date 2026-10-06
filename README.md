# BorrowedTime

A new clock every day.

[See it live](https://www.cubistheart.com), an ongoing digital art project by [Cubist Heart Laboratories](https://cubistheart.com).

<!-- VERIFY: the repo About box links to https://chl-flax.vercel.app. Decide which URL is canonical and whether to mention both. -->

## About the name

The GitHub repository is `CHL` (Cubist Heart Laboratories). The app itself is called BorrowedTime, which is the package name.

## Quick start

Requires Node.js 22.x (see `.nvmrc`).

```bash
npm ci
npm run setup   # creates src/assets/thumbnails and installs Playwright's Chromium
npm run dev
```

Open <http://localhost:5173>.

`npm run setup` is only required for the screenshot tooling (`screencaps`). You can skip it if you only want to run the app.

## Tech stack

- React 19, TypeScript, Vite 7
- Tailwind CSS v4
- three.js with `@react-three/fiber` and `@react-three/drei` for 3D clocks
- d3 for data-driven and SVG clocks
- React Router for page routing
- Vitest and Testing Library for tests
- ESLint, Prettier, Husky and lint-staged for code quality
- Playwright and sharp for screenshot capture and thumbnail optimization

## Commands

### Development

| Command           | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server                                    |
| `npm run build`   | Production build                                             |
| `npm run preview` | Preview the production build                                 |
| `npm run setup`   | Create the thumbnails folder and install Playwright Chromium |

### Quality checks

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run type-check`   | TypeScript check (`tsconfig.ci.json`) |
| `npm run lint`         | ESLint check                          |
| `npm run lint:fix`     | ESLint with auto-fix                  |
| `npm run format`       | Prettier write                        |
| `npm run format:check` | Prettier check only                   |
| `npm run test:run`     | Run tests once                        |
| `npm run test:ui`      | Run tests in the Vitest UI            |
| `npm run check`        | Full local check (see below)          |
| `npm run check:ci`     | Full CI check (see below)             |
| `npm run status`       | Verify all clocks, then type-check    |

`check` runs: type-check, lint, format check, tests, `verify:clocks:changed`, build.

`check:ci` currently runs the same steps as `check`; both use `verify:clocks:changed`. To verify every clock, run `npm run verify:clocks` (this still reports violations in historical clocks).

### Clock tooling

| Command                         | Purpose                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| `npm run new-clock`             | Scaffold a new clock and register it (see [Adding a clock](#adding-a-clock)) |
| `npm run verify:clocks`         | Verify every clock against the clock contract                            |
| `npm run verify:clocks:changed` | Verify only clocks changed in the diff (see [Verifying clocks](#verifying-clocks)) |
| `npm run conform`               | Check current clocks (September 2026 onward) against the standards; add `-- --fix` to apply safe fixes |
| `npm run screencaps`            | Capture 200px WebP thumbnails of clocks into `src/assets/thumbnails/` (Playwright) |
| `npm run screencaps:optimize`   | Re-compress existing thumbnails only; does not capture new ones          |

## Adding a clock

Clocks are named by date, in `YY-MM-DD` format.

```bash
npm run new-clock 26-09-25 "Digital Wave" digital sound
```

Arguments: the date (required), then an optional title (defaults to the date), then any number of tags.

The command:

1. Creates `src/pages/2026/26-09/26-09-25/` containing `Clock.tsx` and `Clock.module.css`. The folder layout is `src/pages/20YY/YY-MM/YY-MM-DD/`.
2. Registers the clock in both `src/context/clockpages.json` and `src/context/testclocks.json` as `{ path, date, title, tags }`. Existing entries for the same date are left alone.
3. Refuses to run if the clock folder already exists.

The generated `Clock.tsx` already follows the contract: it uses `useSmoothClock` from `@/utils/hooks`, renders `SRTime` for screen readers, exports an `assets` array, and sets a `displayName` like `Clock_26_09_25`.

After scaffolding:

1. Build your artwork in `Clock.tsx` and `Clock.module.css`.
2. Add any images or fonts and list them in the `assets` array.
3. Run `npm run verify:clocks -- --path 26-09-25`.
4. Run `npm run build`.

## Verifying clocks

`scripts/verify-all-clocks.js` checks clocks against the contract in `docs/CLOCKS.md`. Its rules live in the script and in `scripts/clock-verifier-rules.js`.

### The clock contract

Every clock must:

- live in a `YY-MM-DD` directory and include a `Clock.module.css`
- have a default component export
- set `displayName` to something ending in `_YY_MM_DD`
- import `useClock` or `useSmoothClock` from `@/utils/hooks`
- render semantic time: a `<time dateTime=...>` element or the `SRTime` component

Every clock must not:

- use `setInterval` or `setTimeout`
- use `requestAnimationFrame` as an independent source of clock time (rendering loops for animation, such as Three.js, are allowed)
- use inline `<style>` tags
- use the `any` type
- use the deprecated hooks `useClockTime`, `useSecondClock` or `useMillisecondClock`

**September 2026 boundary:** clocks dated `26-09-01` or later must use `SRTime` and must not use `styles.srOnly` directly. Older clocks may use either, but if they use `styles.srOnly`, their CSS module must define `.srOnly`.

### Options

```bash
node scripts/verify-all-clocks.js [--changed] [--path <date|file>] [--quiet]
```

| Option           | Effect                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `--path <value>` | Verify one clock by date (`26-09-25`) or file path. Repeatable.     |
| `--changed`      | Verify only clocks changed in the git diff (below)                  |
| `--quiet`        | Print nothing except failures                                       |

With `--changed`, the script compares against `origin/$GITHUB_BASE_REF` in a pull request, and against `HEAD^` (the previous commit) otherwise.

The script exits with a non-zero code if any verified clock fails.

## Git hooks

Husky runs lint-staged on commit:

- `*.{ts,tsx}`: ESLint (with fix), Prettier, then a full type-check
- `*.{js,json,css,md,mdx}`: Prettier
- `src/pages/**/Clock.tsx`: `verify:clocks:changed`

Run `npm run check` before pushing to catch what the hooks don't.

## Deployment

The repo includes configuration for several targets:

| File                       | Target                       |
| -------------------------- | ---------------------------- |
| `vercel.json`              | Vercel                       |
| `netlify.toml`             | Netlify                      |
| `Dockerfile`, `nginx.conf` | Docker image served by nginx |
| `.github/workflows/`       | GitHub Actions CI            |

<!-- TODO: state which target is production, which are alternatives, and how environment variables work (see .env.example). -->

## Project structure

```
.github/workflows/   CI workflows
docs/                Project documentation (CLOCKS.md is the clock contract)
public/              Static assets
scripts/             Clock tooling, screenshots and verification
src/context/         clockpages.json and testclocks.json registries
src/pages/           Clocks, organised as 20YY/YY-MM/YY-MM-DD/
```

## License

MIT. See [LICENSE](LICENSE).
