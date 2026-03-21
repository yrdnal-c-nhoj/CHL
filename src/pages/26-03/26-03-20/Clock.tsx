import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import backgroundImage from '../../../assets/images/26-03/26-03-20/empire.webp';
import fontFile from '../../../assets/fonts/26-03-01-270west.ttf?url';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  // Standardized font loading
  const fontConfigs = useMemo(() => [
    {
      fontFamily: '270west',
      fontUrl: fontFile,
      options: { weight: 'normal', style: 'normal' }
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5) - 90;
  const minuteDegrees = (minutes * 6) + (seconds * 0.1) - 90;
  const secondDegrees = (seconds * 6) - 90;

  const renderHourMarkers = () => {
    const markers: React.ReactNode[] = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90;
      // Using percentage based positioning for responsiveness
      const radius = 40; // 40% from center
      const x = 50 + radius * Math.cos(angle * Math.PI / 180);
      const y = 50 + radius * Math.sin(angle * Math.PI / 180);
      
      markers.push(
        <div
          key={i}
          className={styles.hourNumber}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {i}
        </div>
      );
    }
    return markers;
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div 
        className={styles.clockContainer}
      >
        <div className={styles.analogClock}>
          <div className={styles.clockFace}>
            {renderHourMarkers()}
            
            <div
              className={`${styles.hand} ${styles.hourHand}`}
              style={{
                transform: `rotate(${hourDegrees}deg)`
              }}
            />
            
            <div
              className={`${styles.hand} ${styles.minuteHand}`}
              style={{
                transform: `rotate(${minuteDegrees}deg)`
              }}
            />
            
            <div
              className={`${styles.hand} ${styles.secondHand}`}
              style={{
                transform: `rotate(${secondDegrees}deg)`
              }}
            />
            
            <div className={styles.centerDot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
