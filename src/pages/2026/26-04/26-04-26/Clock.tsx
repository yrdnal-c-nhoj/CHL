import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds, ms, ampm } = useMemo(() => {
    const rawHours = time.getHours();
    const ampm = rawHours >= 12 ? 'PM' : 'AM';
    const displayHours = rawHours % 12 || 12;
    
    const h = formatTime(displayHours);
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const ms = formatMs(time.getMilliseconds());
    return { hours: h, minutes: m, seconds: s, ms, ampm };
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
        <div className={styles.clock}>
          <div className={styles.digitBox}><span className={styles.digit}>{hours[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{hours[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{minutes[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{minutes[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{seconds[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{seconds[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[2]}</span></div>
          <div className={styles.ampmBox}><span className={styles.ampm}>{ampm}</span></div>
        </div>
      </time>
    </main>
  );
};

export default Clock;
