import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import backgroundImage1 from '@/assets/images/26_images/26-10/26-10-28/laser.webp';
import backgroundImage2 from '@/assets/images/26_images/26-10/26-10-28/laser1.gif';
import backgroundVideo from '@/assets/images/26_images/26-10/26-10-28/laser.webm';
import laserHand from '@/assets/images/26_images/26-10/26-10-28/laserhand.webp';

import styles from './Clock.module.css';

export const assets = [
  backgroundImage1,
  backgroundImage2,
  backgroundVideo,
  laserHand,
];

const HAND_ASPECT = 122 / 550;
const CLOCK_CENTER = 100;
const CLOCK_RADIUS = 90;
const DIGIT_SIZE = 120;

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
  const x = CLOCK_CENTER - width / 2;
  const y = CLOCK_CENTER - length;
  return (
    <image
      href={laserHand}
      x={x}
      y={y}
      width={width}
      height={length}
      className={className}
      transform={`rotate(${angle} ${CLOCK_CENTER} ${CLOCK_CENTER})`}
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
      {/* Bottom SVG: digits with vignette mask */}
      <svg
        viewBox="0 0 200 200"
        className={styles.digitsSvg}
        aria-hidden="true"
        focusable="false"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x = CLOCK_CENTER + Math.cos(rad) * CLOCK_RADIUS;
          const y = CLOCK_CENTER + Math.sin(rad) * CLOCK_RADIUS;
          const rotation = angle - 90 + 170; // 170° clockwise rotation
          return (
            <image
              key={i}
              href={backgroundImage1}
              x={x - DIGIT_SIZE / 2}
              y={y - DIGIT_SIZE / 2}
              width={DIGIT_SIZE}
              height={DIGIT_SIZE}
              className={styles.digitImage}
              transform={`rotate(${rotation} ${x} ${y})`}
              aria-hidden="true"
              focusable="false"
            />
          );
        })}
      </svg>

      {/* Top SVG: hands without mask */}
      <svg
        viewBox="0 0 200 200"
        className={styles.handsSvg}
        aria-hidden="true"
        focusable="false"
      >
        <Hand
          angle={hours * 30}
          length={38}
          className={`${styles.hourHand} ${styles.handBase}`}
        />
        <Hand
          angle={minutes * 6}
          length={64}
          className={`${styles.minuteHand} ${styles.handBase}`}
        />
        <Hand
          angle={seconds * 6}
          length={74}
          className={`${styles.secondHand} ${styles.handBase}`}
        />
      </svg>
    </div>
  );
};

const Clock_26_10_28 = () => {
  const time = useSmoothClock(50);

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
