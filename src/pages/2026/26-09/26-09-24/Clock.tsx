import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

/**
 * Clock_26_09_24 - Starting template for a new BorrowedTime clock.
 *
 * The template demonstrates the minimum structure expected by the current
 * clock contract. Copy it into a date directory, then customize the artwork,
 * assets, typography, and layout.
 *
 * New clock workflow:
 * 1. Read docs/ARCHITECTURE.md and docs/CLOCKS.md.
 * 2. Create the date directory under src/pages/YYYY/YY-MM/YY-MM-DD/.
 * 3. Copy this file and Clock_26_09_24.module.css when CSS Modules are appropriate.
 * 4. Add the clock-specific assets and font configuration.
 * 5. Change the component name and displayName to match the new clock.
 * 6. Add optional title/tags metadata to src/context/clockpages.json.
 * 7. Run the current validation commands before committing.
 *
 * The presence of Clock.tsx is what makes a clock available. Metadata does not
 * publish or register a clock.
 */

// =========================
// ASSET EXPORTS
// =========================
export const assets: string[] = [];

// =========================
// FONT CONFIGURATION
// =========================
const fontConfigs: FontConfig[] = [];

// =========================
// UTILITY FUNCTIONS
// =========================
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

// =========================
// MAIN COMPONENT
// =========================
const Clock_26_09_24 = () => {
  const time = useClock();

  useSuspenseFontLoader(fontConfigs);

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <time dateTime={time.toISOString()} className={styles.timeDisplay}>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </span>
        <span className={styles.separator} aria-hidden="true">:
        </span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </span>
        <span className={styles.separator} aria-hidden="true">:
        </span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </span>
      </time>
    </main>
  );
};

// Required by the current clock contract. Replace the placeholder with the
// actual date-specific identity when this template is copied.
Clock_26_09_24.displayName = 'Clock_26_09_24';

export default Clock_26_09_24;
