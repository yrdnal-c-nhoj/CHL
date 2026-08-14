# BorrowedTime — Technical Standards & Architecture

This document defines the canonical technical standards for the BorrowedTime project at Cubist Heart Laboratories. All new code **must** conform to these standards. Existing code should be migrated as part of ongoing maintenance.

---

## Table of Contents

1. [Stack Overview](#1-stack-overview)
2. [Project Structure](#2-project-structure)
3. [Component Architecture](#3-component-architecture)
4. [Clock Component Standards](#4-clock-component-standards)
5. [Font Loading Strategy](#5-font-loading-strategy)
6. [FOUC Prevention](#6-fouc-prevention)
7. [State Management](#7-state-management)
8. [Routing](#8-routing)
9. [Styling Guidelines](#9-styling-guidelines)
10. [Performance Budget](#10-performance-budget)
11. [Accessibility Requirements](#11-accessibility-requirements)
12. [Testing](#12-testing)
13. [Build & Deployment](#13-build--deployment)
14. [Code Quality](#14-code-quality)

---

## 1. Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^18.3 |
| Language | TypeScript | ^5.9 |
| Build Tool | Vite | ^7.3 |
| Styling | Tailwind CSS v4 + CSS Modules | ^4.1 |
| Linting | ESLint (flat config) | ^9.39 |
| Formatting | Prettier | ^3.8 |
| Testing | Vitest + Testing Library | ^4.0 |
| Animation | GSAP | ^3.13 |
| 3D Rendering | Three.js / @react-three/fiber | ^8.18 |
| 2D Rendering | Pixi.js | ^8.18 |
| Icons | Lucide React | ^0.541 |

### Key Architectural Decisions

- **No external global state management** — React Context + hooks are sufficient
- **CSS Modules for component styles** — scoped, deterministic, no runtime cost
- **Tailwind for utility classes** — used sparingly, primarily for layout and spacing
- **Vite for build** — fast HMR, optimized production builds with code splitting
- **Dynamic imports for clock pages** — lazy-loaded via Vite's `import.meta.glob`

---

## 2. Project Structure

```
src/
├── assets/          # Static assets (images, fonts, icons)
│   ├── fonts/       # Custom font files (organized by year)
│   ├── icons/       # Social media icons
│   ├── images/      # Clock background images (organized by year/month)
│   ├── thumbnails/  # Clock thumbnails (YY-MM-DD-thumb.webp)
│   └── social_media/ # Social media preview images
├── components/      # Shared UI components
│   └── admin/       # Admin tools (tagging, dashboard)
├── context/         # React Context providers + data files
├── hooks/           # Shared React hooks
├── pages/           # Route pages + clock components
│   ├── 2025/        # Clock pages organized by year/month
│   │   ├── 25-04/   # Month folder
│   │   │   ├── 25-04-01/  # Clock date folder
│   │   │   │   ├── Clock.tsx
│   │   │   │   └── Clock.module.css
│   │   │   └── ...
│   │   └── ...
│   └── 2026/
├── styles/          # Global CSS + CSS Modules for shared components
├── templates/       # Clock templates/starters
├── test/            # Test setup + test files
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and hooks
    └── hooks/       # Canonical custom hooks (clock time, etc.)
```

### Path Aliases

All imports should use the `@/` alias:

```typescript
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundImage from '@/assets/images/example.webp';
```

---

## 3. Component Architecture

### 3.1. Shared Components

Shared components live in `src/components/` and follow this pattern:

```typescript
// ✅ DO: Functional component with TypeScript interface
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className={styles.container}>
      <button onClick={onAction}>{title}</button>
    </div>
  );
};

export default MyComponent;
```

### 3.2. Lazy Loading

All route-level components are lazy-loaded in `App.tsx`:

```typescript
const Home = React.lazy(() => import('./pages/Home'));
const ClockPage = React.lazy(() => import('./pages/ClockPage'));
```

The `React.Suspense` wrapper in `App.tsx` provides a loading fallback.

---

## 4. Clock Component Standards

Every clock component **must** follow this canonical structure:

### 4.1. File Template

```typescript
import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
import backgroundImage from '@/assets/images/your-image.webp';
import fontUrl from '@/assets/fonts/your-font.otf?url';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration (if custom fonts are used)
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_YY_MM_DD', fontUrl }
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock(); // or useMillisecondClock() for smooth

  // Load fonts via Suspense (component must be in <Suspense> boundary)
  useSuspenseFontLoader(fontConfigs);

  // Memoize expensive calculations
  const { hours, minutes } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    return { hours: h, minutes: m };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* Clock UI */}
      <div className={styles.clockFace}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_YY_MM_DD';

export default MemoizedClock;
```

### 4.2. Core Requirements

| Requirement | Standard | Notes |
|---|---|---|
| **Asset Exports** | `export const assets: string[]` | **Recommended.** Required for preloading. |
| **Styling** | CSS Modules (`Clock.module.css`) | Scoped styles, no global CSS leakage |
| **Time Hook** | `useSecondClock()` or `useMillisecondClock()` from `@/utils/hooks` | Only these two hooks are canonical |
| **Font Loading** | `useSuspenseFontLoader()` from `@/utils/fontLoader` | Suspends rendering until font is ready |
| **Performance** | `React.memo` + `displayName` | Prevents unnecessary re-renders |
| **Accessibility** | `<time>` element with `dateTime` | Required for screen readers |
| **Memoization** | `useMemo` for expensive calculations | E.g., angle calculations, string formatting |

### 4.3. Prohibited Patterns

- ❌ **Do not** use `setInterval` or `requestAnimationFrame` directly in clock components — use the canonical hooks
- ⚠️ **Avoid** inline `<style>` tags where possible. Prefer CSS Modules. They are acceptable for defining `@keyframes` that rely on dynamic CSS variables.
- ❌ **Do not** use `useGlobalStyles` or `useKeyframes` from `enhancedFontLoader` — use CSS Modules
- ❌ **Do not** import `useClockTime` from `@/utils/clockUtils` — import from `@/utils/hooks`
- ❌ **Do not** use `any` types — prefer proper TypeScript interfaces

---

## 5. Font Loading Strategy

### 5.1. Canonical Approach

The project uses a single, canonical font loading system:

```typescript
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'MyClockFont',
    fontUrl: myFontUrl, // imported with ?url suffix
    options: { weight: 'normal', style: 'normal' }
  }
];

// In component:
useSuspenseFontLoader(fontConfigs);
```

### 5.2. Key Features

- **Suspense-based**: Component suspends until font is ready, preventing FOUT
- **Reference counting**: Fonts are unloaded when no component uses them
- **Cache**: Fonts are cached globally to prevent double-loading
- **Fallback**: If font fails to load, CSS `font-family` stack handles degradation
- **`display: 'block'`**: Ensures text is hidden until font is ready (FOUC prevention)

### 5.3. Font Import Convention

```typescript
// ✅ Correct: Use ?url suffix for font files
import fontUrl from '@/assets/fonts/25fonts/25-05-01-Inner.ttf?url';

// ❌ Wrong: Do not use new URL() pattern
import fontUrl from '@/assets/fonts/example.woff2';
```

### 5.4. Deprecated Font Loaders

The following font loading approaches are **deprecated** and should not be used in new clocks:

- `@/utils/enhancedFontLoader` — use `@/utils/fontLoader` instead
- `@/utils/clockUtils`'s `useClockTime` — use `@/utils/hooks` instead
- `assetLoader.ts`'s `useFontLoader` / `useMultiFontLoader` — use `@/utils/fontLoader` instead

---

## 6. FOUC Prevention

### 6.1. Strategy

The project uses a layered FOUC (Flash of Unstyled Content) prevention strategy:

1. **Inline `<script>` in `<head>`**: Immediately hides content by adding `fonts-loading` class to `<html>`
2. **Font loading detection**: Uses `document.fonts.ready` to detect when all fonts are loaded
3. **Hard timeout (3s)**: Content is always shown after 3 seconds, even if fonts haven't loaded
4. **DOMContentLoaded fallback**: If fonts fail to load, content is shown when DOM is ready
5. **Critical CSS**: Inline styles in `<head>` control visibility transitions

### 6.2. CSS Classes

| Class | Purpose |
|-------|---------|
| `.fonts-loading` | Applied on initial load; hides content |
| `.fonts-ready` | Applied when fonts are loaded; shows content with fade-in |
| `.dom-loaded` | Applied when DOM is ready; fallback to show content |
| `.react-hydrated` | Applied after React hydrates; added in `main.tsx` |

### 6.3. Best Practices

- Always use `font-display: 'block'` or `display: 'block'` in FontFace declarations
- Import Google Fonts with `&display=swap` parameter
- Never rely on JavaScript alone for FOUC prevention — the inline `<script>` is critical

---

## 7. State Management

### 7.1. Global State

The `DataContext` (`src/context/DataContext.tsx`) is the single source of truth for clock data:

```typescript
import { useDataContext } from '@/context/DataContext';

const { items, loading, error } = useDataContext();
```

- `items`: Array of `ClockItem[]` with `date`, `path`, `title`, `tags`, `clockNumber`
- `loading`: Boolean, true while data is being fetched
- `error`: Error | null

### 7.2. Local State

Use React hooks for component-level state:

- `useState` — for simple state
- `useReducer` — for complex state logic
- `useRef` — for mutable references (no re-renders)
- `useMemo` / `useCallback` — for performance optimization

### 7.3. URL State

Route parameters and search params should be used for shareable state:

```typescript
import { useParams, useSearchParams } from 'react-router-dom';
const { date } = useParams<{ date: string }>();
const [searchParams] = useSearchParams();
```

---

## 8. Routing

### 8.1. Route Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Main landing page with month grouping |
| `/:date` | `ClockPage` | Dynamic clock display (YY-MM-DD format) |
| `/today` | `Today` | Today's clock (or most recent) |
| `/list` | `ClockList` | Full list of all clocks |
| `/tags` | `AllTagsPage` | All tags with usage counts |
| `/tag/:tag` | `TagList` | Clocks filtered by tag |
| `/contact` | `Contact` | Contact form + social links |
| `/admin` | `AdminDashboard` | Admin tools index |
| `/admin/tags` | `TagManager` | Bulk tag editing |
| `/admin/tag-by-image` | `TagByImage` | Visual tag assignment |
| `/tagger/:date` | `Tagger` | Single clock tag editor |

### 8.2. Clock Page Resolution

The `useClockPage` hook handles dynamic clock loading:

1. Parses `/:date` route param
2. Looks up the clock module via `import.meta.glob` (static registry)
3. Dynamically imports the `Clock.tsx` component
4. Preloads exported assets (images, fonts)
5. Fails open: if assets fail to load, the clock still mounts

---

## 9. Styling Guidelines

### 9.1. CSS Modules (Preferred)

All component styles use CSS Modules:

```css
/* Clock.module.css */
.container {
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.digit {
  font-family: var(--font-roboto), serif;
  font-size: 4rem;
}
```

```typescript
import styles from './Clock.module.css';
// Use: className={styles.container}
```

### 9.2. Design Tokens

Use CSS custom properties from `globals.css` for consistency:

```css
/* Font families */
font-family: var(--font-roboto);
font-family: var(--font-oxanium);
font-family: var(--font-arimo);

/* Colors */
color: var(--color-lab-red);
color: var(--color-lab-blue);
background: var(--color-lab-bg-gray);

/* Spacing */
margin: var(--space-md);
padding: var(--space-lg);
```

### 9.3. Tailwind Usage

Tailwind is available but should be used sparingly — primarily for:
- Layout utility classes (`flex`, `grid`, `gap-*`)
- Responsive breakpoints
- Quick prototyping

**Do not** use Tailwind for component-specific styling — that belongs in CSS Modules.

### 9.4. Inline Styles

Inline style objects and `<style>` tags are acceptable for dynamic values that cannot be easily expressed in CSS Modules, such as animations or dimensions calculated in JavaScript. However, **CSS Modules should be your default choice.**

```typescript
// ✅ Acceptable: Dynamic CSS transform
<div style={{ transform: `rotate(${angle}deg)` }}>

// ❌ Not acceptable: Static styles that can be moved to a CSS Module
<div style={{ color: 'red', fontSize: '16px' }}>
```

---

## 10. Performance Budget

### 10.1. Build Targets

| Metric | Target |
|--------|--------|
| Initial JS bundle | < 150KB (gzipped) |
| Total page weight | < 500KB (gzipped) |
| Time to Interactive | < 3s on 3G |
| Lighthouse Performance | > 90 |

### 10.2. Optimization Techniques

- **Code splitting**: Each clock page is a separate chunk via dynamic imports
- **Manual chunks**: Framework, Three.js, GSAP, and vendor code are split into separate chunks
- **Asset inlining**: Assets under 4KB are inlined as base64
- **Brotli compression**: Production builds use Brotli compression
- **Source maps**: Disabled in production
- **`React.memo`**: All clock components are memoized
- **`useMemo`**: Expensive calculations are memoized
- **Lazy loading**: Images use `loading="lazy"` attribute

### 10.3. Canonical Time Hooks

Use these hooks from `@/utils/hooks`:

| Hook | Update Rate | Use Case |
|------|-------------|----------|
| `useSecondClock()` | ~60fps, updates only when seconds change | Default for most clocks |
| `useMillisecondClock(50)` | Every 50ms | Smooth animations |
| `useSmoothClock(1000)` | Every 1000ms (configurable) | When you need custom interval |

---

## 11. Accessibility Requirements

### 11.1. Required for All Clock Components

- ✅ Semantic `<time>` element with valid `dateTime` attribute
- ✅ Visually hidden but screen-reader accessible time text
- ✅ `aria-label` on interactive elements without visible text
- ✅ Keyboard navigation for interactive elements
- ✅ Sufficient color contrast (WCAG AA minimum)

### 11.2. Best Practices

- Use semantic HTML (`<main>`, `<nav>`, `<button>`, `<time>`)
- Provide alt text for meaningful images
- Ensure touch targets are at least 44x44px
- Test with keyboard navigation (Tab, Enter, Space)

---

## 12. Testing

### 12.1. Test Framework

- **Vitest** for test runner
- **Testing Library** for React component tests
- **jsdom** for DOM environment

### 12.2. Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### 12.3. Test Coverage

- Utility functions: **required**
- React hooks: **required** for shared hooks
- Components: **recommended** for shared components
- Clock pages: **optional** (tested via integration)

---

## 13. Build & Deployment

### 13.1. Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests (watch mode) |
| `npm run test:run` | Run tests once |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run type-check` | TypeScript type check |

### 13.2. CI/CD

- **Netlify**: Primary deployment (`netlify.toml`)
- **Vercel**: Secondary deployment (`vercel.json`)
- **Docker**: Containerized deployment (`Dockerfile` + `nginx.conf`)

### 13.3. Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID |
| `VITE_ENVIRONMENT` | Environment name (production, development) |

---

## 14. Code Quality

### 14.1. TypeScript Strictness

The project uses strict TypeScript configuration:

```json
{
  "strict": true,
  "strictNullChecks": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true
}
```

### 14.2. ESLint Rules

Key rules enforced by ESLint:

- **React**: JSX scope, prop types, key props, fragments
- **TypeScript**: Consistent type imports, no explicit any (warn)
- **Accessibility**: Alt text, ARIA roles, heading hierarchy
- **Import**: Ordering, no duplicates, no unresolved paths
- **General**: No debugger, prefer const, no unused expressions

### 14.3. Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 14.4. Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files | PascalCase for components | `ClockPage.tsx` |
| Files | camelCase for utilities | `clockUtils.ts` |
| Components | PascalCase | `ClockPage`, `MonthDropdown` |
| Functions | camelCase | `formatTime`, `calculateAngles` |
| CSS Modules | camelCase class names | `styles.container` |
| Types/Interfaces | PascalCase | `ClockItem`, `FontConfig` |
| Constants | UPPER_SNAKE_CASE | `MAX_FONT_WAIT` |

---

## Appendices

### A. Migration Checklist

When migrating old clock components to current standards:

- [ ] Replace `useClockTime` from `@/utils/clockUtils` with `useSecondClock` from `@/utils/hooks`
- [ ] Replace `useState` + `setInterval` with `useSecondClock` or `useMillisecondClock`
- [ ] Replace inline `<style>` tags with CSS Modules
- [ ] Replace `useGlobalStyles`/`useKeyframes` with CSS Modules
- [ ] Add `export const assets` for preloading pipeline
- [ ] Wrap component in `React.memo` + set `displayName`
- [ ] Add semantic `<time>` element
- [ ] Remove unused imports

### B. Deprecated Modules

| Module | Replacement | Status |
|--------|-------------|--------|
| `src/hooks/useClockTime.ts` | `@/utils/hooks` | Re-export only |
| `src/utils/clockUtils.ts` (useClockTime) | `@/utils/hooks` | Re-export only |
| `src/utils/enhancedFontLoader.ts` | `@/utils/fontLoader` | Deprecated |
| `src/utils/assetLoader.ts` (font loaders) | `@/utils/fontLoader` | Deprecated |
| `src/utils/performance.ts` | N/A | Unused, removed |
| `src/utils/useClock.ts` | `@/utils/hooks` | Removed |
| `src/utils/useSmoothClock.ts` | `@/utils/hooks` | Removed |
