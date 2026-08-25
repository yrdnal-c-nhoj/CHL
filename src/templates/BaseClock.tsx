import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
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
const BaseClock = () => {
  const time = useSecondClock();

  useSuspenseFontLoader(fontConfigs);

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());
  const isoTime = time.toISOString();

  return (
    <main className={styles.container}>
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
