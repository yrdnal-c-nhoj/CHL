import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (for preloading)
// NOTE: Please replace these placeholder paths with your actual assets.
import fontUrl from '@/assets/fonts/2026/placeholder-symmetric.otf?url';
import backgroundImage from '@/assets/images/2026/26-08/placeholder-aurora.webp';

export const assets = [backgroundImage, fontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_13', fontUrl },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock();

  // Load fonts via Suspense
  useSuspenseFontLoader(fontConfigs);

  // Memoize expensive calculations for both digital and analog clocks
  const { digital, analog } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');

    return {
      digital: { hours: h, minutes: m, seconds: s },
      analog: {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
      },
    };
  }, [time]);

  const { hourAngle, minuteAngle, secondAngle } = useClockAngles(time);

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      {/* --- Clock UI --- */}
      <div className={styles.clockContainer}>
        {/* Analog Clock */}
        <div className={styles.analogClock}>
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minuteAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secondAngle}deg)` }}
          />
          <div className={styles.centerDot} />
        </div>

        {/* Digital Clock */}
        <div className={styles.digitalClock}>
          <span className={styles.digit}>{digital.hours}</span>
          <span className={styles.separator}>:</span>
          <span className={styles.digit}>{digital.minutes}</span>
          <span className={styles.separator}>:</span>
          <span className={styles.digit}>{digital.seconds}</span>
        </div>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_13';

export default MemoizedClock;