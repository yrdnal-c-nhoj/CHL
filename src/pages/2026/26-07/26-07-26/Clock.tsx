import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import nefertitiImage from '@/assets/images/26_images/26-07/26-07-26/gem.webp';
import videoBackground from '@/assets/images/26_images/26-07/26-07-26/gemini.mp4';
// 1. Import the custom font with the `?url` suffix
import customFont from '@/assets/fonts/your-custom-font.otf?url';

import styles from './Clock.module.css';

export const assets = [videoBackground, nefertitiImage, customFont];

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// 2. Define the font configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'GeminiClockFont', fontUrl: customFont },
];

const AnalogClock: React.FC = React.memo(() => {
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

  // 3. Use the hook to suspend rendering until the font is ready
  useSuspenseFontLoader(fontConfigs);

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
      <video
        className={styles.flippedVideoBackground}
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
            <span
              key={numeral}
              className={styles.numeralContainer}
              style={{ transform: `rotate(${(i + 1) * 30}deg)` }}
              // Add aria-label for accessibility
              aria-label={`${i + 1} o'clock`}
            >
              <span
                className={`${styles.numeral} ${styles.yellowText}`}
                style={{ transform: `rotate(-${(i + 1) * 30}deg)` }}
              >
                {numeral}
              </span>
            </span>
          ))}
          <div
            className={`${styles.hand} ${styles.hourHand} ${styles.yellowHand}`}
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand} ${styles.yellowHand}`}
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand} ${styles.yellowHand}`}
            style={{ transform: `rotate(${secondDeg}deg)` }}
          />
          <div className={styles.centerDot} />
        </div>
      </div>
    </div>
  );
});

AnalogClock.displayName = 'AnalogClock_26_07_26';

export default AnalogClock;