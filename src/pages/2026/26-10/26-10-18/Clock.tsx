import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-18/snowflake.webm';

import styles from './Clock.module.css';

export const assets = [backgroundVideo];

const Clock_26_10_18 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 16);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const milliseconds = time.getMilliseconds();

    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: hours * 30,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        autoPlay={!prefersReducedMotion}
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
        src={backgroundVideo}
      />

      <div className={styles.clockFace}>
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '2.2vmin',
              '--hand-height': '26vmin',
              '--hand-rotate': `${hourAngle}deg`,
            } as CSSProperties
          }
        />
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '1.2vmin',
              '--hand-height': '46vmin',
              '--hand-rotate': `${minuteAngle}deg`,
            } as CSSProperties
          }
        />
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.6vmin',
              '--hand-height': '49vmin',
              '--hand-rotate': `${secondAngle}deg`,
            } as CSSProperties
          }
        />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_18.displayName = 'Clock_26_10_18';

export default Clock_26_10_18;
