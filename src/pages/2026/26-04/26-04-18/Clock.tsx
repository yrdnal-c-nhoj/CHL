import React, { useMemo } from 'react';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const angles = calculateAngles(time);
    return {
      hourAngle: angles.hour,
      minuteAngle: angles.minute,
      secondAngle: angles.second,
    };
  }, [time]);

  const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  const radius = size / 2;
  const center = radius;

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    margin: 0,
    padding: 0,
  };

  const clockFaceStyle: React.CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    borderRadius: '50%',
    border: '4px solid #fff',
    backgroundColor: '#1a1a1a',
  };

  const svgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: size,
    height: size,
    pointerEvents: 'none',
  };

  const centerDotStyle: React.CSSProperties = {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#fff',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  };

  const getHandStyle = (length: number, width: number, angle: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    width,
    height: length,
    backgroundColor: color,
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: width / 2,
  });

  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
        <svg style={svgStyle}>
          {/* Hour tick marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = center + Math.cos(angle) * (radius - 15);
            const y1 = center + Math.sin(angle) * (radius - 15);
            const x2 = center + Math.cos(angle) * radius;
            const y2 = center + Math.sin(angle) * radius;
            return (
              <line
                key={`hour-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#fff"
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
          {/* Minute tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const x1 = center + Math.cos(angle) * (radius - 8);
            const y1 = center + Math.sin(angle) * (radius - 8);
            const x2 = center + Math.cos(angle) * radius;
            const y2 = center + Math.sin(angle) * radius;
            return (
              <line
                key={`minute-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#888"
                strokeWidth={1}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* Hour hand */}
        <div style={getHandStyle(radius * 0.5, 8, hourAngle, '#fff')} />
        {/* Minute hand */}
        <div style={getHandStyle(radius * 0.7, 6, minuteAngle, '#ccc')} />
        {/* Second hand */}
        <div style={getHandStyle(radius * 0.8, 2, secondAngle, '#f00')} />
        {/* Center dot */}
        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

export default Clock;
