import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const GRAVITY = 0.6;
const BOUNCE = -0.85;

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    return {
      hours: formatTime(time.getHours()),
      minutes: formatTime(time.getMinutes()),
      seconds: formatTime(time.getSeconds()),
    };
  }, [time]);

  // Motion state
  const [y, setY] = useState(0);
  const velocityRef = useRef(0);
  const clockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      const clockEl = clockRef.current;
      if (!clockEl) return;

      const clockHeight = clockEl.offsetHeight;
      const viewportHeight = window.innerHeight;

      velocityRef.current += GRAVITY;
      let newY = y + velocityRef.current;

      // Collision with bottom
      if (newY + clockHeight >= viewportHeight) {
        newY = viewportHeight - clockHeight;
        velocityRef.current *= BOUNCE;
      }

      setY(newY);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [y]);

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
    <div style={containerStyle}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>

      <div ref={clockRef} style={clockStyle}>
        <span style={digitStyle}>{hours[0]}</span>
        <span style={digitStyle}>{hours[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{seconds[0]}</span>
        <span style={digitStyle}>{seconds[1]}</span>
      </div>
    </div>
  );
};

export default Clock;