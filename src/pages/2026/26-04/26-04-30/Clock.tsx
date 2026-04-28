import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useClockTime, formatTime as utilFormatTime } from '@/utils/clockUtils';

const GRAVITY = 0.6;
const BOUNCE = -0.85;

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => utilFormatTime(time, '24h'), [time]);

  // Motion state
  const [y, setY] = useState(0);
  const yRef = useRef(0);
  const velocityRef = useRef(0);
  const clockRef = useRef<HTMLDivElement | null>(null);
  const viewportHeightRef = useRef(window.innerHeight);

  // Standardized Resize Handling
  useEffect(() => {
    const handleResize = () => {
      viewportHeightRef.current = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      const clockEl = clockRef.current;
      if (!clockEl) return;

      const clockHeight = clockEl.offsetHeight;
      const viewportHeight = viewportHeightRef.current;

      velocityRef.current += GRAVITY;
      let newY = yRef.current + velocityRef.current;

      // Collision with bottom
      if (newY + clockHeight >= viewportHeight) {
        newY = viewportHeight - clockHeight;
        velocityRef.current *= BOUNCE;

        // Stability threshold to stop jittering when resting
        if (Math.abs(velocityRef.current) < 0.2) {
          velocityRef.current = 0;
        }
      }

      yRef.current = newY;
      setY(newY);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#111',
    position: 'relative',
    overflow: 'hidden',
  };

  const clockStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: `${y}px`,
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'monospace',
    fontWeight: 300,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const separatorStyle: React.CSSProperties = {
    ...digitStyle,
    opacity: 0.6,
    animation: 'blink 1s infinite',
  };

  return (
    <main style={containerStyle}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>

      <time 
        ref={clockRef} 
        style={clockStyle}
        dateTime={`${hours}:${minutes}:${seconds}`}
      >
        <span style={digitStyle}>{hours[0]}</span>
        <span style={digitStyle}>{hours[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{seconds[0]}</span>
        <span style={digitStyle}>{seconds[1]}</span>
      </time>
    </main>
  );
};

export default Clock;