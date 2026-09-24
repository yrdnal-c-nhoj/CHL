
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';

import limeVideo from '@/assets/images/26_images/26-09/26-09-22/sunspot.webm';
import font from '@/assets/fonts/26fonts/26-09-22.ttf?url';

import styles from './Clock.module.css';

export const assets = [limeVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_12',
  fontUrl: font,
};

const Clock_26_09_12 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

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
      {/* Background video - three stacked on all viewports */}
      <div className={styles.videoLayout}>
        <video
          src={limeVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className={`${styles.backgroundVideo} ${styles.backgroundVideoTop}`}
        />
        <video
          src={limeVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className={styles.backgroundVideo}
        />
        <video
          src={limeVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className={`${styles.backgroundVideo} ${styles.backgroundVideoBottom}`}
        />
      </div>

      {/* Centered clock */}
      <div className={styles.clockFace}>
        {/* Clock numbers - positioned at perimeter, rotated outward */}
        {Array.from({ length: 12 }, (_, i) => {
          const num = i + 1;
          const angle = num * 30; // 30 degrees per number
          const radius = 42; // percentage from center
          const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const top = 50 - radius * Math.cos((angle * Math.PI) / 180);
          return (
            <span
              key={num}
              className={styles.clockNumber}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              } as React.CSSProperties}
            >
              {num}
            </span>
          );
        })}

        {/* Clock hands */}
        <div className={styles.handLayer}>
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

          {/* Center pivot */}
          <div className={styles.centerDot} />
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_12.displayName = 'Clock_26_09_12';

export default Clock_26_09_12;