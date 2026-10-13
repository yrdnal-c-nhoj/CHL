import { useEffect, useState } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const CENTER = 100;
const RADIUS = 96;

// Hand that starts near the outer edge and points inward toward the center
function outerHand(
  angle: number,
  outerLength: number, // distance from center to the outer end of the hand
  innerLength: number, // distance from center to the inner end of the hand
  width: number,
  color: string,
) {
  const radians = ((angle - 90) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return (
    <line
      x1={CENTER + cos * outerLength}
      y1={CENTER + sin * outerLength}
      x2={CENTER + cos * innerLength}
      y2={CENTER + sin * innerLength}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

const Clock_26_10_10 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const now = useSmoothClock(prefersReducedMotion ? 1000 : 16);
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondProgress = now.getMilliseconds() / 1000;
  const currentSecondAngle = Math.floor(seconds) * 6;
  const radians = ((currentSecondAngle - 90) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const edge1X = CENTER - cos * RADIUS;
  const edge1Y = CENTER - sin * RADIUS;
  const edge2X = CENTER + cos * RADIUS;
  const edge2Y = CENTER + sin * RADIUS;

  const travelProgress = Math.sin(secondProgress * Math.PI);
  const currentX2 = edge1X + (edge2X - edge1X) * travelProgress;
  const currentY2 = edge1Y + (edge2Y - edge1Y) * travelProgress;

  const OUTSIDE_EXTENT = 150;
  const outsideX = edge1X - cos * OUTSIDE_EXTENT;
  const outsideY = edge1Y - sin * OUTSIDE_EXTENT;
  const currentOutsideX = edge1X + (outsideX - edge1X) * travelProgress;
  const currentOutsideY = edge1Y + (outsideY - edge1Y) * travelProgress;

  return (
    <main className={styles.container}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Analog clock showing ${now.toLocaleTimeString()}`}
        className={styles.clockSvg}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.face} />

        {/* Second sweep lines (unchanged) */}
        <line
          x1={edge1X}
          y1={edge1Y}
          x2={currentX2}
          y2={currentY2}
          className={styles.innerSweep}
        />
        <line
          x1={edge1X}
          y1={edge1Y}
          x2={currentOutsideX}
          y2={currentOutsideY}
          className={styles.outerSweep}
        />

        {/* Hour hand – sits on the outer edge, points inward */}
        {outerHand(hours * 30, 89, 35, 14, 'currentColor')}

        {/* Minute hand – sits on the outer edge, points inward */}
        {outerHand(minutes * 6, 91, 10, 10, 'currentColor')}
      </svg>
      <SRTime time={now} />
    </main>
  );
};

Clock_26_10_10.displayName = 'Clock_26_10_10';
export default Clock_26_10_10;
