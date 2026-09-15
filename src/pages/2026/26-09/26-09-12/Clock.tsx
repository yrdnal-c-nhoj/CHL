
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';

import limeVideo from '@/assets/images/26_images/26-09/26-09-12/oz2.webm';
import font from '@/assets/fonts/26fonts/26-09-12.ttf?url';

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

      {/* Centered clock */}
      <div className={styles.clockFace}>
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