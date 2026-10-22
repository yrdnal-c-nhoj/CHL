import carflyVideo from '@/assets/images/26_images/26-10/26-10-20/carfly.webm';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { memo, type CSSProperties } from 'react';
import styles from './Clock.module.css';

import type { FontConfig } from '@/types/clock';
import clockFont from '@/assets/fonts/26fonts/26-10-20.ttf?url';

export const assets = [carflyVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_20',
  fontUrl: clockFont,
};

const Clock_26_10_20 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const {
    hourAngle,
    minAngle: minuteAngle,
    secAngle: secondAngle,
  } = useClockAngles(time);

  return (
    <main className={styles.container}>
      <video
        src={carflyVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <SRTime time={time} />

      <div className={styles.speedometer} aria-hidden="true">
        <div className={styles.speedometerRim} />
        <div className={styles.speedoArc} />

        <div className={styles.ticks}>
          {Array.from({ length: 60 }, (_, index) => (
            <div
              key={index}
              className={styles.tickPosition}
              style={{ transform: `rotate(${index * 6}deg)` }}
            >
              <div
                className={
                  index % 5 === 0
                    ? `${styles.tickMark} ${styles.majorTick}`
                    : styles.tickMark
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.numbers}>
          {Array.from({ length: 12 }, (_, index) => {
            const hour = index + 1;
            return (
              <div key={hour} className={styles.hourNumber}>
                {hour.toString().padStart(2, '0')}
              </div>
            );
          })}
        </div>

        <div
          className={`${styles.needle} ${styles.hourNeedle}`}
          style={{ '--rotation': `${hourAngle}deg` } as CSSProperties}
        />
        <div
          className={`${styles.needle} ${styles.minuteNeedle}`}
          style={{ '--rotation': `${minuteAngle}deg` } as CSSProperties}
        />
        <div
          className={`${styles.needle} ${styles.secondNeedle}`}
          style={{ '--rotation': `${secondAngle}deg` } as CSSProperties}
        />
        <div className={styles.centerPivot} />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_10_20);
MemoizedClock.displayName = 'Clock_26_10_20';
export default MemoizedClock;
