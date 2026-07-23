import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import nefertitiImage from '@/assets/images/26_images/26-07/26-07-23/Nefertiti.webp';
import videoBackground from './gemini.mp4';

import styles from './Clock.module.css';

export const assets = [videoBackground, nefertitiImage];

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();

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
      <div className={styles.gemOverlay} style={{ '--gem-image': `url(${nefertitiImage})` } as React.CSSProperties} />
      <div className={styles.yellowOverlay} />
      {/* Visually hidden time for accessibility, matching your standard */}
      <time dateTime={isoTime} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clock}>
        <div className={styles.face}>
          {romanNumerals.map((numeral, i) => (
            <div
              key={numeral}
              className={styles.numeralContainer}
              style={{ transform: `rotate(${(i + 1) * 30}deg)` }}
            >
              <div className={styles.numeral} style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}>
                {numeral}
              </div>
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );
};

AnalogClock.displayName = 'AnalogClock_26_07_23';

export default AnalogClock;