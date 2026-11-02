import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, useState, useEffect } from 'react';

import seedVideo from '@/assets/images/26_images/26-11/26-11-01/seed.mp4';
import fightFont from '@/assets/fonts/26fonts/26-11-01.ttf?url';
import acorn1 from '@/assets/images/26_images/26-11/26-11-01/acorn1.webp';
import acorn2 from '@/assets/images/26_images/26-11/26-11-01/acorn2.webp';
import acorn3 from '@/assets/images/26_images/26-11/26-11-01/acorn3.webp';

import styles from './Clock.module.css';

export const assets = [seedVideo, fightFont, acorn1, acorn2, acorn3];

const fontConfig: FontConfig = {
  fontFamily: 'FightFont_26_11_01',
  fontUrl: fightFont,
};

const Clock = () => {
  useSuspenseFontLoader([fontConfig]);

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
    const ms = time.getMilliseconds();
    const seconds = time.getSeconds() + ms / 1000;
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
        src={seedVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clockFace}>
        {[3, 6, 9, 12].map((number) => {
          const angle = (number * 30 * Math.PI) / 180;
          const radius = 36;
          const left = 50 + radius * Math.sin(angle);
          const top = 50 - radius * Math.cos(angle);
          return (
            <span
              key={number}
              className={styles.clockNumber}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {number}
            </span>
          );
        })}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--angle': `${hourAngle}deg` } as React.CSSProperties}
        >
          <img
            src={acorn1}
            alt=""
            aria-hidden="true"
            className={styles.handAcorn}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--angle': `${minuteAngle}deg` } as React.CSSProperties}
        >
          <img
            src={acorn2}
            alt=""
            aria-hidden="true"
            className={styles.handAcorn}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ '--angle': `${secondAngle}deg` } as React.CSSProperties}
        >
          <img
            src={acorn3}
            alt=""
            aria-hidden="true"
            className={styles.handAcorn}
          />
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_01';
