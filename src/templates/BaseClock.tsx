import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
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
 * New clock workflow:
 * 1. Read docs/ARCHITECTURE.md and docs/CLOCKS.md.
 * 2. Create the new date-based page under src/pages/YYYY/YY-MM/YY-MM-DD/.
 * 3. Copy this file and BaseClock.module.css as the starting structure.
 * 4. Add the page to src/context/clockpages.json.
 * 5. Customize the artwork, assets, typography, and layout.
 * 6. Run the current validation commands before committing.
 *
 * See CONTRIBUTING.md for the human contribution workflow and
 * AGENTS.md for AI coding-agent requirements.
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
  // { fontFamily: 'MyClockFont', fontUrl: fontUrl }
];

// =========================
// UTILITY FUNCTIONS
// =========================
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

// =========================
// MAIN COMPONENT
// =========================
const BaseClock = () => {
  const time = useClock();

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
