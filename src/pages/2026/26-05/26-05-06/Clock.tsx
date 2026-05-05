import React, { useMemo, useRef, useEffect } from 'react';

import { useClockTime } from '@/utils/clockUtils';

import styles from './Clock.module.css';
import jumpVideo from '@/assets/images/2026/26-05/26-05-06/jump.mp4';
import dolphinFont from '@/assets/fonts/2026/26-05-06-dolphin.ttf';

interface HandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const getHandZIndex = (type: 'hour' | 'minute' | 'second'): number => {
  if (type === 'second') return 30;
  if (type === 'minute') return 20;
  return 10;
};

const getHandBorderRadius = (type: 'hour' | 'minute' | 'second', width: number): string => {
  if (type === 'second') return '1px';
  return `${width / 2}px`;
};

const getHandTransition = (type: 'hour' | 'minute' | 'second'): string => {
  if (type === 'second') return 'none';
  return 'transform 0.1s ease-out';
};

const ClockHand: React.FC<HandProps> = ({ angle, length, width, color, type }) => {
  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: getHandBorderRadius(type, width),
    zIndex: getHandZIndex(type),
    transition: getHandTransition(type),
  };

  return <div style={handStyle} className={styles.hand} data-hand-type={type} />;
};

const AnalogClock: React.FC = () => {
  const time = useClockTime();
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
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

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  const tickMarks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      return {
        id: i,
        angle,
        isHour,
        length: isHour ? 16 : 8,
        width: isHour ? 4 : 2,
      };
    });
  }, []);

  const numbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i === 0 ? 12 : i;
      const angle = i * 30;
      const radian = (angle - 90) * (Math.PI / 180);
      const radius = 35;
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      return {
        num,
        x,
        y,
        rotation: angle, // Add rotation to align with clock face edge
      };
    });
  }, []);

  return (
    <div className={styles.container}>
      <video
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        src={jumpVideo}
      />
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <div className={styles.clockFace}>
        
          {/* Numbers */}
          {numbers.map((n) => (
            <span
              key={n.num}
              className={styles.number}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: `translate(-50%, -50%) rotate(${n.rotation}deg)`,
              }}
            >
              {n.num}
            </span>
          ))}

          {/* Clock hands */}
          <ClockHand
            type="hour"
            angle={hourAngle}
            length={60}
            width={6}
            color="var(--clock-accent-color)"
          />
          <ClockHand
            type="minute"
            angle={minuteAngle}
            length={85}
            width={4}
            color="var(--clock-accent-color)"
          />
        
        </div>

      
      </time>
    </div>
  );
};

export default AnalogClock;
