import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-28.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-07/26-07-29/eiffel.mp4';

import styles from './Clock.module.css';
// ======================================================
// Config & Constants
// ======================================================

export const assets = [backgroundVideo, fontUrl];

// ======================================================
// Main Component
// ======================================================

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_28',
    fontUrl,
  },
];

const ClockComponent =  () => {
  const currentTime = useMillisecondClock();

  useSuspenseFontLoader(FONT_CONFIGS);

  const { hours, minutes, seconds, milliseconds, isoTime } = useMemo(() => {
    const h = currentTime.getHours().toString().padStart(2, '0');
    const m = currentTime.getMinutes().toString().padStart(2, '0');
    const s = currentTime.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(currentTime.getMilliseconds() / 10)
      .toString()
      .padStart(2, '0');
    return {
      hours: h,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      isoTime: currentTime.toISOString(),
    };
  }, [currentTime]);

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        className={styles.backgroundLayer}
      />

      <div className={styles.face}>
        <div className={styles.digitGroup}>
          <span className={styles.digitGroup}>
            <span className={styles.digitBox}>{hours[0]}</span>
            <span className={styles.digitBox}>{hours[1]}</span>
            <span className={styles.digitBox}>{minutes[0]}</span>
            <span className={styles.digitBox}>{minutes[1]}</span>
            <span className={styles.digitBox}>{seconds[0]}</span>
            <span className={styles.digitBox}>{seconds[1]}</span>
            <span className={styles.digitBox}>{milliseconds[0]}</span>
            <span className={styles.digitBox}>{milliseconds[1]}</span>
          </span>
        </div>
      </div>

      {/* Accessible time element as per ARCHITECTURE.md */}
      <time dateTime={isoTime} className={styles.srOnly}>
        {currentTime.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_07_28';

export default MemoizedClock;
