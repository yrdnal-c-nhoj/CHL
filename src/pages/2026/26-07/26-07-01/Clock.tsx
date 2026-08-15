import labelFont from '@/assets/fonts/26fonts/26-07-01.ttf?url';
import digitFont from '@/assets/fonts/26fonts/26-07-01digit.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

/**
 * July 1, 2026 - Alpha Centauri Cosmic Clock System
 * Features a tight central binary core with an un-clippable outer orbit for Proxima Centauri.
 */

export const assets: string[] = [labelFont, digitFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'DigitFont',
    fontUrl: digitFont,
    options: { weight: 400, style: 'normal' },
  },
  {
    fontFamily: 'LabelFont',
    fontUrl: labelFont,
    options: { weight: 500, style: 'normal' },
  },
];

const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const AlphaCentauriClock =  () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(() => {
    const h = time.getHours();
    const hours12 = h % 12 || 12;
    return {
      hours: formatDigits(hours12),
      minutes: formatDigits(time.getMinutes()),
      seconds: formatDigits(time.getSeconds()),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Accessible time element (Required) */}
      <time dateTime={time.toISOString()} className={styles.semanticTime} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.stage}>
        {/* Core Centered Elements Block */}
        <div className={styles.systemLayout}>
          <span className={styles.label}>Alpha Centauri A</span>
          
          <div className={styles.binarySystem}>
            <div className={styles.starA}>
              <span className={styles.starDigits}>{hours}</span>
            </div>
            <div className={styles.starB}>
              <span className={styles.starDigits}>{minutes}</span>
            </div>
          </div>

          <span className={styles.label}>Alpha Centauri B</span>
        </div>

        {/* Safe Outer Perimeter Pathing Loop */}
        <div className={styles.proximaOrbitTrack}>
          <div className={styles.proximaNode}>
            <div className={styles.proxima}>
              <span className={`${styles.proximaDigits} ${styles.counterRotate}`}>
                {seconds}
              </span>
            </div>
            <span className={`${styles.label} ${styles.counterRotate}`}>
              Proxima Centauri
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(AlphaCentauriClock);
MemoizedClock.displayName = 'Clock_26_07_01';

export default MemoizedClock;