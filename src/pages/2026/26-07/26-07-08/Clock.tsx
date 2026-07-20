import num1 from '@/assets/images/26_images/26-07/26-07-08/1.webp';
import num10 from '@/assets/images/26_images/26-07/26-07-08/10.webp';
import num11 from '@/assets/images/26_images/26-07/26-07-08/11.webp';
import num12 from '@/assets/images/26_images/26-07/26-07-08/12.webp';
import num2 from '@/assets/images/26_images/26-07/26-07-08/2.webp';
import num3 from '@/assets/images/26_images/26-07/26-07-08/3.webp';
import num4 from '@/assets/images/26_images/26-07/26-07-08/4.webp';
import num5 from '@/assets/images/26_images/26-07/26-07-08/5.webp';
import num6 from '@/assets/images/26_images/26-07/26-07-08/6.webp';
import num7 from '@/assets/images/26_images/26-07/26-07-08/7.webp';
import num8 from '@/assets/images/26_images/26-07/26-07-08/8.webp';
import num9 from '@/assets/images/26_images/26-07/26-07-08/9.webp';
import peachImg from '@/assets/images/26_images/26-07/26-07-08/ocean.webp';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

// ─── Constants & Configuration ───────────────────────────────────────────────

const CLOCK_LABELS = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, num12];
export const assets = [...CLOCK_LABELS, peachImg];

// ─── Component: ClockFace ────────────────────────────────────────────────────

interface ClockFaceProps {
  clockSize: number;
  radius: number; 
}

const ClockFace: React.FC<ClockFaceProps> = React.memo(({ clockSize, radius }) => (
  <div className={styles.clockFace} style={{ width: clockSize, height: clockSize }}>
    {CLOCK_LABELS.map((label, i) => {
      const angle = (i + 1) * 30;
      const x = Math.sin((angle * Math.PI) / 180) * radius;
      const y = -Math.cos((angle * Math.PI) / 180) * radius;
      return (
        <img
          key={i}
          src={label}
          alt={`${i + 1}`}
          className={styles.numberLabel}
          style={{
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            width: clockSize * 0.2,
            height: clockSize * 0.22,
          }}
        />
      );
    })}
  </div>
));
ClockFace.displayName = 'ClockFace';

// ─── Component: AnimatedHands ────────────────────────────────────────────────

interface AnimatedHandsProps {
  clockSize: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

const AnimatedHands: React.FC<AnimatedHandsProps> = React.memo(({ clockSize, hourAngle, minuteAngle, secondAngle }) => {

  return (
    <>
      <div
        className={`${styles.hand} ${styles.hourHand}`}
        style={{
          width: clockSize * 0.04,
          height: clockSize * 0.25,
          transform: `rotate(${hourAngle}deg)`,
        }}
      />
      <div
        className={`${styles.hand} ${styles.minuteHand}`}
        style={{
          width: clockSize * 0.03,
          height: clockSize * 0.35,
          transform: `rotate(${minuteAngle}deg)`,
        }}
      />
      <div
        className={`${styles.hand} ${styles.secondHand}`}
        style={{
          width: clockSize * 0.015,
          height: clockSize * 0.4,
          transform: `rotate(${secondAngle}deg)`,
        }}
      />
      
      {/* 3D Polished Brass Pin Cap */}
      <div
        className={styles.centerPin}
        style={{
          width: clockSize * 0.045,
          height: clockSize * 0.045,
        }}
      />
    </>
  );
});
AnimatedHands.displayName = 'AnimatedHands';

// ─── Main Component ───────────────────────────────────────────────────────────

const TangerineClock: React.FC = () => {
  const time = useMillisecondClock();
  const [clockSize, setClockSize] = useState<number>(300);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setClockSize(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 600));
    };

    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = time.getMilliseconds();
    const seconds = time.getSeconds() + ms / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: (hours / 12) * 360,
      minuteAngle: (minutes / 60) * 360,
      secondAngle: (seconds / 60) * 360,
    };
  }, [time]);

  const radius = clockSize * 0.42;

  if (!isClient) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: '#FFDAB9' }} />;
  }

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(${peachImg})`,
        opacity: isClient ? 1 : 0,
      }}
      role="img"
      aria-label={`An analog clock showing the time is ${time.toLocaleTimeString()}`}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockContainer} style={{ width: clockSize, height: clockSize }}>
        <ClockFace clockSize={clockSize} radius={radius} />
        <AnimatedHands clockSize={clockSize} hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />
      </div>
    </main>
  );
};

export default TangerineClock;