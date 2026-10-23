import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';

import clockFont from '@/assets/fonts/26fonts/26-10-22.otf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_22',
  fontUrl: clockFont,
};

const hourValues = Array.from({ length: 12 }, (_, index) => index + 1);

function LaserHand({
  angle,
  className,
}: {
  angle: number;
  className: string | undefined;
}) {
  return (
    <div
      className={`${styles.hand} ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <svg
        className={styles.laserLines}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line className={styles.laserEdge} x1="0" y1="100" x2="50" y2="0" />
        <line className={styles.laserEdge} x1="100" y1="100" x2="50" y2="0" />
        <line className={styles.laserCore} x1="0" y1="100" x2="50" y2="0" />
        <line className={styles.laserCore} x1="100" y1="100" x2="50" y2="0" />
      </svg>
    </div>
  );
}

function Clock_26_10_22() {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        {hourValues.map((hour) => {
          const angle = (hour * Math.PI) / 6 - Math.PI / 2;

          return (
            <span
              className={styles.binaryNumber}
              key={hour}
              style={{
                left: `${50 + 38 * Math.cos(angle)}%`,
                top: `${50 + 38 * Math.sin(angle)}%`,
              }}
            >
              {hour.toString(2).padStart(4, '0')}
            </span>
          );
        })}

        <LaserHand angle={hourAngle} className={styles.hourHand} />
        <LaserHand angle={minuteAngle} className={styles.minuteHand} />
        <LaserHand angle={secondAngle} className={styles.secondHand} />
      </div>
    </main>
  );
}

Clock_26_10_22.displayName = 'Clock_26_10_22';

export default Clock_26_10_22;
