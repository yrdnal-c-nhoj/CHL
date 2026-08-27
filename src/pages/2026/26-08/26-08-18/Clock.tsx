import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// 1. Asset Exports (for preloading)
import fontUrl from '@/assets/fonts/26fonts/26-08-18.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-08/26-08-18/eclipse.webm';
import overlayImage from '@/assets/images/26_images/26-08/26-08-18/eclipse.webp';

// According to ARCHITECTURE.md, assets should be exported for the preloading pipeline.
export const assets = [backgroundImage, overlayImage, fontUrl];

// 2. Styles
import styles from './Clock.module.css';

// --- Font Configuration ---
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_18', fontUrl },
];

// 3. Main Component
const ClockComponent =  () => {
  // Use the canonical, performant time hook instead of setInterval.
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();

  // Memoize expensive calculations for both digital and analog clocks
  const { digital } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Digital part
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    return {
      digital: { hours: h, minutes: m, seconds: s },
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <video
        className={styles.backgroundVideo}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className={styles.shadowLiftOverlay} aria-hidden="true" />
      <img
        src={overlayImage}
        className={styles.imageOverlay}
        alt=""
        aria-hidden="true"
      />
      {/* --- Clock UI --- */}
      {/* Digital Clock */}
      <div className={styles.digitalClock}>
        <span className={styles.digit}>{digital.hours[0]}</span>
        <span className={styles.digit}>{digital.hours[1]}</span>
        <span className={styles.digit}>{digital.minutes[0]}</span>
        <span className={styles.digit}>{digital.minutes[1]}</span>
        <span className={styles.digit}>{digital.seconds[0]}</span>
        <span className={styles.digit}>{digital.seconds[1]}</span>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_18';

export default MemoizedClock;