import React, { useMemo, useRef, useEffect } from 'react';

import { useClockTime } from '@/utils/clockUtils';
import backgroundImage from '@/assets/images/26_images/26-05/26-05-01/sampson-radar-spinning-loop-1yfouy6i3iowbryl-ezgif.com-speed.webp';

import styles from './Clock.module.css';

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

  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: length,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: '50%',
    zIndex: zIndex,
    transition: 'none',
  };

  return (
    <div style={handStyle} className={styles.hand} data-hand-type={type} />
  );
};

const AnalogClock: React.FC = () => {
  const time = useClockTime('ms');
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Get current dimensions for oval calculations
  const [dims, setDims] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const rx = (dims.w * 0.95) / 2;
  const ry = (dims.h * 0.95) / 2;

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
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

  // Ellipse distance formula: r = (a*b) / sqrt((b*sinθ)² + (a*cosθ)²)
  // We use this to calculate how long a hand should be at a specific angle
  const getOvalRadius = (deg: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    const a = rx;
    const b = ry;
    const r =
      (a * b) /
      Math.sqrt(
        Math.pow(b * Math.cos(rad), 2) + Math.pow(a * Math.sin(rad), 2),
      );
    return r;
  };

  const totalSeconds = seconds + ms / 1000;
  const secondAngle = totalSeconds * 6;
  const minuteAngle = (minutes + totalSeconds / 60) * 6;
  const hourAngle = ((hours % 12) + (minutes + totalSeconds / 60) / 60) * 30;

  const tickMarks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const angle = i * 6;
        const r = getOvalRadius(angle);
        const rad = (angle - 90) * (Math.PI / 180);
        return {
          id: i,
          angle,
          isHour: i % 5 === 0,
          x: 50 + (r / rx) * 48 * Math.cos(rad),
          y: 50 + (r / ry) * 48 * Math.sin(rad),
        };
      }),
    [rx, ry],
  );

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

          {/* Clock hands */}
          <ClockHand
            type="hour"
            angle={hourAngle}
            length={`${getOvalRadius(hourAngle) * 0.6}px`}
            width="2vh"
            color="rgba(255, 255, 255, 0.42)"
          />
          <ClockHand
            type="minute"
            angle={minuteAngle}
            length={`${getOvalRadius(minuteAngle) * 0.85}px`}
            width="1vh"
            color="rgba(255, 255, 255, 0.28)"
          />
          <ClockHand
            type="second"
            angle={secondAngle}
            length={`${getOvalRadius(secondAngle) * 0.98}px`}
            width="0.5vh"
            color="#3A3A3C"
          />
        </div>
      </time>
    </div>
  );
};

export default AnalogClock;
