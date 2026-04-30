# BorrowedTime 🧊🫀🔭

[![CI](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml/badge.svg)](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> _A new clock every day._

BorrowedTime is an online digital art project by Cubist Heart Laboratories. The Lab combines existing material (open source code, appropriated imagery, found type design, etc.) to make a new online clock each day.

[🧊🫀🔭 Take Me There](https://www.cubistheart.com)
[🧊🫀🔭 Contact The Lab](mailto:cubistheart@gmail.com)

---

## 🛠 Technical Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + Vite 7 |
| **Language** | TypeScript 5 (Strict Mode) |
| **Routing** | React Router v6 |
| **Styling** | CSS Modules + TailwindCSS 4 |
| **Animation** | GSAP + RequestAnimationFrame |
| **Testing** | Vitest + React Testing Library |
| **Linting** | ESLint 9 + Prettier 3 |
| **Deployment** | Vercel |
| **Node** | 24.x LTS |


## 📁 Architecture

The project uses a **Registry-Discovery** pattern. Adding a clock requires zero manual routing:

1. Create your clock in `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`.
2. Register the entry in `src/context/clockpages.json`.
3. Vite's `import.meta.glob` handles dynamic discovery and code-splitting automatically.

### Directory Structure

```
src/
├── pages/YYYY/YY-MM/YY-MM-DD/    # Daily clock modules
│   ├── Clock.tsx                # Clock component
│   └── Clock.module.css         # Scoped styles
├── components/                   # Shared UI components
├── utils/                        # Hooks and utilities
│   ├── hooks/                    # Time-related hooks
│   └── fontLoader.tsx           # Font loading
├── assets/
│   ├── images/YY-MM/YY-MM-DD/   # Clock imagery
│   └── fonts/YYYY/              # Daily typefaces
├── context/
│   └── clockpages.json          # Registry (source of truth)
└── templates/                    # Starter templates
```

## 💎 The Technical Standard (BTS)

To maintain art quality and performance, every clock must adhere to the **BorrowedTime Technical Standard**:

| Standard | Requirement |
|----------|-------------|
| **Type Safety** | All files must be `.tsx` (no `any` types) |
| **Style Isolation** | Use `.module.css` for clock art; Tailwind for UI |
| **Semantic Markup** | `<main>` for containers, `<time datetime="...">` for displays |
| **Rendering** | Use `useClockTime` hook for frame-synced updates |
| **Asset Pipeline** | Use `useSuspenseFontLoader` to prevent FOUC |
| **Cleanup** | Always clear timers/RAF on unmount |
| **No Direct DOM** | Use `useRef` instead of `document.querySelector` |

## 🚀 Development Workflow

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create today's clock from template
npm run clock:new
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:with-types` | Build with TypeScript check |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript validation |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier on all files |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once (CI) |
| `npm run clock:new` | Create today's clock from template |
| `npm run perf:analyze` | Analyze bundle size |
| `npm run audit:fonts` | Audit font usage |
| `npm run audit:images` | Audit image usage |
| `npm run optimize:images` | Convert images to WebP |
| `npm run standardize:fonts` | Standardize font naming |

### Creating a New Clock

```bash
# Automated approach
npm run clock:new

# Manual approach
cp src/templates/BaseClock.tsx src/pages/2026/26-05/26-05-01/Clock.tsx
touch src/pages/2026/26-05/26-05-01/Clock.module.css
# Then add entry to src/context/clockpages.json
```
---

## 🧪 Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once (for CI)
npm run test:run

# Run with UI
npm run test:ui
```

### Pre-commit Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm run test:run` passes (if tests exist)

## 📦 Deployment

### Vercel (Production)

Pushes to `main` branch automatically deploy to Vercel.

```bash
# Manual deployment preview
npm run build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical site URL |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Contact

- **Email**: `cubistheart@gmail.com`
- **Website**: <https://www.cubistheart.com>
- **Instagram**: [@cubist_heart_labs](https://www.instagram.com/cubist_heart_labs/)
- **X (Twitter)**: [@cubistheartlabs](https://x.com/cubistheartlabs)
- **Facebook**: [Cubist Heart Laboratories](https://www.facebook.com/profile.php?id=100090369371981)


---

_Built with ❤️ by Cubist Heart Laboratories_  
_🧊🫀🔭_
