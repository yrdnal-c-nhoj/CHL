import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, useState, useEffect } from 'react';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-06/pen.webm';
import font from '@/assets/fonts/26fonts/26-10-06.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_06',
  fontUrl: font,
};

const Clock_26_10_06 = () => {
  useSuspenseFontLoader([fontConfig]);

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
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clockFace}>
        {Array.from({ length: 12 }, (_, i) => {
          const number = i + 1;
          const angle = (number * 30 * Math.PI) / 180;
          const radius = 34;

          const left = 50 + radius * Math.sin(angle);
          const top = 50 - radius * Math.cos(angle);

          return (
            <span
              key={number}
              className={styles.clockNumber}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform:
                  `translate(-50%, -50%) ` + `rotate(${number * 30}deg)`,
              }}
            >
              {number}
            </span>
          );
        })}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--angle': `${hourAngle}deg`,
            } as React.CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--angle': `${minuteAngle}deg`,
            } as React.CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
            } as React.CSSProperties
          }
        />

        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_06.displayName = 'Clock_26_10_06';

export default Clock_26_10_06;
