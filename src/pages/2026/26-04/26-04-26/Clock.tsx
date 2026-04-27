import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds, ms, ampm } = useMemo(() => {
    let h = time.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const ms = formatMs(time.getMilliseconds());
    return { hours: h.toString(), minutes: m, seconds: s, ms, ampm };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        className={styles.video}
      />
      <div className={styles.clockWrapper}>
        <div className={styles.clock}>
          <div className={styles.digitBox}><span className={styles.digit}>{hours[0]}</span></div>
          {hours[1] && <div className={styles.digitBox}><span className={styles.digit}>{hours[1]}</span></div>}
          <div className={styles.digitBox}><span className={styles.digit}>{minutes[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{minutes[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{seconds[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{seconds[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[0]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[1]}</span></div>
          <div className={styles.digitBox}><span className={styles.digit}>{ms[2]}</span></div>
          <div className={styles.ampmBox}><span className={styles.ampm}>{ampm}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
