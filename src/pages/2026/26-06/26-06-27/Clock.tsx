import chandelierBg from '@/assets/images/26_images/26-06/26-06-27/clover.mp4';
import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-06-27.otf?url';

export const assets = [chandelierBg, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_27',
    fontUrl,
  },
];

// --- Helper for generating clock numerals ---
// Scaled coordinates up to an 800x800 internal grid system
const generateNumbers = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const number = i + 1;
    if (number % 3 === 0) {
      const angle = number * 30; // 30 degrees per hour
      // Center is now 400, 400. Radius is expanded to 280 to accommodate large font padding
      const x = 400 + 280 * Math.sin((angle * Math.PI) / 180);
      const y = 400 - 280 * Math.cos((angle * Math.PI) / 180);
      return {
        key: i,
        x,
        y,
        number,
      };
    }
    return null;
  }).filter(Boolean) as { key: number; x: number; y: number; number: number }[];
};

const AnalogClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);

  // Use the more performant hook since smooth motion is handled by CSS transitions
  const time = useSecondClock();
  const clockNumbers = useMemo(() => generateNumbers(), []);
  const { hourAngle, minuteAngle, secondAngle } = useClockAngles(time);

  return (
    <main className={styles.container}>
      {/* Accessible time element (Required) */}
      <SRTime time={time} />

      <video
        src={chandelierBg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={styles.backgroundVideo}
      />
      <svg
        width="400"
        height="400"
        viewBox="0 0 800 800"
        className={styles.analogClock}
      >
        {/* Clock Face */}
        <g>
          {clockNumbers.map(({ key, x, y, number }) => (
            <text key={key} x={x} y={y} className={styles.numberText}>
              {number}
            </text>
          ))}
        </g>

        {/* Hands */}
        <g>
          <line x1="400" y1="400" x2="400" y2="260" className={styles.hourHand} style={{ transform: `rotate(${hourAngle}deg)` }} />
          <line x1="400" y1="400" x2="400" y2="180" className={styles.minuteHand} style={{ transform: `rotate(${minuteAngle}deg)` }} />
          <line x1="400" y1="400" x2="400" y2="140" className={styles.secondHand} style={{ transform: `rotate(${secondAngle}deg)` }} />
        </g>
      </svg>
    </main>
  );
};

const MemoizedClock = React.memo(AnalogClockComponent);
MemoizedClock.displayName = 'Clock_26_06_27';

export default MemoizedClock;