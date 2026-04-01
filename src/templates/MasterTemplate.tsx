import React, { useMemo } from 'react';
import { useClock } from '../../utils/useClock';
import { useSuspenseFontLoader } from '../../utils/fontLoader';
import type { FontConfig } from '../../types/clock';
import styles from './Clock.module.css';

// 1. Export assets for the preloading pipeline
// import bgImg from './background.webp';
// export { bgImg };

export const fontConfigs: FontConfig[] = [
  // { fontFamily: 'ClockFont', fontUrl: '/fonts/font.woff2' }
];

const Clock: React.FC = () => {
  const { time, smoothSeconds } = useClock();

  // Load fonts and suspend if necessary
  useSuspenseFontLoader(fontConfigs);

  // Calculate rotations or animations based on smoothSeconds
  const rotation = useMemo(() => (smoothSeconds / 60) * 360, [smoothSeconds]);

  return (
    <main className={styles.container}>
      <div className={styles.visuals}>
        {/* Your art goes here */}
        <div
          className={styles.hand}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <h1 className={styles.timeDisplay}>{time.toLocaleTimeString()}</h1>
    </main>
  );
};

export default Clock;
