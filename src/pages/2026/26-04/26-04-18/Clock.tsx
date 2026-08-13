import React, { useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';
import fontUrl from '@/assets/fonts/26fonts/26-04-18-h1.ttf?url';
import bgImg from '@/assets/images/26_images/26-04/26-04-18/radio.webp';

export const assets = [bgImg];

const Clock =  () => {
  const time = useMillisecondClock();

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'H1', fontUrl }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const size = 'min(100vw, 100vh)';
  const cell = `calc(${size} / 2)`;

  return (
    <div
      className={styles.container}
      style={{ '--cell': cell } as React.CSSProperties}
    >
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      <div className={styles.overlay} />
      <div className={styles.grid}>
        <div className={styles.charWrapper}>
          <div className={styles.radioDigit}>{hours[0]}</div>
        </div>
        <div className={styles.charWrapper}>
          <div className={styles.radioDigit}>{hours[1]}</div>
        </div>
        <div className={styles.charWrapper}>
          <div className={styles.radioDigit}>{minutes[0]}</div>
        </div>
        <div className={styles.charWrapper}>
          <div className={styles.radioDigit}>{minutes[1]}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
