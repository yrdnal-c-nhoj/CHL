import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-16.otf?url';

export const assets = [fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_16',
    fontUrl,
  },
];

type SpinPhase = 0 | 1 | 2 | 3;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #655A19 0%, #4A2D02 50%, #141205 100%)',
    overflow: 'hidden',
  },
  clockWrapper: {
    width: '95vmin',
    height: '95vmin',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  },
  timeDisplay: {
    fontFamily: 'ClockFont_26_07_16, monospace',
    fontSize: '20vmin',
    color: '#B6F3C4',
    textShadow: '0 0 10px #547EC7, 0 0 20px #6354C7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }
};

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);
  const [phase, setPhase] = useState<SpinPhase>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const timeLabel = useMemo(() => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [time]);

  const getEasedProgress = (progress: number): number => {
    // Quintic smoothstep: zero velocity and acceleration at t=0 and t=1
    return progress ** 3 * (10 - 15 * progress + 6 * progress * progress);
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const container = containerRef.current;
      
      if (!container) return;

      if (elapsed < 250) {
        // Initial static frame
        container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        container.style.filter = 'drop-shadow(0 0 12px rgba(0,0,0,0.6))';
      } else if (elapsed < 6250) {
        const spinElapsed = elapsed - 250;
        const progress = Math.min(spinElapsed / 6000, 1);
        const eased = getEasedProgress(progress);
        const totalRotation = eased * 5400;

        // Apply phase-specific rotation direction
        container.style.transform =
          phase === 0 ? `perspective(1000px) rotateY(${totalRotation}deg)` :
          phase === 1 ? `perspective(1000px) rotateX(${totalRotation}deg)` :
          phase === 2 ? `perspective(1000px) rotateY(${-totalRotation}deg)` :
                        `perspective(1000px) rotateX(${-totalRotation}deg)`;

        container.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,0.5))';
      } else if (elapsed < 6500) {
        // Settlement frame
        container.style.filter = 'drop-shadow(0 0 12px rgba(0,0,0,0.6))';
      } else {
        // Cycle complete → trigger next phase
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
      style={styles.container}
      role="img"
      aria-label={`Digital clock showing ${timeLabel}`}
    >
      <div ref={containerRef} style={styles.clockWrapper}>
        <time dateTime={time.toISOString()} style={styles.timeDisplay}>
          {timeLabel}
        </time>
      </div>
    </div>
  );
};

export default Clock;