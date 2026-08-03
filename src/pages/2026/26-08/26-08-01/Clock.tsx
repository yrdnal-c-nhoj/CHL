import React, { useMemo } from 'react';

import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
// import backgroundImage from '@/assets/images/your-image.webp';
// import fontUrl from '@/assets/fonts/your-font.otf?url';

export const assets: string[] = [
  // backgroundImage,
  // fontUrl
];

// 2. Cube Component
interface CubeProps {
  value: string;
  label: string;
}

const Cube: React.FC<CubeProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.cube}>
      <div className={`${styles.face} ${styles.front}`}>{value}</div>
      <div className={`${styles.face} ${styles.back}`}>{value}</div>
      <div className={`${styles.face} ${styles.left}`}>{value}</div>
      <div className={`${styles.face} ${styles.right}`}>{value}</div>
      <div className={`${styles.face} ${styles.top}`}>{value}</div>
      <div className={`${styles.face} ${styles.bottom}`}>{value}</div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

// 2b. Sphere Component
const Sphere: React.FC<CubeProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.sphere}>
      <div className={styles.sphereFace}>{value}</div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

// 2c. Pyramid Component
const Pyramid: React.FC<CubeProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.pyramid}>
      <div className={`${styles.pyramidFace} ${styles.pyramidFront}`}>
        {value}
      </div>
      <div className={`${styles.pyramidFace} ${styles.pyramidRight}`}>
        {value}
      </div>
      <div className={`${styles.pyramidFace} ${styles.pyramidBack}`}>{value}</div>
      <div className={`${styles.pyramidFace} ${styles.pyramidLeft}`}>
        {value}
      </div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Use the standardized time hook
  const time = useSecondClock();

  // Memoize expensive calculations
  const { hours, minutes, seconds } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {`${hours}:${minutes}:${seconds}`}
      </time>

      {/* Clock UI */}
      <div className={styles.cubesWrapper}>
        <Cube value={hours} label="Hours" />
        <Sphere value={minutes} label="Minutes" />
        <Pyramid value={seconds} label="Seconds" />
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_01';

export default MemoizedClock;