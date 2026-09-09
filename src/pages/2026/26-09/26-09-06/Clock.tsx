import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';
import limeVideo from '@/assets/images/26_images/26-09/26-09-06/phone.webm';
import font from '@/assets/fonts/26fonts/26-09-06.ttf?url';
import styles from './Clock.module.css';

export const assets = [limeVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_06',
  fontUrl: font,
};

const Clock_26_09_05 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useSmoothClock(16);

  // Calculates smooth, sub-second continuous angles
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;

    return {
      hourAngle: h * 30,
      minuteAngle: m * 6,
      secondAngle: s * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* SVG filter definitions */}
      <svg className={styles.filterSvg} aria-hidden="true">
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

      {/* WebM background video */}
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
        {/* Clock face numbers (1-12) */}
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const theta = ((n - 12) * 30 * Math.PI) / 180;
          const radius = 36;
          return (
            <span
              key={n}
              className={styles.clockNumber}
              style={{
                left: `${50 + radius * Math.sin(theta)}%`,
                top: `${50 - radius * Math.cos(theta)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {n}
            </span>
          );
        })}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--angle': `${hourAngle}deg` } as React.CSSProperties}
        />

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--angle': `${minuteAngle}deg` } as React.CSSProperties}
        />

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ '--angle': `${secondAngle}deg` } as React.CSSProperties}
        />

        <div className={styles.centerDot} />
      </div>

      {/* Screen-reader accessibility time */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

Clock_26_09_05.displayName = 'Clock_26_09_05';

export default Clock_26_09_05;