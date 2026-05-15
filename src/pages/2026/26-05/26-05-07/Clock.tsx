import React, { useMemo, useEffect, useState } from 'react';

import { useClockTime } from '@/utils/clockUtils';
import backgroundImage from '@/assets/images/2026/26-05/26-05-07/1gallop.webp';

import styles from './Clock.module.css';

interface HandProps {
  angle: number;
  length: string;
  width: string; // e.g., "12px", "8px", "4px"
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const ClockHand: React.FC<HandProps> = ({ angle, length, width, color, type }) => {
  const zIndex = type === 'second' ? 30 : type === 'minute' ? 20 : 10;
  
  const scaledWidth = `calc(${width} * (var(--clock-radius) / 200))`;

  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: scaledWidth,

    height: length,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: type === 'second' ? '50% 50% 0 0' : '2px 2px 0 0',
    zIndex: zIndex,
    transition: 'none',
    boxShadow: `
      0 0 8px rgba(0, 0, 0, 0.4),
      inset 0 0 6px rgba(255, 255, 255, 0.3),
      0 3px 6px rgba(0, 0, 0, 0.49)
    `,
  };


  return (
    <div 
      style={handStyle} 
      data-hand-type={type}
    />
  );
};

const AnalogClock: React.FC = () => {
  const time = useClockTime();
  
  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const updateDims = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    updateDims();
    
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Force visibility override for font loading issue
  useEffect(() => {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    document.documentElement.classList.remove('fonts-loading');
  }, []);


  const radius = Math.min(dims.w, dims.h) * 0.95 / 2;

  const { hours, minutes, seconds, ms, isoTime } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const msVal = time.getMilliseconds();
    return {
      hours: h,
      minutes: m,
      seconds: s,
      ms: msVal,
      isoTime: time.toISOString(),
    };
  }, [time]);

  const secondAngle = (seconds + ms / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60 + ms / 60000) * 6;
  const hourAngle = ((hours % 12) + (minutes + seconds / 60) / 60) * 30;


  const tickMarks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      id: i,
      angle,
      isHour: i % 5 === 0,
      x: 50 + 48 * Math.cos(rad),
      y: 50 + 48 * Math.sin(rad),
    };
  }), []);
  const clockNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90;
      const rad = angle * (Math.PI / 180);
      const distance = 0.85;
      numbers.push({
        number: i,
        x: 50 + distance * 42 * Math.cos(rad),
        y: 50 + distance * 42 * Math.sin(rad),
      });
    }
    return numbers;
  }, []);

  return (
    <div 
      className={styles.container} 
      style={{ 
        '--bg-image': `url(${backgroundImage})`,
        '--clock-radius': `${radius}px`,
      } as React.CSSProperties}
    >
      <time dateTime={isoTime} aria-label={`Current time: ${hours}:${minutes}`} className={styles.timeWrapper}>
        <div className={styles.clockFace}>
          <div className={styles.outerRing} />

          <div className={styles.innerRing} />          {tickMarks.map((tick) => (
            <div
              key={tick.id}
              className={tick.isHour ? styles.hourTick : styles.minuteTick}
              style={{
                left: `${tick.x}%`,
                top: `${tick.y}%`,
                transform: `translate(-50%, -50%) rotate(${tick.angle}deg)`,
              }}
            />
          ))}

          {clockNumbers.map((num) => (
            <div
              key={num.number}
              className={styles.clockNumber}
              style={{
                left: `${num.x}%`,
                top: `${num.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num.number}
            </div>
          ))}

          <ClockHand
            type="hour"
            angle={hourAngle}
            length={`${radius * 0.5}px`}
            width="12px"
            color="#4A2C17"
          />
          <ClockHand
            type="minute"
            angle={minuteAngle}
            length={`${radius * 0.7}px`}
            width="8px"
            color="#6B4423"
          />
          <ClockHand
            type="second"
            angle={secondAngle}
            length={`${radius * 0.85}px`}
            width="4px"
            color="#8B4513"
          />

         </div>
      </time>
    </div>
  );
};

export default AnalogClock;
