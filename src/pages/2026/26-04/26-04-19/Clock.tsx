import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import wobbleVideo from '@/assets/images/2026/26-04/26-04-19/wobble2.mp4';
import wobbleFont from '@/assets/fonts/26-04-19-wobble.ttf';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  useSuspenseFontLoader([{ fontFamily: 'Wobble', fontUrl: wobbleFont }]);
  const time = useClockTime();

  const { hours, minutes, ampm } = useMemo(() => {
    let h = time.getHours();
    const am = h < 12 ? 'AM' : 'PM';
    h = h % 12 || 12;
    const m = formatTime(time.getMinutes());
    return { hours: h.toString(), minutes: m, ampm: am };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        src={wobbleVideo}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.clock}>
        {hours.split('').map((digit, i) => (
          <span key={i} className={styles.digit}>{digit}</span>
        ))}
        <span className={styles.digit}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.ampm}>{ampm}</span>
      </div>
    </div>
  );
};

export default Clock;
