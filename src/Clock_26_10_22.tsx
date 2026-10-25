import React from 'react';
import styles from './Clock.module.css';

const SVG_CENTER = 500;
const SVG_VIEWBOX = '-250 -250 1500 1500';
const BINARY_RING_COUNT = 28;
const BINARY_RING_START_RADIUS = 16;
const BINARY_RING_SPACING = 28;
const BINARY_CHARACTER_SPACING = 14;

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

function BinaryBackground() {
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

      {[1, -1].map((direction) => (
        <g
          className={direction > 0 ? styles.clockwise : styles.counterclockwise}
          key={direction}
        >
          {binaryRings
            .filter((ring) => ring.direction === direction)
            .map((ring) => (
              <text className={styles.binaryRing} key={ring.id}>
                <textPath
                  href={`#${ring.id}`}
                  lengthAdjust="spacing"
                  textLength={ring.circumference}
                >
                  {ring.digits}
                </textPath>
              </text>
            ))}
        </g>
      ))}
    </svg>
  );
}

export default function Clock_26_10_22() {
  return (
    <main className={styles.container}>
      <BinaryBackground />
    </main>
  );
}

Clock_26_10_22.displayName = 'Clock_26_10_22';
