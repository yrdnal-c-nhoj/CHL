import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';

import minuteDot from '@/assets/images/26_images/26-10/26-10-02/eye4.webp';
import hourDot from '@/assets/images/26_images/26-10/26-10-02/eye2.webp';
import secondDot from '@/assets/images/26_images/26-10/26-10-02/eye.webp';
import noseImage from '@/assets/images/26_images/26-10/26-10-02/nose.webp';

import font from '@/assets/fonts/26fonts/26-09-05.ttf?url';

import styles from './Clock.module.css';

export const assets = [
  hourDot,
  minuteDot,
  secondDot,
  noseImage,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_02',
  fontUrl: font,
};

const Clock_26_10_02 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

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
      <div className={styles.radialBackground} aria-hidden="true" />

      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--angle': `${hourAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={hourDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--angle': `${minuteAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={minuteDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={secondDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div className={styles.centerDot} />
      </div>

      <img
        src={noseImage}
        alt=""
        aria-hidden="true"
        className={styles.noseImage}
        draggable={false}
      />

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_02.displayName = 'Clock_26_10_02';

export default Clock_26_10_02;