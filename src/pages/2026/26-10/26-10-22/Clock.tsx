import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const hourMarkers = Array.from({ length: 12 }, (_, index) => index + 1);

function CircleHand({
  count,
  angle,
  className,
}: {
  count: number;
  angle: number;
  className: string | undefined;
}) {
  return (
    <div
      className={`${styles.hand} ${className}`}
      style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          className={styles.handCircle}
          key={index}
          style={{ top: `${100 - (index / (count - 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}

function Clock_26_10_22() {
  const time = useClock();
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        {hourMarkers.map((marker) => {
          const angle = (marker * Math.PI) / 6 - Math.PI / 2;

          return (
            <span
              className={styles.hourMarker}
              key={marker}
              style={{
                left: `${50 + 38 * Math.cos(angle)}%`,
                top: `${50 + 38 * Math.sin(angle)}%`,
              }}
            />
          );
        })}

        <CircleHand count={8} angle={hourAngle} className={styles.hourHand} />
        <CircleHand
          count={12}
          angle={minuteAngle}
          className={styles.minuteHand}
        />
        <CircleHand
          count={15}
          angle={secondAngle}
          className={styles.secondHand}
        />
        <div className={styles.pin} />
      </div>
    </main>
  );
}

Clock_26_10_22.displayName = 'Clock_26_10_22';

export default Clock_26_10_22;
