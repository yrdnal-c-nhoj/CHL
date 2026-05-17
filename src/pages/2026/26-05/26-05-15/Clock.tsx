import React from 'react';
import { useClockTime } from '@/utils/hooks/useClockTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

import font from '@/assets/fonts/2026/26-05-15.ttf?url';
import backgroundImage from '@/assets/images/2026/26-05/26-05-15/rings.webp';

export const assets = [font, backgroundImage];

const stackSpacingVh = 0; // vertical distance between each clock row (0 => clocks touch/no gap)






const fontConfig = [
  {
    fontFamily: 'CustomFont',
    fontUrl: font,
  },
];

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useSuspenseFontLoader(fontConfig);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const isoTime = currentTime.toISOString();

  const ariaBase = `${hours}:${minutes}:${seconds}`;
  const offsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <main className={styles.container}>
      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img
          src={backgroundImage}
          alt=""
          className={styles.backgroundImage}
          decoding="async"
          loading="eager"
          draggable={false}
        />
      </div>

      {offsets.map((offset) => {
        const y = offset * stackSpacingVh;
        return (
          <div
            key={offset}
            className={styles.clockRow}
            style={{
              top: '50%',
              transform: `translateX(-50%) translateY(${y}vh)`,
            }}
          >
            <time
              className={styles.clockDisplay}
              dateTime={isoTime}
              aria-label={ariaBase}
            >
              <span className={styles.timeSegment}>{hours}</span>

              <span className={styles.separator}>:</span>

              <span className={styles.timeSegment}>{minutes}</span>

              <span className={styles.separator}>:</span>

              <span className={styles.timeSegment}>{seconds}</span>
            </time>
          </div>
        );
      })}
    </main>
  );
};

export default DigitalClock;