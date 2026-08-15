import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-08-02.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-02/aurora.mp4';

export const assets: string[] = [fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_02',
    fontUrl,
  },
];

const CLOCK_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

const ClockComponent =  () => {
  const time = useMillisecondClock();

  useSuspenseFontLoader(fontConfigs);

  const {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  } = useMemo(() => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() + minutes / 60;
    return {
      second: seconds * 6,
      minute: minutes * 6,
      hour: hours * 30,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      {/* StaticGlobalStyles component removed as per ARCHITECTURE.md */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={backgroundVideo}
      />

      <SRTime time={time} />

      <div className={styles.analogClock}>
        <div className={styles.face}>
          {CLOCK_NUMBERS.map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const radius = 44;
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            const delay = (num * 0.4) % 3;
            const rotationAngle = num * 30; // Rotate each digit so its top points outward from center

            return (
              <span
                key={num}
                className={styles.number}
                style={{ // Dynamic styles remain inline
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`, // Rotate each number to align with the clock's perimeter
                  animationDelay: `${delay}s`,
                }}
              >
                {num}
              </span>
            );
          })}

          <div className={styles.handWrapper}>
            <div
              className={styles.hourHand}
              style={{ // Dynamic transform remains inline
                transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              }}
            />
          </div>

          <div className={styles.handWrapper}>
            <div
              className={styles.minuteHand}
              style={{ // Dynamic transform remains inline
                transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              }}
            />
          </div>

          <div className={styles.handWrapper}>
            <div
              className={styles.secondHand}
              style={{ // Dynamic transform remains inline
                transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              }}
            />
          </div>

          <div className={styles.centerGlow} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_02';

export default MemoizedClock;
