import { memo, useEffect, useRef, useState } from 'react';

import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-22/numcirc.webm';
import clockFont from '@/assets/fonts/26fonts/26-10-22.otf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_22',
  fontUrl: clockFont,
};

const hourPositions = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 1;
  const angle = (hour * Math.PI) / 6 - Math.PI / 2;

  return {
    hour,
    left: `${50 + 38 * Math.cos(angle)}%`,
    top: `${50 + 38 * Math.sin(angle)}%`,
    binary: hour.toString(2).padStart(4, '0'),
  };
});

function BinaryHourMarkerList() {
  return (
    <>
      {hourPositions.map(({ hour, left, top, binary }) => (
        <span className={styles.binaryNumber} key={hour} style={{ left, top }}>
          {binary}
        </span>
      ))}
    </>
  );
}

const BinaryHourMarkers = memo(BinaryHourMarkerList);

function LaserHand({
  angle,
  className,
}: {
  angle: number;
  className: string | undefined;
}) {
  return (
    <div
      className={`${styles.hand} ${className ?? ''}`}
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

/**
 * Hands use whole-second time values.
 * No animation-frame updates are used for the hands.
 */
function Clock_26_10_22() {
  useSuspenseFontLoader([fontConfig]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);

      const video = videoRef.current;
      if (!video) return;

      if (event.matches) {
        video.pause();
      } else {
        video.play().catch((error: unknown) => {
          console.warn(
            '[Clock_26_10_22] Background video playback failed:',
            error,
          );
        });
      }
    };

    mediaQuery.addEventListener('change', updateMotionPreference);
    return () =>
      mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  const time = useClock();

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours + minutes / 60) * 30;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <video
        ref={videoRef}
        src={backgroundVideo}
        autoPlay={!prefersReducedMotion}
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.dial} aria-hidden="true">
        <BinaryHourMarkers />

        <LaserHand angle={hourAngle} className={styles.hourHand} />
        <LaserHand angle={minuteAngle} className={styles.minuteHand} />
        <LaserHand angle={secondAngle} className={styles.secondHand} />
      </div>
    </main>
  );
}

Clock_26_10_22.displayName = 'Clock_26_10_22';

export default Clock_26_10_22;
