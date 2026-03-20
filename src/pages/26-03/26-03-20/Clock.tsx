import React, { useState, useEffect } from 'react';
import type { ClockTime } from '@/types/clock';
import backgroundImage from '../../../assets/images/26-03/26-03-20/empire.webp';
import './Clock.css';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
      const x = 240 * Math.cos(angle * Math.PI / 180);
      const y = 240 * Math.sin(angle * Math.PI / 180);
      
      markers.push(
        <div
          key={i}
          className="hour-number"
          style={{
            left: `${300 + x}px`,
            top: `${300 + y}px`,
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
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div 
        className="clock-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="analog-clock">
          <div className="clock-face">
            {renderHourMarkers()}
            
            <div
              className="hand hour-hand"
              style={{
                transform: `rotate(${hourDegrees}deg)`
              }}
            />
            
            <div
              className="hand minute-hand"
              style={{
                transform: `rotate(${minuteDegrees}deg)`
              }}
            />
            
            <div
              className="hand second-hand"
              style={{
                transform: `rotate(${secondDegrees}deg)`
              }}
            />
            
            <div className="center-dot" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
