import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import backdropImage from '@/assets/images/26_images/26-10/26-10-26/billboard6.webp';
import fontUrl from '@/assets/fonts/26fonts/26-10-26.otf?url';

import styles from './Clock.module.css';

export const assets = [backdropImage, fontUrl];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_26',
  fontUrl,
};

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
  useSuspenseFontLoader([fontConfig]);
  const { hourAngle, minAngle } = useClockAngles(time);

  return (
    <main className={styles.scene}>
      <SRTime time={time} />

      <img className={styles.backdropImage} src={backdropImage} alt="" />

      <div className={styles.clockCase} aria-hidden="true">
        <div className={styles.face}>
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

          <span
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--angle': `${hourAngle}deg` } as HandStyle}
          />
          <span
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ '--angle': `${minAngle}deg` } as HandStyle}
          />
        </div>
      </div>
    </main>
  );
};

Clock_26_10_26.displayName = 'Clock_26_10_26';

export default Clock_26_10_26;
