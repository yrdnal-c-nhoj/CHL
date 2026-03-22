import React, { useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import backgroundImage from '../../../assets/images/26-03/26-03-20/empire.webp?url';
import styles from './Clock.module.css';

interface HourMarker {
  value: number;
  angle: number;
  x: number;
  y: number;
}

const Clock = () => {
  const currentTime = useSecondClock();

  const calculateHandPositions = useCallback(() => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const hourDegrees = (hours * 30) + (minutes * 0.5) - 90;
    const minuteDegrees = (minutes * 6) + (seconds * 0.1) - 90;
    const secondDegrees = (seconds * 6) - 90;

    return { hourDegrees, minuteDegrees, secondDegrees };
  }, [currentTime]);

  const hourMarkers = useMemo<HourMarker[]>(() => {
    const markers: HourMarker[] = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90;
      const radius = 40;
      const x = 50 + radius * Math.cos(angle * Math.PI / 180);
      const y = 50 + radius * Math.sin(angle * Math.PI / 180);
      
      markers.push({ value: i, angle, x, y });
    }
    return markers;
  }, []);

  const { hourDegrees, minuteDegrees, secondDegrees } = calculateHandPositions();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Teko:wght@400&display=swap"
      />
      
      <div
        className={styles.container}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          fontFamily: 'Teko, sans-serif',
        }}
      >
        <div className={styles.clockContainer}>
          <div className={styles.analogClock}>
            <div className={styles.clockFace}>
              {hourMarkers.map((marker) => (
                <div
                  key={marker.value}
                  className={styles.hourNumber}
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Teko, sans-serif',
                    fontSize: '3rem',
                    textShadow: 'none',
                    color: '#ffffff',
                  }}
                >
                  {marker.value}
                </div>
              ))}
              
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
    </>
  );
};

export default Clock;
