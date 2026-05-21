import React, { useMemo, useEffect, useState, memo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundImage from '@/assets/images/26_images/26-05/26-05-07/1gallop.webp';
import gallopFont from '@/assets/fonts/26fonts/26-05-07-gallop.ttf?url';
import styles from './Clock.module.css';

export const assets = [backgroundImage, gallopFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Gallop',
    fontUrl: gallopFont,
  },
];

interface HandProps {
  angle: number;
  length: string;
  width: string;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const ClockHand: React.FC<HandProps> = ({
  angle,
  length,
  width,
  color,
  type,
}) => {
  const zIndex = type === 'second' ? 30 : type === 'minute' ? 20 : 10;

  const widthValue = parseFloat(width);
  const scaledWidth = `calc(${widthValue} * var(--clock-radius) / 200)`;

  return (
    <div
      className={styles.hand}
      style={{
        left: `calc(50% - (${scaledWidth} / 2))`,
        width: scaledWidth,
        height: length,
        backgroundColor: color,
        transform: `rotate(${angle}deg)`,
        borderRadius: type === 'second' ? '50% 50% 0 0' : '2px 2px 0 0',
        zIndex: zIndex,
      }}
      data-hand-type={type}
    />
  );
};

const AnalogClock: React.FC = () => {
  const time = useClockTime();

  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const updateDims = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    updateDims();

    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useSuspenseFontLoader(fontConfigs);

  const radius = (Math.min(dims.w, dims.h) * 0.95) / 2;

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

  // Clean, continuous rotational angles
  const secondAngle = (seconds + ms / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60 + ms / 60000) * 6;
  const hourAngle = ((hours % 12) + (minutes + seconds / 60) / 60) * 30;

  const tickMarks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const angle = i * 6;
        const rad = (angle - 90) * (Math.PI / 180);
        return {
          id: i,
          angle,
          isHour: i % 5 === 0,
          x: 50 + 46 * Math.cos(rad), // Slightly tucked in from 48 to avoid edges
          y: 50 + 46 * Math.sin(rad),
        };
      }),
    [],
  );

  const clockNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = i * 30 - 90;
      const rad = angle * (Math.PI / 180);
      const distance = 0.76; // Adjusted for a balanced layout within the frame
      numbers.push({
        number: i,
        x: 50 + distance * 42 * Math.cos(rad),
        y: 50 + distance * 42 * Math.sin(rad),
      });
    }
    return numbers;
  }, []);

  return (
    <main
      className={styles.container}
      style={
        {
          '--clock-radius': `${radius}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.bgImage}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <time
        dateTime={isoTime}
        aria-label={`Current time: ${hours}:${minutes}`}
        className={styles.timeWrapper}
      >
        <div className={styles.clockFace}>
          {tickMarks.map((tick) => (
            <div
              key={tick.id}
              className={`${styles.tick} ${tick.isHour ? styles.hourTick : styles.minuteTick}`}
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
              className={styles.number}
              style={{
                left: `${num.x}%`,
                top: `${num.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num.number}
            </div>
          ))}

          {/* Hands */}
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

          {/* FIX: Center Cap / Pin to neatly cover the overlapping hand bases */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 'calc(var(--clock-radius) * 0.06)',
              height: 'calc(var(--clock-radius) * 0.06)',
              backgroundColor: '#4A2C17',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 40,
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </time>
    </main>
  );
};

export default memo(AnalogClock);
