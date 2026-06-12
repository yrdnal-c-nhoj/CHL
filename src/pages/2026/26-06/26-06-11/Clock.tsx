import clockFont from '@/assets/fonts/26fonts/26-06-11.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-11/ukulele.webp';
import { useClockTime } from '@/hooks/useClockTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

/**
 * Clock Component for 2026-05-22
 * Features a 6-digit grid layout over a video background.
 */
export const assets = [backgroundImage, clockFont];

const Clock: React.FC = () => {
  const time = useClockTime();

  // Replace these with the specific characters you picked out for your font mapping
  const numbers = useMemo(
    () => ['c', 'X', 'L', 'Y', 'F', 'H', 'U', 'M', 'W', 'T'],
    []
  );

  // Standardized font loading to ensure 'ClockFont_26_05_22' is available
  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'ClockFont_26_05_22',
        fontUrl: clockFont,
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  // Format time into 6 individual digits (HHMMSS) to match the CSS grid
  const digits = useMemo(() => {
    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');
    return (hh + mm + ss).split('').map((digit) => numbers[parseInt(digit)]);
  }, [time, numbers]);

  return (
    <main
      className={styles.container}
      style={{ '--background-image': `url(${backgroundImage})` } as React.CSSProperties}
    >

      <div className={styles.clockFace}>
        <time
          className={styles.digitalGrid}
          dateTime={time.toISOString()}
        >
          {digits.map((digit, index) => (
            <div 
              key={index} 
              className={styles.cell}
              aria-hidden="true"
            >
              {digit}
            </div>
          ))}
        </time>
      </div>
    </main>
  );
};

export default Clock;