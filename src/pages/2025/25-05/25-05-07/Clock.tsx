import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/25_images/25-05/25-05-07/water.webp';
import styles from './Clock.module.css';

// Component Props interface
interface ClockProps {
  // No props required for this component
}

const Clock: React.FC<ClockProps> = () => {
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();
  const requestRef = useRef<number | null>(null);

  const updateClock =  () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondsDeg = ((seconds + ms / 1000) / 60) * 360;
    const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
    const hoursDeg = (((hours % 12) + minutes / 60) / 12) * 360;

    const sHand = document.querySelector('.second-hand');
    const mHand = document.querySelector('.minute-hand');
    const hHand = document.querySelector('.hour-hand');
    const sweep = document.querySelector('.radar-sweep');

    if (sHand)
      sHand.style.transform = `translateX(-50%) rotate(${secondsDeg}deg)`;
    if (sweep)
      sweep.style.transform = `translate(-50%, -50%) rotate(${secondsDeg}deg)`;
    if (mHand)
      mHand.style.transform = `translateX(-50%) rotate(${minutesDeg}deg)`;
    if (hHand)
      hHand.style.transform = `translateX(-50%) rotate(${hoursDeg}deg)`;

    requestRef.current = requestAnimationFrame(updateClock);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className={styles.container}>
      <img src={bgImage} alt="background" className={styles.fullPageImage} />

      <div className={styles.clock}>
        <div id="radar" className={styles.radar}>
          {/* The trailing glow effect */}
          <div className={styles.radarSweep} />

          <div className={styles.clockFace}>
            <div className={`${styles.hand} ${styles.hourHand}`} />
            <div className={`${styles.hand} ${styles.minuteHand}`} />
            {/* <div className="hand second-hand"></div> */}
            {/* <div className="center"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
