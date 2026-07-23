import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-20.ttf?url';
import gemImage from '@/assets/images/26_images/26-07/26-07-23/gem.webp';
import videoBackground from '@/assets/images/26_images/26-07/26-07-23/gemini.mp4';

import styles from './Clock.module.css';

export const assets = [videoBackground, fontUrl, gemImage];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_27',
    fontUrl,
  },
];

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    const totalSeconds = s + ms / 1000;
    const totalMinutes = m + totalSeconds / 60;
    const totalHours = (h % 12) + totalMinutes / 60;

    return {
      secondDeg: totalSeconds * 6,
      minuteDeg: totalMinutes * 6,
      hourDeg: totalHours * 30,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={videoBackground}
      />
      <div className={styles.gemOverlay} style={{ '--gem-image': `url(${gemImage})` } as React.CSSProperties} />
      <div className={styles.yellowOverlay} />
      <div className={styles.clock}>
        <time className={styles.face} dateTime={isoTime}>
          <div
            className={styles.hand + ' ' + styles.hourHand}
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <div
            className={styles.hand + ' ' + styles.minuteHand}
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />
          <div
            className={styles.hand + ' ' + styles.secondHand}
            style={{ transform: `rotate(${secondDeg}deg)` }}
          />
          <div className={styles.centerDot} />
        </time>
      </div>
    </div>
  );
};

export default AnalogClock;