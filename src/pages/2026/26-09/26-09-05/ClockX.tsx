import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';
import limesImage from '@/assets/images/26_images/26-09/26-09-05/limm.webp';
import limeImage from '@/assets/images/26_images/26-09/26-09-05/lime2.webp';
import limeslImage from '@/assets/images/26_images/26-09/26-09-05/lime3.webp';
import hourDot from '@/assets/images/26_images/26-09/26-09-05/hour.webp';
import minuteDot from '@/assets/images/26_images/26-09/26-09-05/minute.webp';
import secondDot from '@/assets/images/26_images/26-09/26-09-05/second.webp';
import font from '@/assets/fonts/26fonts/26-09-05.ttf?url';
import styles from './Clock.module.css';

export const assets = [
  limesImage,
  limeImage,
  limeslImage,
  hourDot,
  minuteDot,
  secondDot,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_05',
  fontUrl: font,
};

const Clock_26_09_05 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours() % 12;
    return {
      hourAngle: h * 30 + m * 0.5,
      minuteAngle: m * 6 + s * 0.1,
      secondAngle: s * 6,
    };
  }, [time]);

  const fullTimeString = time.toLocaleTimeString();

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

      {/* Primary lime image */}
      <img
        src={limesImage}
        alt=""
        aria-hidden="true"
        className={styles.backgroundImagePrimary}
      />

      {/* Secondary lime overlay */}
      <div
        aria-hidden="true"
        className={styles.backgroundImageSecondary}
        style={{ backgroundImage: `url(${limeImage})` }}
      />

      {/* Tertiary lime slice overlay */}
      <div
        aria-hidden="true"
        className={styles.backgroundImageTertiary}
        style={{ backgroundImage: `url(${limeslImage})` }}
      />

      {/* Analog clock */}
      <div className={styles.clockFace}>
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.5vmin',
              '--hand-height': '18vmin',
              '--hand-rotate': `${hourAngle}deg`,
              '--hand-color': '#a3e635',
            } as React.CSSProperties
          }
        >
          <img src={hourDot} alt="" className={styles.handDot} />
        </div>
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.35vmin',
              '--hand-height': '26vmin',
              '--hand-rotate': `${minuteAngle}deg`,
              '--hand-color': '#a3e635',
            } as React.CSSProperties
          }
        >
          <img src={minuteDot} alt="" className={styles.handDot} />
        </div>
        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.2vmin',
              '--hand-height': '32vmin',
              '--hand-rotate': `${secondAngle}deg`,
              '--hand-color': '#a3e635',
            } as React.CSSProperties
          }
        >
          <img src={secondDot} alt="" className={styles.handDot} />
        </div>
        <div className={styles.centerDot} />
      </div>

      {/* Screen-reader-only time */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {fullTimeString}
      </time>
    </main>
  );
};

Clock_26_09_05.displayName = 'Clock_26_09_05';

export default Clock_26_09_05;
