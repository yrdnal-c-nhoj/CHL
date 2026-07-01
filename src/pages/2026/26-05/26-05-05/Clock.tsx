import React, { useMemo } from 'react';

import shapesFont from '@/assets/fonts/26fonts/26-05-05-dino.ttf?url';
import clockImage from '@/assets/images/26_images/26-05/26-05-05/dino.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [clockImage, shapesFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const Clock: React.FC = () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digits = timeString.split('');

  return (
    <div className={styles.clockWrapper}>
      <div className={styles.background} style={{ backgroundImage: `url(${clockImage})` }} />
      <time
        dateTime={time.toISOString()}
        aria-label={`Current time is ${time.toLocaleTimeString()}`}
        className={styles.clockContainer}
      >
        {digits.map((digit, index) => (
          <div key={index} className={styles.digit}>
            {digit}
          </div>
        ))}
      </time>
    </div>
  );
};

export default Clock;
