import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import { memo, useMemo, useState, useEffect } from 'react';

import cinnabarImage from '@/assets/images/26_images/26-10/26-10-04/cinnabar.webp';
import mercImage from '@/assets/images/26_images/26-10/26-10-04/merc.webp';

import styles from './Clock.module.css';

export const assets = [
  cinnabarImage,
  mercImage,
];

const Clock_26_10_04 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 50);

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
    <main
      className={styles.container}
      style={
        {
          '--merc-border': `url(${mercImage})`,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${cinnabarImage})`,
        }}
      />

      <div className={styles.mercuryBottom} />

      <div className={styles.clockFace}>
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '1.4vmin',
              '--hand-height': '22vmin',
              '--hand-rotate': `${hourAngle}deg`,
              '--hand-color': '#ffffff',
            } as React.CSSProperties
          }
        />

        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '1vmin',
              '--hand-height': '32vmin',
              '--hand-rotate': `${minuteAngle}deg`,
              '--hand-color': '#ffffff',
            } as React.CSSProperties
          }
        />

        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.4vmin',
              '--hand-height': '36vmin',
              '--hand-rotate': `${secondAngle}deg`,
              '--hand-color': '#a12235',
            } as React.CSSProperties
          }
        />

        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

const MemoizedClock = memo(Clock_26_10_04);

MemoizedClock.displayName = 'Clock_26_10_04';

export default MemoizedClock;