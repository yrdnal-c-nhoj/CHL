import { useEffect, useState } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const CENTER = 100;
const RADIUS = 96;
const OUTSIDE_EXTENT = 150;

const HOUR_HAND = { outer: 89, inner: 35, width: 14 };
const MINUTE_HAND = { outer: 91, inner: 10, width: 10 };

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Point at `radius` from the center, angle in degrees clockwise from 12 o'clock. */
function polar(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(radians) * radius,
    y: CENTER + Math.sin(radians) * radius,
  };
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function usePrefersReducedMotion() {
  // Start false so server and client render the same markup on first paint.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

type HandProps = {
  angle: number;
  outer: number; // distance from center to the end on the rim
  inner: number; // distance from center to the end pointing inward
  width: number;
};

/** A hand that sits on the rim and points toward the center. */
function Hand({ angle, outer, inner, width }: HandProps) {
  const start = polar(angle, outer);
  const end = polar(angle, inner);

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

const Clock_26_10_10 = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const now = useSmoothClock(prefersReducedMotion ? 1000 : 16);

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  // The sweep line snaps to each second's angle, then travels across the face.
  const secondAngle = Math.floor(seconds) * 6;
  const travel = Math.sin((now.getMilliseconds() / 1000) * Math.PI);

  const edgeStart = polar(secondAngle + 180, RADIUS);
  const edgeEnd = polar(secondAngle, RADIUS);
  const outsideEnd = polar(secondAngle + 180, RADIUS + OUTSIDE_EXTENT);

  return (
    <main className={styles.container}>
      <svg viewBox="0 0 200 200" aria-hidden="true" className={styles.clockSvg}>
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.face} />

        {/* Hidden with reduced motion: the sweep is purely decorative movement. */}
        {!prefersReducedMotion && (
          <>
            <line
              x1={edgeStart.x}
              y1={edgeStart.y}
              x2={lerp(edgeStart.x, edgeEnd.x, travel)}
              y2={lerp(edgeStart.y, edgeEnd.y, travel)}
              className={styles.innerSweep}
            />
            <line
              x1={edgeStart.x}
              y1={edgeStart.y}
              x2={lerp(edgeStart.x, outsideEnd.x, travel)}
              y2={lerp(edgeStart.y, outsideEnd.y, travel)}
              className={styles.outerSweep}
            />
          </>
        )}

        <Hand angle={hours * 30} {...HOUR_HAND} />
        <Hand angle={minutes * 6} {...MINUTE_HAND} />
      </svg>
      <SRTime time={now} />
    </main>
  );
};

Clock_26_10_10.displayName = 'Clock_26_10_10';
export default Clock_26_10_10;
