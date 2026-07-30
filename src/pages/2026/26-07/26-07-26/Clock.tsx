import React, { useMemo } from 'react';

import gemImage from '@/assets/images/26_images/26-07/26-07-26/gem.png';
import backgroundVideo from '@/assets/images/26_images/26-07/26-07-26/ink.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

// 1. Asset Exports (Required)
export const assets = [backgroundVideo, gemImage];

// 2. Font Configuration
// The font is loaded via @import in the CSS, so no JS loader config is needed.
const fontConfigs: FontConfig[] = [
  { fontFamily: 'Almendra Display', fontUrl: 'https://fonts.googleapis.com/css2?family=Almendra+Display&display=swap' },
];

// 3. Main Component
const ClockComponent: React.FC = () => {
  // 3a. Use standard hooks for time and font loading.
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  // 3b. Memoize expensive calculations.
  const { hourAngle, minuteAngle, secondAngle } =
    useMemo(() => {
      const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
      const minutes = time.getMinutes() + seconds / 60;
      const hours = time.getHours() + minutes / 60;

      return {
        hourAngle: (hours % 12) * 30,
        minuteAngle: minutes * 6,
        secondAngle: seconds * 6,
      };
    }, [time]);

  // Memoize the numerals array
  const numerals = useMemo(() => {
    const roman = [
      'XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
    ];
    return roman.map((numeral, index) => ({
      numeral,
      // Rotate each numeral to its correct position on the clock face
      rotation: index * 30,
    }));
  }, []);

  return (
    <main className={styles.container}>
      {/* Background Layers */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
        src={backgroundVideo}
      />
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.flippedVideoBackground}
        src={backgroundVideo}
      />
      <div className={styles.yellowOverlay} />
      <div
        className={styles.gemOverlay}
        style={{ '--gem-image': `url(${gemImage})` } as React.CSSProperties}
      />

      {/* Accessible time element (Required) */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      {/* Clock UI */}
      <div className={styles.clock}>
        <div className={styles.face}>
          {/* Numerals */}
          <div className={styles.numeralContainer}>
            {numerals.map(({ numeral, rotation }) => (
              <div
                key={numeral}
                className={styles.numeral}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <span style={{ transform: `rotate(${-rotation}deg)` }}>
                  {numeral}
                </span>
              </div>
            ))}
          </div>

          {/* Hands */}
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--hand-angle': `${hourAngle}deg` } as React.CSSProperties}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={
              { '--hand-angle': `${minuteAngle}deg` } as React.CSSProperties
            }
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={
              { '--hand-angle': `${secondAngle}deg` } as React.CSSProperties
            }
          />

          <div className={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

// 4. Performance and Debugging (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_2026_07_26';

export default MemoizedClock;