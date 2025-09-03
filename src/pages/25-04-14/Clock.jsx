import React, { useEffect, useState } from 'react';
import backgroundImage from './images/photo-1495578942200-c5f5d2137def.avif';

const BlueBrickClock = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const ballStyle = {
    width: '2vw',
    height: '3vw',
    background: 'radial-gradient(circle at 30% 30%, #7d9ac9, #a5c1e6)',
    boxShadow: '0 0 1vw 0.4vw rgba(117, 151, 215, 0.8)',
    animation: 'pop 0.6s cubic-bezier(0.28, 0.84, 0.42, 1)',
  };

  const renderBalls = (count) =>
    Array.from({ length: count }, (_, i) => (
      <div key={i} style={ballStyle} />
    ));

  return (
    <div style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transform: 'rotate(180deg)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '33% 33%',
        backgroundRepeat: 'repeat',
        filter: 'blur(4px) hue-rotate(180deg)',
        zIndex: 1,
      }} />

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
        {['hours', 'seconds', 'minutes'].map((unit, idx) => (
          <div key={unit} style={{ position: 'relative', width: '90vw', marginBottom: '2vh' }}>
            <div style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 0.2vw)',
              justifyContent: 'center',
              alignContent: 'center',
              gap: '3vw',
              zIndex: 2,
              pointerEvents: 'none',
              height: '23vh',
            }}>
              {renderBalls(time[unit])}
            </div>
          </div>
        ))}
      </div>

      {/* Keyframes style */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @media (max-width: 60vw) {
            div[style*="flex-direction: row"] {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BlueBrickClock;
