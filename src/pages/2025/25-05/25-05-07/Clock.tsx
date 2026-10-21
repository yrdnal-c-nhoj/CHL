import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import SRTime from '@/components/SRTime';
import bgImage from '@/assets/images/25_images/25-05/25-05-07/water.webp';
import styles from './Clock.module.css';
export const assets = [bgImage];

// Component Props interface
interface ClockProps {
  // No props required for this component
}

const Clock: React.FC<ClockProps> = () => {
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useSmoothClock();
  const requestRef = useRef<number | null>(null);
  const sHandRef = useRef<HTMLDivElement>(null);
  const mHandRef = useRef<HTMLDivElement>(null);
  const hHandRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondsDeg = ((seconds + ms / 1000) / 60) * 360;
    const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
    const hoursDeg = (((hours % 12) + minutes / 60) / 12) * 360;

    if (sHandRef.current)
      sHandRef.current.style.transform = `translateX(-50%) rotate(${secondsDeg}deg)`;
    if (sweepRef.current)
      sweepRef.current.style.transform = `translate(-50%, -50%) rotate(${secondsDeg}deg)`;
    if (mHandRef.current)
      mHandRef.current.style.transform = `translateX(-50%) rotate(${minutesDeg}deg)`;
    if (hHandRef.current)
      hHandRef.current.style.transform = `translateX(-50%) rotate(${hoursDeg}deg)`;

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return (
    <div className={styles.container}>
      <SRTime time={currentTime} />
      <img src={bgImage} alt="" className={styles.fullPageImage} />

      <div className={styles.clock}>
        <div id="radar" className={styles.radar}>
          {/* The trailing glow effect */}
          <div ref={sweepRef} className={styles.radarSweep} />

          <div className={styles.clockFace}>
            <div
              ref={hHandRef}
              className={`${styles.hand} ${styles.hourHand}`}
            />
            <div
              ref={mHandRef}
              className={`${styles.hand} ${styles.minuteHand}`}
            />
            {/* <div ref={sHandRef} className={`${styles.hand} ${styles.secondHand`}"></div> */}
            {/* <div className="center"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

Clock.displayName = 'Clock_25_05_07';

export default Clock;
