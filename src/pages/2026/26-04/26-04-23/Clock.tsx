import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-23/sunflower.mp4';
import fontUrl from '@/assets/fonts/26-04-23.otf';
import { useSuspenseFontLoader, ClockLoadingFallback } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');


const ClockInner: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Clock26-04-23', fontUrl: fontUrl }
  ], []);
  useSuspenseFontLoader(fontConfigs);
  const [time, setTime] = useState<Date>(new Date());
  const requestRef = useRef<number>();

  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const h = formatTime(time.getHours());
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());
  const ms = formatMs(time.getMilliseconds());

  // Join them to treat the milliseconds as part of the sequence
  const allDigits = (h + m + s + ms).split('');

  return (
    <div className={styles.container}>
      <video 
        className={styles.video}
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      <main className={styles.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} className={styles.digitBox}>
            {digit}
          </span>
        ))}
      </main>
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;