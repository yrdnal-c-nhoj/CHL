import React, { useEffect, useState } from 'react';

// Import 12 digit images and the background
import digitBg1 from './imgs/1.jpg';
import digitBg2 from './imgs/2.jpg';
// ... up to digitBg12
import mainBg from './imgs/bg.jpg';

const digitImages = [
  digitBg1, digitBg2, /* ... */, digitBg12
];

// Responsive size
const clockDiameterREM = 24; // scales up/down
const circleSizeREM = 3;     // scales with REM
const radiusREM = clockDiameterREM * 0.41; // for digit circle placement

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Center and hand logic
  const center = clockDiameterREM/2;
  const getCirclePosition = i => {
    const angle = ((i - 3) / 12) * 2 * Math.PI;
    return {
      left: `calc(${center}rem + ${radiusREM * Math.cos(angle)}rem - ${circleSizeREM/2}rem)`,
      top: `calc(${center}rem + ${radiusREM * Math.sin(angle)}rem - ${circleSizeREM/2}rem)`
    };
  };

  // Hand angles
  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();
  const hourAngle = (hour + minute/60) * 30;
  const minuteAngle = minute * 6;
  const secondAngle = second * 6;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${mainBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${clockDiameterREM}rem`,
          height: `${clockDiameterREM}rem`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          boxShadow: '0 0 40px #0002',
        }}
      >
        {/* Digit Circles */}
        {digitImages.map((imgSrc, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...getCirclePosition(i+1),
              width: `${circleSizeREM}rem`,
              height: `${circleSizeREM}rem`,
              borderRadius: '50%',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid #fff',
              boxShadow: '0 1px 6px #0001',
            }}
          />
        ))}

        {/* Clock Hands */}
        {/* Hour */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${clockDiameterREM * 0.19}rem`,
          height: '0.5rem',
          background: '#333',
          borderRadius: '0.25rem',
          transform: `rotate(${hourAngle}deg) translateX(-50%) translateY(-70%)`,
          transformOrigin: '0% 50%',
          zIndex: 2
        }}/>
        {/* Minute */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${clockDiameterREM * 0.27}rem`,
          height: '0.35rem',
          background: '#222',
          borderRadius: '0.175rem',
          transform: `rotate(${minuteAngle}deg) translateX(-50%) translateY(-85%)`,
          transformOrigin: '0% 50%',
          zIndex: 3
        }}/>
        {/* Second */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${clockDiameterREM * 0.33}rem`,
          height: '0.2rem',
          background: 'crimson',
          borderRadius: '0.1rem',
          transform: `rotate(${secondAngle}deg) translateX(-50%) translateY(-95%)`,
          transformOrigin: '0% 50%',
          zIndex: 4
        }}/>
        {/* Center Dot */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '1.2rem',
          height: '1.2rem',
          background: '#999',
          borderRadius: '50%',
          border: '3px solid #eee',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}/>
      </div>
    </div>
  );
};

export default AnalogClock;
