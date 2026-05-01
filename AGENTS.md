# AGENTS.md

Technical standards for BorrowedTime development.

## Architecture

**Registry-Discovery Pattern**
- Source of truth: `src/context/clockpages.json`
- Dynamic loading: `import.meta.glob` in `useClockPage.ts`

## Priority Focus (Current Sprint)
1. **Asset Pruning**: Remove the 270 identified unused font files to reduce repo bloat.
2. **Naming Compliance**: Fix the 33 non-standardized font filenames.
3. **Logic Migration**: Refactor remaining `setInterval` clocks to `useClockTime()`.
4. **Image Optimization**: Transition to Phase 4 (WebP automation).

**Key Hooks**
- `useClockTime()` - 1s updates from `@/utils/hooks`
- `useSuspenseFontLoader()` - FOUC prevention
- `useImageLoader()` / `useVideoLoader()` - Pre-buffering

## Coding Standards (BTS)

1. **Strict Typing**: `.tsx` only, no `any`
2. **CSS Modules**: `.module.css` for clocks, Tailwind for UI
3. **Semantic HTML**: `<time dateTime={...}>` for displays
4.  **No Direct DOM**: Avoid `document.querySelector`. Use `useRef` for canvas/animations.
5.  **Clean Up**: Always clear `setTimeout`, `setInterval`, and `requestAnimationFrame` on unmount.

## CLI Operations

### Essential

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:with-types` | Build with type check |
| `npm run type-check` | TypeScript only |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

### Testing

| Command | Purpose |
|---------|---------|
| `npm run test` | Vitest watch |
| `npm run test:run` | Single run (CI) |
| `npm run test:ui` | Browser UI |

### Clock Creation

| Command | Purpose |
|---------|---------|
| `npm run clock:new` | Create clock from template |

### Asset Management

| Command | Purpose |
|---------|---------|
| `npm run audit:fonts` | Find unused fonts |
| `npm run audit:images` | Find unused images |
| `npm run standardize:fonts` | Fix font names |
| `npm run optimize:images` | Convert to WebP |

### Performance

| Command | Purpose |
|---------|---------|
| `npm run perf:analyze` | Bundle analysis |
| `npm run preview` | Preview build |
| `npm run clean` | Remove dist |

## Directory Map

```
src/
├── pages/YYYY/YY-MM/YY-MM-DD/    # Daily clock modules
│   ├── Clock.tsx                 # Clock component
│   └── Clock.module.css          # Styles
├── utils/
│   ├── hooks/                     # Time hooks
│   │   ├── useClockTime.ts       # 1s updates
│   │   ├── useSmoothClock.ts     # 60fps RAF
│   │   └── useClock.ts           # Legacy
│   └── fontLoader.tsx            # Font loading
├── assets/
│   ├── images/YY-MM/YY-MM-DD/    # Imagery
│   └── fonts/YYYY/                # Typefaces
├── context/clockpages.json       # Registry
└── templates/                     # Starters
```

## Performance Budgets

| Metric | Limit |
|--------|-------|
| Clock Bundle | 5MB max |
| Font Assets | 100KB per clock |
| Image Assets | 2MB per clock |
| Total Page | 6MB max |

## Asset Naming

**Fonts:**
- Format: `YY-MM-DD-name.[ext]` (ttf, otf, or woff2)
- Location: `src/assets/fonts/YYYY/`
- Standard: TTF, OTF, and WOFF2 all supported.

**Images:**
- Format: `YY-MM-DD-name.webp`
- Location: `src/assets/images/YY-MM/YY-MM-DD/`
- Standard: WebP only

**Videos:**
- No size restrictions
- Local storage supported

## Troubleshooting

**TypeScript:**
```bash
npm run type-check
```
- RefObject null checks: Add `?` optional chaining
- Missing args: Check hook signatures

**Build:**
```bash
npm run clean
npm run build
npm run perf:analyze  # Check deps
```

**Fonts:**
```bash
npm run audit:fonts
# Check paths match /fonts/YY-MM-DD-name.[ext]
```

## Deployment Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Entry added to `clockpages.json`
- [ ] Assets follow naming conventions

---
Cubist Heart Laboratories
