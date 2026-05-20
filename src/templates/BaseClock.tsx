import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './BaseClock.module.css';

/**
 * BaseClock - Standardized Clock Component Architecture
 *
 * This component demonstrates the canonical structure for all BorrowedTime clocks:
 *
 * 1. Asset exports for preloading pipeline
 * 2. Font loading with Suspense
 * 3. CSS Module for scoped styles
 * 4. Standard hook for time management
 * 5. Semantic HTML with <time> element
 *
 * New clock workflow: docs/DEVELOPMENT.md
 * 1. npm run clock:new (or copy this file + .module.css)
 * 2. You manually add entry to src/context/clockpages.json
 * 3. Customize assets and layout; npm run finalize
 */

// =========================
// ASSET EXPORTS (Required)
// =========================
// Export any images/fonts for the preloading pipeline in useClockPage.ts
export const assets: string[] = [];

// =========================
// FONT CONFIGURATION
// =========================
const fontConfigs: FontConfig[] = [
  // { fontFamily: 'MyClockFont', fontUrl: new URL('@/assets/fonts/YYYY/YY-MM-DD-name.woff2', import.meta.url).href }
];

// =========================
// UTILITY FUNCTIONS
// =========================
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

// =========================
// MAIN COMPONENT
// =========================
const BaseClock: React.FC = () => {
  // Use standardized hook (1-second updates by default)
  const time = useClockTime();

  // Load fonts via Suspense (component must be wrapped in <Suspense>)
  useSuspenseFontLoader(fontConfigs);

  // Memoize formatted time to prevent unnecessary recalculations
  const { hours, minutes, seconds, isoTime } = useMemo(() => {
    const h = formatDigits(time.getHours());
    const m = formatDigits(time.getMinutes());
    const s = formatDigits(time.getSeconds());
    return {
      hours: h,
      minutes: m,
      seconds: s,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* 
        Use <time> element for semantic HTML.
        datetime attribute provides machine-readable format.
      */}
      <time className={styles.timeDisplay} dateTime={isoTime}>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </span>
      </time>
    </main>
  );
};

export default BaseClock;
