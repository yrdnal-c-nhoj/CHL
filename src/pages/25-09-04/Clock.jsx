import { useState, useEffect } from 'react';
import font_25_09_06 from './ins.ttf';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Load custom font
    const font = new FontFace('font_25_09_06', `url(${font_25_09_06})`);
    font.load().then(() => document.fonts.add(font));

    // Update frequently for smooth motion
    const timer = setInterval(() => setTime(new Date()), 50); // 20 FPS
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 + time.getMinutes() / 60 + time.getSeconds() / 3600;
  const minutes = time.getMinutes() + time.getSeconds() / 60 + time.getMilliseconds() / 60000;
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = hours * 30;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const handStyle = (width, height, color, origin) => ({
    position: 'absolute',
    width,
    height,
    backgroundColor: color,
    top: '-1rem',
    left: `calc(50% - ${parseFloat(width)/2}rem)`,
    transformOrigin: origin,
    borderRadius: '0.05rem',
    transition: 'transform 0.05s linear',
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#3D2D02FF',
    }}>
      <div style={{
        position: 'relative',
        width: '20rem',
        height: '20rem',
      }}>
        {/* Numbers + Ticks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          return (
            <div key={i} style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${angle}deg)`,
              textAlign: 'center',
            }}>
              {/* Tick mark */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                width: '0.2rem',
                height: '1rem',
                backgroundColor: '#FFFFFFFF',
                transform: 'translateX(-50%)',
                borderRadius: '0.05rem',
              }} />

              {/* Number */}
              <span style={{
                position: 'absolute',
                top: '32%',
                left: '50%',
                transform: `translateX(-50%) rotate(${-angle}deg)`,
                color: '#F4F3E1FF',
                fontSize: '0.9rem',
                fontFamily: 'font_25_09_06, Arial, sans-serif',
              }}>
                {i + 1}
              </span>
            </div>
          );
        })}

        {/* Hour hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${hourDeg}deg)` }}>
          <div style={handStyle('1.4rem', '4rem', '#F4F4DBFF', 'center 3rem')} />
        </div>

        {/* Minute hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${minuteDeg}deg)` }}>
          <div style={handStyle('0.7rem', '7rem', '#F7F7D7FF', 'center 4rem')} />
        </div>

        {/* Second hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${secondDeg}deg)` }}>
          <div style={handStyle('0.1rem', '7rem', '#FAF7D9FF', 'center 5rem')} />
        </div>

        {/* Center circle */}
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          backgroundColor: 'transparent',
          border: '0.1rem solid #FFFFFFFF',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

      </div>
    </div>
  );
};

export default AnalogClock;
