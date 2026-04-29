import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const POSITIONS = [
  { top: '25%', left: '50%' }, // Hour tens
  { top: '42%', left: '35%' }, // Hour ones
  { top: '45%', left: '50%' }, // Minute ones (Visual center)
  { top: '40%', left: '65%' }, // Minute tens (Visual right)
  { top: '65%', left: '42%' }, // Second tens
  { top: '65%', left: '58%' }, // Second ones
] as const;

const Clock: React.FC = () => {
  const time = useClockTime();

  const digits = useMemo(() => {
    const h = formatTime(time.getHours() % 12 || 12);
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    // Map digits to match the star indices used in the Pleiades standard
    return [h[0], h[1], m[1], m[0], s[0], s[1]];
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className={styles.video}
      />
      <time className={styles.clockWrapper} dateTime={time.toISOString()}>
        {digits.map((digit, i) => (
          <div
            key={i}
            className={styles.digitBox}
            style={{
              position: 'absolute',
              top: POSITIONS[i].top,
              left: POSITIONS[i].left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className={styles.digit}>{digit}</span>
          </div>
        ))}
      </time>
    </main>
  );
};

export default Clock;
