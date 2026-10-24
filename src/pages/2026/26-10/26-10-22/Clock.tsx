import { memo, useEffect, useState } from 'react';

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

const SVG_CENTER = 500;
const SVG_VIEWBOX = '-250 -250 1500 1500';
const BINARY_RING_COUNT = 28;
const BINARY_RING_START_RADIUS = 16;
const BINARY_RING_SPACING = 28;
const BINARY_CHARACTER_SPACING = 14;

// Each ring completes one revolution every two minutes.
const BINARY_RING_ROTATION_MS = 2 * 60 * 1000;

const binaryRings = Array.from(
  { length: BINARY_RING_COUNT },
  (_, ringIndex) => {
    const radius = BINARY_RING_START_RADIUS + ringIndex * BINARY_RING_SPACING;
    const circumference = 2 * Math.PI * radius;
    const digitCount = Math.floor(circumference / BINARY_CHARACTER_SPACING);

    const digits = Array.from({ length: digitCount }, (_, digitIndex) =>
      (digitIndex + ringIndex) % 2 === 0 ? '0' : '1',
    ).join('');

    return {
      id: `binary-ring-26-10-22-${radius}`,
      circumference,
      digits,
      path: `M ${SVG_CENTER} ${SVG_CENTER - radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`,
      direction: ringIndex % 2 === 0 ? 1 : -1,
    };
  },
);

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

/**
 * Independent background animation.
 *
 * requestAnimationFrame updates only this component, so the clock hands
 * are not driven by the background's 60-fps rendering loop.
 */
function BinaryBackground() {
  const [rotation, setRotation] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let frameId = 0;
    let animationStart: number | undefined;

    const animate = (timestamp: number) => {
      animationStart ??= timestamp;
      const elapsed = timestamp - animationStart;
      setRotation(((elapsed / BINARY_RING_ROTATION_MS) * 360) % 360);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion]);

  return (
    <svg
      className={styles.binaryBackground}
      viewBox={SVG_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {binaryRings.map((ring) => (
          <path d={ring.path} id={ring.id} key={ring.id} />
        ))}
      </defs>

      {binaryRings.map((ring) => (
        <text
          className={styles.binaryRing}
          key={ring.id}
          transform={`rotate(${rotation * ring.direction} ${SVG_CENTER} ${SVG_CENTER})`}
        >
          <textPath
            href={`#${ring.id}`}
            lengthAdjust="spacing"
            textLength={ring.circumference}
          >
            {ring.digits}
          </textPath>
        </text>
      ))}
    </svg>
  );
}

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

      <BinaryBackground />

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
