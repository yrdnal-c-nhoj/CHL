import React from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import shapesFont from '@/assets/fonts/26fonts/26-03-21-shapes.ttf';
export const assets = [shapesFont];


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

const Clock =  () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useClock();

  const pad = (n: number) => String(n).padStart(2, '0');
  const digits = (
    pad(time.getHours()) +
    pad(time.getMinutes()) +
    pad(time.getSeconds())
  ).split('');

  return (
    <div className={styles.clockWrapper}>
      <div className={styles.clockContainer}>
        {digits.map((digit, index) => (
          <div key={index} className={styles.digit}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
