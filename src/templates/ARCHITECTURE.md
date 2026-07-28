# Clock Architecture

This document outlines the technical standards and best practices for developing clock components within this project. Adhering to these guidelines ensures consistency, performance, and maintainability.

## 1. Component Structure & Best Practices

Every clock component must be a React Functional Component and adhere to the following structure.

### 1.1. File Template

```typescriptreact
import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// 1. Asset Exports (Required)
import backgroundImage from '@/assets/images/your-image.webp';
import fontUrl from '@/assets/fonts/your-font.otf?url';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration (If custom fonts are used)
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_YYYY_MM_DD', fontUrl }];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // 3a. Use standard hooks for time and font loading.
  const time = useMillisecondClock(); // Or useSecondClock()
  useSuspenseFontLoader(fontConfigs);

  // 3b. Memoize expensive calculations.
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    // ... angle calculations
    return { /* ... */ };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Accessible time element (Required) */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      {/* Clock UI */}
      <div className={styles.clockFace}>
        {/* ... */}
      </div>
    </main>
  );
};

// 4. Performance and Debugging (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_YYYY_MM_DD';

export default MemoizedClock;
```

### 1.2. Core Requirements

*   **Asset Exports**: Each clock **must** export a named `assets` array containing all required static assets (images, fonts, videos). This is critical for the `useClockPage` hook's preloading mechanism.
*   **Styling**: **CSS Modules** are the standard for styling. Create a `Clock.module.css` file alongside your component. This enforces scoped styles and prevents global CSS conflicts. Inline styles should be used only for dynamic properties (e.g., `transform: rotate(...)`).
*   **Accessibility**:
    *   Include a semantic `<time>` element with a valid `dateTime` attribute. For screen reader clarity, it should be visually hidden but accessible.
    *   Use semantic HTML. Interactive elements should be buttons or links, and presentational elements with meaning (like clock numerals) should have `aria-label` attributes.
*   **Performance**:
    *   Wrap the main component export in `React.memo` to prevent unnecessary re-renders.
    *   Assign a `displayName` to the memoized component for easier debugging in React DevTools.
    *   Use `useMemo` for any expensive calculations that are repeated on each render, such as calculating clock hand angles.
*   **Hooks**: Use the standardized time hooks provided in `src/utils/hooks.ts` (`useSecondClock`, `useMillisecondClock`). Do not implement custom `setInterval` or `requestAnimationFrame` logic within components.

## 2. Asset & Dynamic Loading

The `useClockPage` hook is the engine for loading all clocks. Its standards are our standards.

*   **Fail-Open Preloading**: Asset preloading failures or timeouts must not prevent the clock from rendering. The hook is designed to fail open, logging warnings instead of crashing.
*   **Video Preload Strategy**: To ensure a fast initial load, `.mp4` and `.webm` files are automatically excluded from the preload queue *if other assets are present*. If a video is the *only* asset, it will be preloaded.
*   **Resource Safety**: The loader enforces a 10-second global timeout. If a clock and its assets fail to load within this window, the loading overlay is dismissed to prevent the application from getting stuck.

## 3. Font Management

*   **Loading**: Use the `useSuspenseFontLoader` hook to load custom fonts. It suspends component rendering until the font is ready, preventing a flash of unstyled text (FOUT).
*   **Configuration**: Define font configurations in a `FontConfig[]` array, specifying `fontFamily` and `fontUrl`.
*   **Asset Import**: Import font files using Vite's `?url` suffix (e.g., `import fontUrl from './font.otf?url'`). This provides a direct URL for the font loader.

## 4. State Management & Data

*   **Global State**: The `DataContext` (`src/context/DataContext.tsx`) serves as the single source of truth for the list of all available clocks. It is initialized once from `clockpages.json`.
*   **Local State**: Component-level state should be managed with standard React hooks (`useState`, `useMemo`, `useRef`). Avoid introducing external state management libraries into individual clock components.

## 5. Code Quality & Linting

*   **TypeScript**: All new code must be written in TypeScript to ensure type safety.
*   **ESLint**: The project is configured with ESLint rules to enforce code style and catch common errors. Ensure your code is free of linting errors before committing.
*   **Code Clarity**: Write self-documenting code where possible. Add comments to explain complex logic, "magic numbers," or business-critical decisions.

By following these standards, we ensure that the clock gallery remains a high-quality, performant, and delightful experience for both users and developers.
