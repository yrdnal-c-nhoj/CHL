import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import bgVideo from '@/assets/images/26_images/26-11/26-11-23/uni.mp4';
import clockFont from '@/assets/fonts/26fonts/26-11-23.ttf?url';

import styles from './Clock.module.css';

export const assets = [bgVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_23',
  fontUrl: clockFont,
};

const CLOCK_RADIUS = 45;

const digits = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const angle = number * 30;
  const radians = (angle * Math.PI) / 180;

  return {
    number,
    x: 50 + Math.sin(radians) * CLOCK_RADIUS,
    y: 50 - Math.cos(radians) * CLOCK_RADIUS,
    angle,
  };
});

const Clock_26_11_23 = () => {
  const time = useSmoothClock(16);

  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + milliseconds / 1000) * 6;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <video
        className={styles.backgroundVideo}
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className={styles.clock}>
        <div className={styles.clockFace} aria-hidden="true">
          {digits.map(({ number, x, y, angle }) => (
            <span
              key={number}
              className={styles.digit}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `
                  translate(-50%, -50%)
                  rotate(${angle}deg)
                  translateY(-50%)
                `,
              }}
            >
              {String(number).padStart(2, '0')}
            </span>
          ))}

          <div className={styles.hands}>
            <div
              className={styles.hourHand}
              style={{
                transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              }}
            />

            <div
              className={styles.minuteHand}
              style={{
                transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              }}
            />

            <div
              className={styles.secondHand}
              style={{
                transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

Clock_26_11_23.displayName = 'Clock_26_11_23';

export default Clock_26_11_23;
