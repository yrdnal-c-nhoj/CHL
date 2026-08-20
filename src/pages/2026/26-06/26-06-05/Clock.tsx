import clockFont from '@/assets/fonts/26fonts/26-06-05.ttf?url';
import brainGif from '@/assets/images/26_images/26-06/26-06-05/brain.webp';
import sliceImg from '@/assets/images/26_images/26-06/26-06-05/slice.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { useMemo, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [brainGif, sliceImg, clockFont];

const Clock =  () => {
  const time = useSecondClock();

  const fontConfigs: FontConfig[] = useMemo(() => [
    {
      fontFamily: 'ClockFont_26_06_05',
      fontUrl: clockFont,
    },
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const { hour, minute, second } = useMemo(() => {
    const s = time.getSeconds() + time.getMilliseconds() / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return {
      hour: h * 30,
      minute: m * 6,
      second: s * 6,
    };
  }, [time]);
  const isoTime = useMemo(() => time.toISOString(), [time]);

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.background} />
      <div className={styles.overlay} />

      <time dateTime={isoTime} className={styles.analogClock}>
        <div className={styles.face}>
          <div
            className={`${styles.hand} ${styles.hour}`}
            style={{ '--rotation': `${hour}deg` } as React.CSSProperties}
          />
          <div
            className={`${styles.hand} ${styles.minute}`}
            style={{ '--rotation': `${minute}deg` } as React.CSSProperties}
          />
          <div
            className={`${styles.hand} ${styles.second}`}
            style={{ '--rotation': `${second}deg` } as React.CSSProperties}
          />
          <div className={styles.centerDot} />
        </div>
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_05';
export default MemoizedClock;
