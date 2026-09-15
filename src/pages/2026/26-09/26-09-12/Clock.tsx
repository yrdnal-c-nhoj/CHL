```tsx
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useEffect, useRef, useState } from 'react';

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

  const containerRef = useRef<HTMLElement | null>(null);
  const [clockSize, setClockSize] = useState(0);

  /*
   * Measure the actual rendered container.
   *
   * This is more reliable on mobile Chrome than using 100vh/100dvh
   * directly for the clock geometry. Chrome can change the visual
   * viewport after the initial layout when its address bar settles.
   */
  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const updateSize = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;

      setClockSize(Math.min(width, height));
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    window.addEventListener('orientationchange', updateSize);
    window.visualViewport?.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', updateSize);
      window.visualViewport?.removeEventListener('resize', updateSize);
    };
  }, []);

  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  /*
   * Keep the number radius proportional to the actual clock diameter.
   * The original implementation used 36%, which is retained here.
   */
  const numberRadius = clockSize * 0.36;

  return (
    <main ref={containerRef} className={styles.container}>
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

      {/* Background video */}
      <video
        src={limeVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      {/* Clock */}
      <div
        className={styles.clockFace}
        style={{
          width: clockSize || undefined,
          height: clockSize || undefined,
        }}
      >
        {/* Clock numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const number = i + 1;

          /*
           * 12 is at the top, then numbers proceed clockwise.
           */
          const theta = ((number - 12) * 30 * Math.PI) / 180;

          const x = 50 + (numberRadius / (clockSize || 1)) * 100 * Math.sin(theta);
          const y = 50 - (numberRadius / (clockSize || 1)) * 100 * Math.cos(theta);

          return (
            <span
              key={number}
              className={styles.clockNumber}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              {number}
            </span>
          );
        })}

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

        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_12.displayName = 'Clock_26_09_12';

export default Clock_26_09_12;
```
