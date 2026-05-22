import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import clockTax from './tax';
import styles from './Clock.module.css';

/**
 * Recycled Internet Clock (25-05-11)
 *
 * Features:
 * - Converted to a robust React/TypeScript component.
 * - Utilizes project-standard hooks for time synchronization.
 * - Follows BTS standards with CSS Modules and semantic HTML.
 */
const Clock: React.FC = () => {
  // Synchronize time using the standard hook
  const time = useClockTime();

  // Setup font loading configuration (memoized)
  const fontConfigs = useMemo<any[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Format components using memoization (BaseClock pattern)
  const { hours, minutes, seconds, isoTime } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return { hours: h, minutes: m, seconds: s, isoTime: time.toISOString() };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.displayBox}>
        <header className={styles.title}>{clockTax.title}</header>
        <time dateTime={isoTime} className={styles.timeDisplay}>
          {hours}:{minutes}:{seconds}
        </time>
        <footer className={styles.footer}>{clockTax.content}</footer>
      </div>
    </main>
  );
};

export default Clock;
