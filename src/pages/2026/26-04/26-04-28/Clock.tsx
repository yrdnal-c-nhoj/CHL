import { memo, useEffect, useRef } from 'react';
import backgroundImg from '@/assets/images/26_images/26-04/26-04-28/2021-07-06-0012.jpg';
import { calculateAngles, useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [backgroundImg];

const Clock =  () => {
  const time = useSmoothClock();

  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { hour, minute, second } = calculateAngles(time);

    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `translateX(-50%) rotate(${hour}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `translateX(-50%) rotate(${minute}deg)`;
    }
    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `translateX(-50%) rotate(${second}deg)`;
    }
  }, [time]);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <main style={containerStyle} className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.analogClockContainer}>
        <div ref={hourHandRef} className={`${styles.hand} ${styles.hourHand}`} />
        <div ref={minuteHandRef} className={`${styles.hand} ${styles.minuteHand}`} />
        <div ref={secondHandRef} className={`${styles.hand} ${styles.secondHand}`} />
        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_28';
export default MemoizedClock;
