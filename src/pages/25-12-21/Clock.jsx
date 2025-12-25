import { useState, useEffect } from 'react';
import background from './cass.jpg';
import styles from './Clock.module.css';

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const digitToLetter = (digit) => {
    const letters = ['0', 'G', 'b', 'W', 'z', 'u', 'v', 'w', 'a', 's'];
    return letters[digit] || digit;
  };

  const formatWithLetters = (value) =>
    value
      .toString()
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(parseInt(d, 10)));

  const renderTimePart = (chars) => (
    <div className={styles.timePart}>
      {chars.map((char, i) => (
        <span key={i} className={styles.digit}>{char}</span>
      ))}
    </div>
  );

  return (
    <div className={styles.clockContainer}>
      <div 
        className={styles.background}
        style={{ '--bg-image': `url(${background})` }}
      />



      {/* clock */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          className="clock-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4vh',       /* HH ↔ MM ↔ SS spacing */
          }}
        >
          {renderTimePart(formatWithLetters(time.getHours()))}
          {renderTimePart(formatWithLetters(time.getMinutes()))}
          {renderTimePart(formatWithLetters(time.getSeconds()))}
        </div>
      </div>
    </div>
  );
}
