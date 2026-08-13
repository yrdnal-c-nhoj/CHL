import glassVideo from '@/assets/images/26_images/26-06/26-06-19/glass.mp4';
import glassVideo2 from '@/assets/images/26_images/26-06/26-06-19/glass3.mp4';
import glassbreak from '@/assets/images/26_images/26-06/26-06-19/glassbreak.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-06-19.otf?url';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassVideo, glassbreak, glassVideo2];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_19',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const DigitalClock =  () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, ampm } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();

    const ampm = h >= 12 ? 'PM' : 'AM';
    let hours12 = h % 12;
    if (hours12 === 0) hours12 = 12;

    return {
      hours: hours12.toString(),
      minutes: formatTime(m),
      ampm,
    };
  }, [time]);

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${glassbreak})` }}>
      {/* Accessible time element (Required) */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      {/* Flipped background layer sitting directly on top of the original */}
      <div
        className={styles.flippedBackground}
        style={{ backgroundImage: `url(${glassbreak})` }}
      />

      <video
        src={glassVideo2}
        className={styles.videoLayer}
        style={{ opacity: 0.2, zIndex: 0 }}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        src={glassVideo}
        className={styles.videoLayer}
        style={{ opacity: 0.4, zIndex: 1 }}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.timeDisplay}>
        {hours}:{minutes}
        <span className={styles.ampm}>{ampm}</span>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(DigitalClock);
MemoizedClock.displayName = 'Clock_26_06_19';

export default MemoizedClock;