import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import backgroundImage from '@/assets/images/26_images/26-11/26-11-06/tiedye.webp';
import clockFont from '@/assets/fonts/26fonts/26-11-06.otf?url';

import styles from './Clock.module.css';

export const assets = [backgroundImage, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_06',
  fontUrl: clockFont,
};

const Clock_26_11_06 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 16);
  useSuspenseFontLoader([fontConfig]);

  const numbers = useMemo(() => {
    const hues = [0, 60, 120, 180, 240, 300, 0, 60, 120, 180, 240, 300];
    // Deterministic pseudo-random for pulseDelay using index-based hash
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12345.6789) * 4321.9876;
      return x - Math.floor(x);
    };
    return Array.from({ length: 12 }, (_, i) => ({
      value: i === 0 ? 12 : i,
      angle: (i === 0 ? 12 : i) * 30,
      hue: hues[i],
      pulseDelay: pseudoRandom(i) * 2,
    }));
  }, []);

  const angles = useMemo(() => {
    const s = time.getSeconds() + (prefersReducedMotion ? 0 : time.getMilliseconds() / 1000);
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return {
      hour: h * 30,
      minute: m * 6,
      second: s * 6,
      background: prefersReducedMotion ? 0 : -s * 6,
    };
  }, [prefersReducedMotion, time]);

return (
    <main
      className={styles.container}
      style={{
        '--hour-angle': `${angles.hour}deg`,
        '--minute-angle': `${angles.minute}deg`,
        '--second-angle': `${angles.second}deg`,
        '--background-angle': `${angles.background}deg`,
      } as Record<string, string>
    }
    >
      <SRTime time={time} />
      <img src={backgroundImage} alt="" aria-hidden="true" className={styles.background} />

      <div className={styles.clockFace} aria-hidden="true">
        <div className={styles.hands}>
          <div className={`${styles.hand} ${styles.hourHand}`} />
          <div className={`${styles.hand} ${styles.minuteHand}`} />
          <div className={`${styles.hand} ${styles.secondHand}`} />
        </div>

        <div className={styles.numbers}>
          {numbers.map((n) => (
            <span
              key={n.value}
              className={styles.number}
              style={{
                '--angle': `${n.angle}deg`,
                '--hue': `${n.hue}`,
                '--pulse-delay': `${n.pulseDelay}s`,
              } as Record<string, string>
            }
            >
              {n.value}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};

Clock_26_11_06.displayName = 'Clock_26_11_06';
export default Clock_26_11_06;