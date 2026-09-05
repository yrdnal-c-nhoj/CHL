import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import font from '@/assets/fonts/26fonts/26-09-02.ttf?url';
import peacockVideo from '@/assets/images/26_images/26-09/26-09-02/brain.webm';
import eyesImage from '@/assets/images/26_images/26-09/26-09-02/brain2.webp';

export const assets = [font, peacockVideo, eyesImage];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_02',
  fontUrl: font,
};

const Clock_26_09_02 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(50);

  const { hours, minutes, seconds, centiseconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const cs = time.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
    return { hours: h, minutes: m, seconds: s, centiseconds: cs };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        src={peacockVideo}
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundLayer}
      />
      <div
        className={styles.gridOverlay}
        style={{
          backgroundImage: `url(${eyesImage})`,
          backgroundSize: '90vmin 90vmin',
        }}
      />

      <div className={styles.digitalDisplay}>
        <span className={styles.digitBox}>{hours[0]}</span>
        <span className={styles.digitBox}>{hours[1]}</span>
        <span className={styles.digitBox}>{minutes[0]}</span>
        <span className={styles.digitBox}>{minutes[1]}</span>
        <span className={styles.digitBox}>{seconds[0]}</span>
        <span className={styles.digitBox}>{seconds[1]}</span>
        <span className={styles.digitBox}>{centiseconds[0]}</span>
        <span className={styles.digitBox}>{centiseconds[1]}</span>
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {hours}:{minutes}:{seconds}.{centiseconds}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(Clock_26_09_02);
MemoizedClock.displayName = 'Clock_26_09_02';

export default MemoizedClock;
