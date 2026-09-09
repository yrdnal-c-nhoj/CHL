import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';
import limesImage from '@/assets/images/26_images/26-09/26-09-05/limm.webp';
import limeImage from '@/assets/images/26_images/26-09/26-09-05/lime2.webp';
import limeslImage from '@/assets/images/26_images/26-09/26-09-05/lime3.webp';
import minuteDot from '@/assets/images/26_images/26-09/26-09-05/hour.webp';
import hourDot from '@/assets/images/26_images/26-09/26-09-05/minute.webp';
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

      {/* Primary background */}
      <img
        src={limesImage}
        alt=""
        aria-hidden="true"
        className={styles.backgroundImagePrimary}
      />

      {/* Secondary & Tertiary background overlays */}
      <div
        aria-hidden="true"
        className={styles.backgroundImageSecondary}
        style={{ '--bg-img': `url(${limeImage})` } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className={styles.backgroundImageTertiary}
        style={{ '--bg-img': `url(${limeslImage})` } as React.CSSProperties}
      />

      {/* Analog clock */}
      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--angle': `${hourAngle}deg` } as React.CSSProperties}
        >
          <img src={hourDot} alt="" className={styles.handDot} />
        </div>

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--angle': `${minuteAngle}deg` } as React.CSSProperties}
        >
          <img src={minuteDot} alt="" className={styles.handDot} />
        </div>

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ '--angle': `${secondAngle}deg` } as React.CSSProperties}
        >
          <img src={secondDot} alt="" className={styles.handDot} />
        </div>

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