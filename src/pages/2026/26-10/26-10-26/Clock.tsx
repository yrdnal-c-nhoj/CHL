import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';

import laptopBillboard from '@/assets/images/26_images/26-10/26-10-26/billboard2.webp';
import phoneBillboard from '@/assets/images/26_images/26-10/26-10-26/billboard3.webp';

import styles from './Clock.module.css';

export const assets = [laptopBillboard, phoneBillboard];

type HandStyle = CSSProperties & {
  '--angle': string;
};

const Clock_26_10_26 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 50);
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  return (
    <main className={styles.scene}>
      <SRTime time={time} />

      <picture className={styles.backdrop}>
        <source media="(max-width: 40rem)" srcSet={phoneBillboard} />
        <img className={styles.backdropImage} src={laptopBillboard} alt="" />
      </picture>

      <div className={styles.clockCase} aria-hidden="true">
        <div className={styles.face}>
          <div className={styles.ticks}>
            {Array.from({ length: 60 }, (_, index) => (
              <span
                key={index}
                className={`${styles.tick} ${index % 5 === 0 ? styles.majorTick : ''}`}
                style={{ transform: `rotate(${index * 6}deg)` }}
              />
            ))}
          </div>

          {Array.from({ length: 12 }, (_, index) => {
            const number = index + 1;
            const angle = (number * 30 * Math.PI) / 180;
            const radius = 36;

            return (
              <span
                key={number}
                className={styles.numeral}
                style={{
                  left: `${50 + radius * Math.sin(angle)}%`,
                  top: `${50 - radius * Math.cos(angle)}%`,
                }}
              >
                {number}
              </span>
            );
          })}

          <span className={styles.brand}>BORROWED TIME</span>

          <span
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--angle': `${hourAngle}deg` } as HandStyle}
          />
          <span
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ '--angle': `${minAngle}deg` } as HandStyle}
          />
          <span
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ '--angle': `${secAngle}deg` } as HandStyle}
          />
          <span className={styles.centerPin} />
        </div>
      </div>
    </main>
  );
};

Clock_26_10_26.displayName = 'Clock_26_10_26';

export default Clock_26_10_26;
