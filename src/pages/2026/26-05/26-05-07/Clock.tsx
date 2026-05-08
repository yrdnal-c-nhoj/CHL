import React, { useMemo, useRef, useEffect } from 'react';

import { useClockTime } from '@/utils/clockUtils';
import backgroundImage from '@/assets/images/2026/26-05/26-05-07/1gallop.webp';

import styles from './Clock.module.css';

interface HandProps {
  angle: number;
  length: string;
  width: string;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const ClockHand: React.FC<HandProps> = ({ angle, length, width, color, type }) => {
  const zIndex = type === 'second' ? 30 : type === 'minute' ? 20 : 10;
  
  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
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
      0 3px 6px rgba(0, 0, 0, 0.5)
    `,
  };

  const handTypeClass = (() => {
    if (type === 'hour') return styles.westernHourHand;
    if (type === 'minute') return styles.westernMinuteHand;
    return styles.westernSecondHand;
  })();

  return (
    <div 
      style={handStyle} 
      className={`${styles.hand} ${handTypeClass}`} 
      data-hand-type={type}
    />
  );
};

const AnalogClock: React.FC = () => {
  const time = useClockTime('ms');
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  
  // Get current dimensions for circular calculations
  const [dims, setDims] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  const radius = Math.min(dims.w, dims.h) * 0.95 / 2;

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  // For a circle, the radius is constant regardless of angle
  const getCircleRadius = () => {
    return radius;
  };

  const secondAngle = seconds * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours % 12) + (minutes + seconds / 60) / 60) * 30;

  const tickMarks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6;
    const r = getCircleRadius();
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      id: i,
      angle,
      isHour: i % 5 === 0,
      x: 50 + 48 * Math.cos(rad),
      y: 50 + 48 * Math.sin(rad),
    };
  }), [radius]);

  const clockNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90; // 30 degrees per hour, starting from top
      const rad = angle * (Math.PI / 180);
      const distance = 0.85; // Position numbers at 85% of radius
      numbers.push({
        number: i,
        x: 50 + distance * 42 * Math.cos(rad),
        y: 50 + distance * 42 * Math.sin(rad),
      });
    }
    return numbers;
  }, [radius]);

  return (
    <div 
      className={styles.container} 
      style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties}
    >
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <div className={styles.clockFace}>
          {/* Outer ring */}
          <div className={styles.outerRing} />

          {/* Inner decorative ring */}
          <div className={styles.innerRing} />

          {/* Tick marks */}
          {tickMarks.map((tick) => (
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

          {/* Clock numbers */}
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

          {/* Clock hands */}
          <ClockHand
            type="hour"
            angle={hourAngle}
            length={`${getCircleRadius() * 0.5}px`}
            width="3vh"
            color="#4A2C17"
          />
          <ClockHand
            type="minute"
            angle={minuteAngle}
            length={`${getCircleRadius() * 0.7}px`}
            width="2vh"
            color="#6B4423"
          />
          <ClockHand
            type="second"
            angle={secondAngle}
            length={`${getCircleRadius() * 0.85}px`}
            width="1vh"
            color="#8B4513"
          />

         </div>
      </time>
    </div>
  );
};

export default AnalogClock;
