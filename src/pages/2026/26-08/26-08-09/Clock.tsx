import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';

import hoursVideo from '@/assets/images/26_images/26-08/26-08-09/hours.webm?url';
import minutesVideo from '@/assets/images/26_images/26-08/26-08-09/minutes.webm?url';
import secondsVideo from '@/assets/images/26_images/26-08/26-08-09/seconds.webm?url';
import styles from './Clock.module.css';

const FONT_FAMILY = 'IBM Plex Mono';

// 1. Asset Exports (Required for preloading pipeline)
export const assets: string[] = [hoursVideo, minutesVideo, secondsVideo];

const ClockComponent =  () => {
  const time = useSecondClock();

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: FONT_FAMILY,
        fontUrl:
          'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&display=swap',
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.videoWrapper}>
        <div className={styles.videoContainer}>
          <video
            src={hoursVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{hours}</span>
        </div>
        <div className={styles.videoContainer}>
          <video
            src={minutesVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{minutes}</span>
        </div>
        <div className={styles.videoContainer}>
          <video
            src={secondsVideo}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <span className={styles.timeOverlay}>{seconds}</span>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_09';

export default MemoizedClock;