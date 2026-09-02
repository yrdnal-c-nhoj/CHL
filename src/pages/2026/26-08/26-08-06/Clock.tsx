import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { Fragment, memo, useMemo } from 'react';
import styles from './Clock.module.css';

// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-08-06.ttf?url';
// Import the background video
import clockVideo from '@/assets/images/26_images/26-08/26-08-06/buzz.mp4';

// 1. Asset Exports (Required for preloading pipeline)

export const assets: string[] = [clockVideo, fontUrl];

// 2. Font Configuration (if custom fonts are used)
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_04',
    fontUrl,
  },
];

// 3. Main Component
const ClockComponent =  () => {
  // Use the standardized time hook
  // 16ms = ~60 FPS updates for perfectly smooth, continuous forward movement
  const time = useSmoothClock(16);

  // Load fonts via Suspense (component must be in <Suspense> boundary)
  useSuspenseFontLoader(fontConfigs);

  // Digital clock values
  const { hours, minutes, seconds, milliseconds } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s, milliseconds: ms };
  }, [time]);

  // Accessible standard ISO/time display for assistive tech
  const timeString = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;

  return (
    <main className={styles.container}>
      <video
        src={clockVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {timeString}
      </time>

      {/* Digital Clock UI */}
      <div className={styles.digitalClock}>
        {[hours, minutes, seconds, milliseconds].map((unit, i) => (
          <Fragment key={i}>
            {unit.split('').map((digit, j) => (
              <span key={`${i}-${j}`}>{digit}</span>
            ))}
          </Fragment>
        ))}
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_04';

export default MemoizedClock;