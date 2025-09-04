import { useState, useEffect } from 'react';
import CustomFont from './in.ttf'; // replace with your font filename

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Load custom font
    const font = new FontFace('CustomFont', `url(${CustomFont})`);
    font.load().then(() => {
      document.fonts.add(font);
    });

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
      <div style={{
        position: 'relative',
        width: '20rem',
        height: '20rem',
      }}>
        {/* Number circle */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `rotate(${angle}deg)`,
                textAlign: 'center',
              }}
            >
              <span style={{
                position: 'absolute',
                top: '35%', // closer to center
                left: '50%',
                transform: `translateX(-50%) rotate(${-angle}deg)`,
                color: '#fff',
                fontSize: '1.5rem',
                fontFamily: 'CustomFont, Arial, sans-serif',
              }}>
                {i + 1}
              </span>
            </div>
          );
        })}

        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `rotate(${hourDeg}deg)`,
        }}>
          <div style={{
            position: 'absolute',
            width: '0.5rem',
            height: '4rem',
            backgroundColor: '#fff',
            top: '-1rem',
            left: 'calc(50% - 0.25rem)',
            transformOrigin: 'center 3rem',
          }} />
        </div>

        {/* Minute hand */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `rotate(${minuteDeg}deg)`,
        }}>
          <div style={{
            position: 'absolute',
            width: '0.3rem',
            height: '5rem',
            backgroundColor: '#ccc',
            top: '-2rem',
            left: 'calc(50% - 0.15rem)',
            transformOrigin: 'center 4rem',
          }} />
        </div>

        {/* Second hand */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `rotate(${secondDeg}deg)`,
        }}>
          <div style={{
            position: 'absolute',
            width: '0.1rem',
            height: '6rem',
            backgroundColor: '#f00',
            top: '-3rem',
            left: 'calc(50% - 0.05rem)',
            transformOrigin: 'center 5rem',
          }} />
        </div>

        {/* Center dot */}
        <div style={{
          position: 'absolute',
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: '#fff',
          borderRadius: '50%',
          top: 'calc(50% - 0.25rem)',
          left: 'calc(50% - 0.25rem)',
        }} />
      </div>
    </div>
  );
};

export default AnalogClock;
