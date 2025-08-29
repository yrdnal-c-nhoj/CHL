import { useState, useEffect } from 'react';
import styles from './AnalogClock.module.css';

// Import images as modules
import clockBackground from './clock-background.png';
import tick from './tick.png';
import hourHand from './hour-hand.png';
import minuteHand from './minute-hand.png';
import secondHand from './second-hand.png';
import number1 from './number-1.png';
import number2 from './number-2.png';
import number3 from './number-3.png';
import number4 from './number-4.png';
import number5 from './number-5.png';
import number6 from './number-6.png';
import number7 from './number-7.png';
import number8 from './number-8.png';
import number9 from './number-9.png';
import number10 from './number-10.png';
import number11 from './number-11.png';
import number12 from './number-12.png';

const numbers = [number1, number2, number3, number4, number5, number6, number7, number8, number9, number10, number11, number12];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className={styles.clockContainer}>
      {/* Background Image */}
      <img src={clockBackground} alt="Clock Background" className={styles.background} />

      {/* Clock Face */}
      <div className={styles.clockFace}>
        {/* Ticks */}
        {[...Array(12)].map((_, i) => (
          <img
            key={i}
            src={tick}
            alt="Tick"
            className={styles.tick}
            style={{ transform: `rotate(${i * 30}deg) translate(100px) rotate(-${i * 30}deg)` }}
          />
        ))}

        {/* Numbers */}
        {numbers.map((numSrc, i) => (
          <img
            key={i}
            src={numSrc}
            alt={`Number ${i + 1}`}
            className={styles.number}
            style={{ transform: `rotate(${i * 30}deg) translate(80px) rotate(-${i * 30}deg)` }}
          />
        ))}

        {/* Hour Hand */}
        <img
          src={hourHand}
          alt="Hour Hand"
          className={styles.hourHand}
          style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
        />

        {/* Minute Hand */}
        <img
          src={minuteHand}
          alt="Minute Hand"
          className={styles.minuteHand}
          style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}
        />

        {/* Second Hand */}
        <img
          src={secondHand}
          alt="Second Hand"
          className={styles.secondHand}
          style={{ transform: `translate(-50%, -100%) rotate(${secondDeg}deg)` }}
        />

        {/* Center Dot */}
        <div className={styles.centerDot} />
      </div>
    </div>
  );
};

export default AnalogClock;