import { useEffect, useState } from 'react';

import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';

import styles from './Clock.module.css';

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

/**
 * Rotates the decorative binary rings independently from the accessible clock time.
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

function Clock_26_10_22() {
  const time = useClock();

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <BinaryBackground />
    </main>
  );
}

Clock_26_10_22.displayName = 'Clock_26_10_22';

export default Clock_26_10_22;
