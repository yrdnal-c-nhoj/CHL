import React from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import styles from './Clock.module.css';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: new URL('../../../assets/fonts/26-03-21-shapes.ttf', import.meta.url).href,
    options: {
      weight: 'normal',
      style: 'normal',
    }
  }
];

const Clock: React.FC = () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const pad = (n: number) => String(n).padStart(2, '0');
  const digits = (pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds())).split('');

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