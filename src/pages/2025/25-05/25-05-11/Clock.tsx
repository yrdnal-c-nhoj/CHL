import React, { useMemo, memo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import clockTax from './tax';
import styles from './Clock.module.css';

export const assets = [];

const Clock =  () => {
  const time = useMillisecondClock();

  const fontConfigs = useMemo<any[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds, isoTime } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return { hours: h, minutes: m, seconds: s, isoTime: time.toISOString() };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>{hours}:{minutes}:{seconds}</time>

      <div className={styles.displayBox}>
        <header className={styles.title}>{clockTax.title}</header>
        <time dateTime={isoTime} className={styles.timeDisplay}>
          {hours}:{minutes}:{seconds}
        </time>
        <footer className={styles.footer}>{clockTax.content}</footer>
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_05_11';
export default MemoizedClock;
