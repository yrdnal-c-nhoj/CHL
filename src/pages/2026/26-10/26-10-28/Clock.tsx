import { useState, useEffect } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundImage1 from '@/assets/images/26_images/26-10/26-10-28/laser.webp';
import backgroundImage2 from '@/assets/images/26_images/26-10/26-10-28/laser1.gif';
import backgroundVideo from '@/assets/images/26_images/26-10/26-10-28/laser.mp4';
import laserHand from '@/assets/images/26_images/26-10/26-10-28/laserhand.webp';
import styles from './Clock.module.css';

export const assets = [
  backgroundImage1,
  backgroundImage2,
  backgroundVideo,
  laserHand,
];

const HAND_ASPECT = 122 / 550;

const Hand = ({
  angle,
  length,
  className,
}: {
  angle: number;
  length: number;
  className: string | undefined;
}) => {
  const width = length * HAND_ASPECT;
  const x = 100 - width / 2;
  const y = 100 - length;
  return (
    <image
      href={laserHand}
      x={x}
      y={y}
      width={width}
      height={length}
      className={className}
      transform={`rotate(${angle} 100 100)`}
      aria-hidden="true"
      focusable="false"
    />
  );
};

const AnalogClock = ({ time }: { time: Date }) => {
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  return (
    <div className={styles.analogClock}>
      <svg
        viewBox="0 0 200 200"
        className={styles.svg}
        aria-hidden="true"
        focusable="false"
      >
        {/* laser.webp placed at each of the 12 clock positions */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rad = ((angle - 90) * Math.PI) / 180;
          const r = 70;
          const x = 100 + Math.cos(rad) * r;
          const y = 100 + Math.sin(rad) * r;
          const imgSize = 40;
          const rotation = i * 30 - 90;
          return (
            <image
              key={i}
              href={backgroundImage1}
              x={x - imgSize / 2}
              y={y - imgSize / 2}
              width={imgSize}
              height={imgSize}
              transform={`rotate(${rotation} ${x} ${y})`}
              className={styles.digitImage}
              aria-hidden="true"
              focusable="false"
            />
          );
        })}

        {/* Hands — laser hand image, anchored at the clock center (100,100) */}
        <Hand angle={hours * 30} length={38} className={styles.hourHand} />
        <Hand angle={minutes * 6} length={64} className={styles.minuteHand} />
        <Hand angle={seconds * 6} length={74} className={styles.secondHand} />
      </svg>
    </div>
  );
};

const Clock_26_10_28 = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 50);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div
        className={styles.backgroundLayer}
        style={
          { '--bg-image': `url(${backgroundImage2})` } as React.CSSProperties
        }
      />
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <AnalogClock time={time} />
    </main>
  );
};

Clock_26_10_28.displayName = 'Clock_26_10_28';
export default Clock_26_10_28;
