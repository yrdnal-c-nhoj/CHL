import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useClockTime } from '@/utils/clockUtils';

const colors = {
  background: {
    top: '#712A6A',
    middle: '#4A0216',
    bottom: '#140507',
  },
  clock: {
    accent: '#54C75EAC',
    accentStroke: '#fff',
    hourHand: '#F3E8B6',
    minuteHand: '#DBF7CB',
    secondHand: '#F50000',
  },
} as const;

type SpinPhase = 0 | 1 | 2 | 3;

const Clock: React.FC = () => {
  const time = useClockTime();
  
  const [phase, setPhase] = useState<SpinPhase>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);

  // Clock calculations
  const { secondDegrees, minuteDegrees, hourDegrees, timeLabel } = useMemo(() => {
    const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
    const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
    const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
    const timeLabel = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
    return { secondDegrees, minuteDegrees, hourDegrees, timeLabel };
  }, [time]);

  const getEasedProgress = (progress: number): number => {
    if (progress < 0.1) return (progress / 0.1) ** 2 * 0.02;           // Very slow start
    if (progress < 0.8) return 0.02 + ((progress - 0.1) / 0.7) * 0.96; // Fast middle
    const p = (progress - 0.8) / 0.2;
    return 0.98 + (1 - (1 - p) ** 3) * 0.02;                          // Very slow stop
  };

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;

    const elapsed = timestamp - startRef.current;
    const deltaT = timestamp - prevTimeRef.current || 16;
    prevTimeRef.current = timestamp;

    const container = containerRef.current;
    if (!container) return;

    if (elapsed < 250) {
      // Initial display - sharp
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      container.style.filter = 'drop-shadow(0 0 12px rgba(0,0,0,0.6))';
    } 
    else if (elapsed < 7250) {
      const spinElapsed = elapsed - 250;
      const progress = Math.min(spinElapsed / 7000, 1);
      const eased = getEasedProgress(progress);
      const totalRotation = eased * 5400;

      // Apply rotation
      const transform = 
        phase === 0 ? `perspective(1000px) rotateY(${totalRotation}deg)` :
        phase === 1 ? `perspective(1000px) rotateX(${totalRotation}deg)` :
        phase === 2 ? `perspective(1000px) rotateY(${-totalRotation}deg)` :
                      `perspective(1000px) rotateX(${-totalRotation}deg)`;

      container.style.transform = transform;

      // Subtle glow during spin
      container.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,0.5))';
    } 
    else if (elapsed < 7500) {
      // Final sharp display
      container.style.filter = 'drop-shadow(0 0 12px rgba(0,0,0,0.6))';
    } 
    else {
      // Cycle complete → next phase
      setPhase(prev => ((prev + 1) % 4) as SpinPhase);
      return;
    }

    animRef.current = requestAnimationFrame(animate);
  }, [phase]);

  // Start animation cycle
  useEffect(() => {
    const runCycle = () => {
      startRef.current = null;
      prevTimeRef.current = 0;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    runCycle();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, animate]);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(180deg, ${colors.background.top} 0%, ${colors.background.middle} 50%, ${colors.background.bottom} 100%)`,
    overflow: 'hidden',
  };

  const clockWrapperStyle: React.CSSProperties = {
    width: '95vmin',
    height: '95vmin',
    transformStyle: 'preserve-3d',
    willChange: 'transform, filter',
    transition: 'filter 0.08s ease-out', // helps flash feel snappier
  };

  return (
    <div style={containerStyle} role="img" aria-label={`Analog clock showing ${timeLabel}`}>
      <div ref={containerRef} style={clockWrapperStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g>
            {/* Clock face */}
            <circle cx="50" cy="50" r="48" fill="#BDF4B920" stroke="#B6EAEACB" strokeWidth="0.5" />

            {/* Hour markers */}
            {[1, 2, 4, 5, 7, 8, 10, 11].map((num) => (
              <line
                key={num}
                x1="50" y1="6" x2="50" y2="10"
                stroke="#E5E772"
                strokeWidth="1"
                transform={`rotate(${num * 30} 50 50)`}
              />
            ))}

            {/* Hands */}
            <line
              x1="50" y1="50" x2="50" y2="28"
              stroke={colors.clock.hourHand}
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourDegrees} 50 50)`}
            />
            <line
              x1="50" y1="50" x2="50" y2="18"
              stroke={colors.clock.minuteHand}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteDegrees} 50 50)`}
            />

            {/* Accents */}
            <circle cx="50" cy="10" r="5" fill={colors.clock.accent} stroke={colors.clock.accentStroke} strokeWidth="1" />
            <circle cx="90" cy="50" r="3" fill={colors.clock.accent} stroke={colors.clock.accentStroke} strokeWidth="1" />
            <circle cx="50" cy="90" r="3" fill={colors.clock.accent} stroke={colors.clock.accentStroke} strokeWidth="1" />
            <circle cx="10" cy="50" r="3" fill={colors.clock.accent} stroke={colors.clock.accentStroke} strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill={colors.clock.accent} />

            {/* Second hand */}
            <line
              x1="50" y1="55" x2="50" y2="3"
              stroke={colors.clock.secondHand}
              strokeWidth="1.3"
              strokeLinecap="round"
              transform={`rotate(${secondDegrees} 50 50)`}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Clock;