// BTS: Use named imports for hooks and types to satisfy the 'automatic' JSX runtime
import heaFontUrl from '@/assets/fonts/25fonts/25-08-02-hea.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
// Standardized naming: YY-MM-DD-name.webp
import bg2 from '@/assets/images/25_images/25-08/25-08-02/25-08-02-em.webp';
import styles from './Clock.module.css';

// BTS: Export assets for the preloading pipeline
export const assets = [bg2, heaFontUrl];

// BTS: Export font config for pre-buffering
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'hea',
    fontUrl: heaFontUrl,
  },
];

const ClockComponent =  () => {
  const time = useMillisecondClock();

  // BTS: Suspend until font is ready to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Accessible time for screen readers (Required by ARCHITECTURE.md) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* Full-Screen Background Layer for bg2, stretched with distortion */}
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${bg2})` }}
      />

      {/* Clock Display */}
      <div className={styles.digitalClock}>
        <span>{hours}</span>
        <span>:</span>
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_08_02';

export default MemoizedClock;
