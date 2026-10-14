import { useEffect, useId, useState, type SVGProps } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const CENTER = 100;
const RADIUS = 96;
const OUTSIDE_EXTENT = 150;

const HOUR_HAND = { outer: 89, inner: 35, width: 14 };
const MINUTE_HAND = { outer: 91, inner: 10, width: 10 };
const SECOND_HAND_WIDTH = 1.2;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  return reduced;
}

type HandProps = {
  angle: number;
  outer: number;
  inner: number;
  width: number;
} & Omit<SVGProps<SVGLineElement>, 'width'>;

function Hand({ angle, outer, inner, width, ...rest }: HandProps) {
  const start = polar(angle, outer);
  const end = polar(angle, inner);

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      strokeWidth={width}
      strokeLinecap="butt"
      {...rest}
    />
  );
}

const Clock_26_10_10 = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const now = useSmoothClock(prefersReducedMotion ? 1000 : 16);

  const uid = useId().replace(/:/g, '');

  const ids = {
    hour: `${uid}-hour`,
    minute: `${uid}-minute`,
    second: `${uid}-second`,
    hourMask: `${uid}-hour-mask`,
    secondMask: `${uid}-second-mask`,
  };

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = Math.floor(seconds) * 6;

  const travel = Math.sin((now.getMilliseconds() / 1000) * Math.PI);

  const edgeStart = polar(secondAngle + 180, RADIUS);
  const edgeEnd = polar(secondAngle, RADIUS);
  const outsideEnd = polar(secondAngle + 180, RADIUS + OUTSIDE_EXTENT);

  const hourShadowStart = polar(hourAngle, RADIUS);
  const hourShadowEnd = polar(hourAngle, RADIUS + OUTSIDE_EXTENT);

  const minuteShadowStart = polar(minuteAngle, RADIUS);
  const minuteShadowEnd = polar(minuteAngle, RADIUS + OUTSIDE_EXTENT);

  const showSecondHand = !prefersReducedMotion;

  return (
    <main className={styles.container}>
      <svg viewBox="0 0 200 200" aria-hidden="true" className={styles.clockSvg}>
        <defs>
          <Hand id={ids.hour} angle={hourAngle} {...HOUR_HAND} />
          <Hand id={ids.minute} angle={minuteAngle} {...MINUTE_HAND} />

          {showSecondHand && (
            <Hand
              id={ids.second}
              angle={secondAngle}
              outer={0}
              inner={0}
              width={SECOND_HAND_WIDTH}
              x1={edgeStart.x}
              y1={edgeStart.y}
              x2={lerp(edgeStart.x, edgeEnd.x, travel)}
              y2={lerp(edgeStart.y, edgeEnd.y, travel)}
            />
          )}

          <mask
            id={ids.hourMask}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={200}
            height={200}
          >
            <use href={`#${ids.hour}`} stroke="#fff" />
          </mask>

          {showSecondHand && (
            <mask
              id={ids.secondMask}
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={200}
              height={200}
            >
              <use href={`#${ids.second}`} stroke="#fff" />
            </mask>
          )}
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.face} />

        {/* Second-hand sweep inside the clock. */}
        {showSecondHand && (
          <>
            <use href={`#${ids.second}`} className={styles.innerSweep} />

            {/* Second-hand sweep outside the clock. */}
            <line
              x1={edgeStart.x}
              y1={edgeStart.y}
              x2={lerp(edgeStart.x, outsideEnd.x, travel)}
              y2={lerp(edgeStart.y, outsideEnd.y, travel)}
              className={styles.outerSweep}
              strokeWidth={SECOND_HAND_WIDTH}
              strokeLinecap="butt"
            />
          </>
        )}

        {/* Hour shadow: exactly the same stroke width as the hour hand. */}
        <line
          x1={hourShadowStart.x}
          y1={hourShadowStart.y}
          x2={hourShadowEnd.x}
          y2={hourShadowEnd.y}
          className={styles.outerSweep}
          strokeWidth={HOUR_HAND.width}
          strokeLinecap="butt"
        />

        {/* Minute shadow: exactly the same stroke width as the minute hand. */}
        <line
          x1={minuteShadowStart.x}
          y1={minuteShadowStart.y}
          x2={minuteShadowEnd.x}
          y2={minuteShadowEnd.y}
          className={styles.outerSweep}
          strokeWidth={MINUTE_HAND.width}
          strokeLinecap="butt"
        />

        {/* Hour and minute hands inside the clock. */}
        <use href={`#${ids.hour}`} stroke="currentColor" />
        <use href={`#${ids.minute}`} stroke="currentColor" />

        {/* Preserve the original hand-overlap treatment. */}
        <g mask={`url(#${ids.hourMask})`}>
          <use href={`#${ids.minute}`} className={styles.overlap} />

          {showSecondHand && (
            <use href={`#${ids.second}`} className={styles.overlap} />
          )}
        </g>

        {showSecondHand && (
          <g mask={`url(#${ids.secondMask})`}>
            <use href={`#${ids.minute}`} className={styles.overlap} />
          </g>
        )}
      </svg>

      <SRTime time={now} />
    </main>
  );
};

Clock_26_10_10.displayName = 'Clock_26_10_10';

export default Clock_26_10_10;
