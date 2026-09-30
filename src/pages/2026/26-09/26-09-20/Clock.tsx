import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, useState, useEffect } from 'react';

import limeVideo from '@/assets/images/26_images/26-09/26-09-20/radar.webm';
import font from '@/assets/fonts/26fonts/26-09-20.otf?url';

import styles from './Clock.module.css';

export const assets = [limeVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_20',
  fontUrl: font,
};

const Clock_26_09_20 = () => {
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
      {/* SVG filter definitions */}
      <svg
        className={styles.filterSvg}
        aria-hidden="true"
      >
        <defs>
          <filter id="removeRed">
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Background video */}
      <video
        src={limeVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      {/* Analog clock */}
      <div className={styles.clockFace}>
        {/* Clock numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const number = i + 1;

          // 12 is at the top, then clockwise around the face.
          const angle = (number * 30 * Math.PI) / 180;

          // Percentage of the clock-face radius.
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
                transform:
                  `translate(-50%, -50%) ` +
                  `rotate(${number * 30}deg)`,
              }}
            >
              {number}
            </span>
          );
        })}

        {/* Hour hand */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--angle': `${hourAngle}deg`,
            } as React.CSSProperties
          }
        />

        {/* Minute hand */}
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--angle': `${minuteAngle}deg`,
            } as React.CSSProperties
          }
        />

        {/* Second hand */}
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
            } as React.CSSProperties
          }
        />

        {/* Center */}
        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_20.displayName = 'Clock_26_09_20';

export default Clock_26_09_20;