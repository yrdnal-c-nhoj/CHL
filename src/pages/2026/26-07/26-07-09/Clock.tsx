import fontUrl from '@/assets/fonts/26fonts/26-07-09.ttf?url';
import carVideo from '@/assets/images/26_images/26-07/26-07-09/city.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [carVideo, fontUrl];

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const AnalogClock =  () => {
  const time = useMillisecondClock();
  const isMobile = useIsMobile();

  useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const isoTime = useMemo(() => time.toISOString(), [time]);

  const digitGridStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gridTemplateRows: isMobile ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
    gap: '-0.5vh',
    padding: '0rem',
    borderRadius: '10px',
    opacity: 0.7,
  }), [isMobile]);

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <div className={styles.digitalTime}>
          <span className={styles.digitGrid} style={digitGridStyle}>
            <span className={styles.digitBox}>{String(hours).padStart(2, '0')[0]}</span>
            <span className={styles.digitBox}>{String(hours).padStart(2, '0')[1]}</span>
            <span className={styles.digitBox}>{String(minutes).padStart(2, '0')[0]}</span>
            <span className={styles.digitBox}>{String(minutes).padStart(2, '0')[1]}</span>
            <span className={styles.digitBox}>{String(seconds).padStart(2, '0')[0]}</span>
            <span className={styles.digitBox}>{String(seconds).padStart(2, '0')[1]}</span>
            <span className={styles.digitBox}>{String(Math.floor(ms / 10)).padStart(2, '0')[0]}</span>
            <span className={styles.digitBox}>{String(Math.floor(ms / 10)).padStart(2, '0')[1]}</span>
          </span>
        </div>
      </time>
    </main>
  );
};

const MemoizedAnalogClock = memo(AnalogClock);
MemoizedAnalogClock.displayName = 'Clock_26_07_09';
export default MemoizedAnalogClock;
