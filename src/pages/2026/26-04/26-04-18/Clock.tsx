import { memo, useMemo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';
import fontUrl from '@/assets/fonts/26fonts/26-04-18-h1.ttf?url';
import bgImg from '@/assets/images/26_images/26-04/26-04-18/radio.webp';

export const assets = [fontUrl, bgImg];

const Clock =  () => {
  const time = useSmoothClock();

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'H1', fontUrl }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const size = 'min(100vw, 100dvh)';
  const cell = `calc(${size} / 2)`;

  return (
    <main className={styles.container} style={{ '--cell': cell } as React.CSSProperties}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

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
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_18';
export default MemoizedClock;