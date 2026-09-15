import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';

import styles from './Clock.module.css';

interface AnalogClockProps {
  size?: number;
  showSeconds?: boolean;
  className?: string;
}

const NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

const AnalogClock = ({
  size = 280,
  showSeconds = true,
  className = '',
}: AnalogClockProps) => {
  const time = useClock();
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<'waiting' | 'spinning' | 'holding'>('waiting');
  const directionRef = useRef<-1 | 1>(-1);
  const spinStartRef = useRef(0);
  const currentAngleRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const initialDelay = 1000;
    const spinDuration = 10000;
    const holdDuration = 1000;
    const totalDegrees = 2160;

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;

      if (phaseRef.current === 'waiting' && elapsed >= initialDelay) {
        phaseRef.current = 'spinning';
        spinStartRef.current = now;
      }

      if (phaseRef.current === 'spinning') {
        const progress = Math.min((now - spinStartRef.current) / spinDuration, 1);
        const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
        const newAngle =
          currentAngleRef.current + directionRef.current * totalDegrees * eased;

        setRotation(newAngle);

        if (progress >= 1) {
          currentAngleRef.current = newAngle;
          phaseRef.current = 'holding';
          spinStartRef.current = now;
        }
      }

      if (
        phaseRef.current === 'holding' &&
        now - spinStartRef.current >= holdDuration
      ) {
        directionRef.current = directionRef.current === 1 ? -1 : 1;
        phaseRef.current = 'spinning';
        spinStartRef.current = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const style = {
    '--clock-size': `${size}px`,
    '--clock-rotation': `${rotation}deg`,
    '--hour-angle': `${hours * 30 + minutes * 0.5}deg`,
    '--minute-angle': `${minutes * 6 + seconds * 0.1}deg`,
    '--second-angle': `${seconds * 6}deg`,
  } as CSSProperties;

  return (
    <main className={`${styles.container} ${className}`.trim()} style={style}>
      <div className={styles.clock} aria-label="Analog clock">
        <div className={styles.centerDot} aria-hidden="true" />

        <div className={styles.numbers} aria-hidden="true">
          {NUMBERS.map((number) => (
            <span key={number} className={styles.number}>
              {number}
            </span>
          ))}
        </div>

        <div className={`${styles.hand} ${styles.hourHand}`} aria-hidden="true" />
        <div className={`${styles.hand} ${styles.minuteHand}`} aria-hidden="true" />
        {showSeconds && (
          <div className={`${styles.hand} ${styles.secondHand}`} aria-hidden="true" />
        )}
      </div>

      <SRTime time={time} />
    </main>
  );
};

AnalogClock.displayName = 'AnalogClock_26_09_14';

export default AnalogClock;
