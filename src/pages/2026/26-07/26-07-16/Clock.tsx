import fontUrl from '@/assets/fonts/26fonts/26-07-16.otf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_16',
    fontUrl,
  },
];

type SpinPhase = 0 | 1 | 2 | 3;

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);
  const [phase, setPhase] = useState<SpinPhase>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const timeUnits = useMemo(() => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  }, [time]);

  const getEasedProgress = (progress: number): number => {
    return progress ** 3 * (10 - 15 * progress + 6 * progress * progress);
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const container = containerRef.current;
      
      if (!container) return;

      if (elapsed < 250) {
        container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        container.style.filter = 'drop-shadow(0 0 12px rgba(255,255,255,0.6))';
      } else if (elapsed < 10250) {
        const spinElapsed = elapsed - 250;
        const progress = Math.min(spinElapsed / 10000, 1);
        const eased = getEasedProgress(progress);
        const totalRotation = eased * 7200;

        container.style.transform =
          phase === 0 ? `perspective(1000px) rotateY(${totalRotation}deg)` :
          phase === 1 ? `perspective(1000px) rotateX(${totalRotation}deg)` :
          phase === 2 ? `perspective(1000px) rotateY(${-totalRotation}deg)` :
                        `perspective(1000px) rotateX(${-totalRotation}deg)`;

        container.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.5))';
      } else if (elapsed < 10500) {
        container.style.filter = 'drop-shadow(0 0 12px rgba(255,255,255,0.6))';
      } else {
        setPhase((prev) => ((prev + 1) % 4) as SpinPhase);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [phase],
  );

  useEffect(() => {
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, animate]);

  return (
    <div
      className={styles.container}
    >
      <div ref={containerRef} className={styles.clockWrapper}>
        <time dateTime={time.toISOString()} className={styles.timeDisplay} aria-label={time.toLocaleTimeString()}>
          <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
          {/* Visually rendered time */}
          <span>{timeUnits.hours}</span>
          <span className={styles.colon}>:</span>
          <span>{timeUnits.minutes}</span>
          <span className={styles.colon}>:</span>
          <span>{timeUnits.seconds}</span>
        </time>
      </div>
    </div>
  );
};

export default Clock;