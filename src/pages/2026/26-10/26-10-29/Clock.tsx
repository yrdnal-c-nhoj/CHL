import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-29/rave.mp4';

export const assets = [backgroundVideo];

// Curvy (carval / curvilinear) hands derived from Indian Asian ornamental
// motifs. Each path is drawn around the centre pivot (100,100) so it can be
// rotated there. The Bézier curves give the hands their flowing, psychedelic
// profile rather than a straight stroke. The viewBox is expanded to -30 -30
// 260 260 so the curvy control points aren't clipped by overflow: hidden on
// the container.
const HOUR_PATH =
  'M100,100 C108,92 118,70 112,40 C106,10 94,6 90,10 C86,14 88,40 95,48 C102,56 100,60 100,60';
const MINUTE_PATH =
  'M100,100 C105,95 120,60 112,24 C104,-12 88,-10 86,2 C84,14 88,22 94,30 C100,38 100,40 100,40';
const SECOND_PATH =
  'M100,100 C104,97 114,40 108,8 C102,-24 90,-30 88,-26 C86,-22 88,8 94,18 C100,28 100,32 100,32';

const Clock_26_10_29 = () => {
  const time = useSmoothClock(16);

  const hourAngle = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const minuteAngle = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const secondAngle = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <svg
        viewBox="-30 -30 260 260"
        className={styles.clockFace}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Neon glow filter shared by all hands — the psychedelic bloom that
              makes the curvy carval hands glow against the rave background. */}
          <filter id="handGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Psychedelic linear gradients for each hand — colors are driven by
              CSS variables so the palette stays editable per-clock. */}
          <linearGradient id="hourGrad" gradientTransform="rotate(90)">
            <stop stopColor="var(--hand-hour-start)" />
            <stop offset="1" stopColor="var(--hand-hour-end)" />
          </linearGradient>
          <linearGradient id="minuteGrad" gradientTransform="rotate(90)">
            <stop stopColor="var(--hand-minute-start)" />
            <stop offset="1" stopColor="var(--hand-minute-end)" />
          </linearGradient>
          <linearGradient id="secondGrad" gradientTransform="rotate(90)">
            <stop stopColor="var(--hand-second-start)" />
            <stop offset="1" stopColor="var(--hand-second-end)" />
          </linearGradient>
        </defs>

        {/* Hour hand — short, broad, tented carval curve */}
        <path
          d={HOUR_PATH}
          className={`${styles.hand} ${styles.hourHand}`}
          fill="url(#hourGrad)"
          filter="url(#handGlow)"
          transform={`rotate(${hourAngle} 100 100)`}
        />
        {/* Minute hand — medium, forward-swept with a rear counter-curve */}
        <path
          d={MINUTE_PATH}
          className={`${styles.hand} ${styles.minuteHand}`}
          fill="url(#minuteGrad)"
          filter="url(#handGlow)"
          transform={`rotate(${minuteAngle} 100 100)`}
        />
        {/* Second hand — longest, with an undulating spine */}
        <path
          d={SECOND_PATH}
          className={`${styles.hand} ${styles.secondHand}`}
          fill="url(#secondGrad)"
          filter="url(#handGlow)"
          transform={`rotate(${secondAngle} 100 100)`}
        />

        {/* Center cap — tents the carval hands' origin */}
        <circle cx="100" cy="100" r="6" className={styles.centerCap} />
        <circle cx="100" cy="100" r="2.5" className={styles.centerCapInner} />
      </svg>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_29.displayName = 'Clock_26_10_29';
export default Clock_26_10_29;
