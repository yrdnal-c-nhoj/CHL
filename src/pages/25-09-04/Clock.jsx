import { useState, useEffect } from 'react';
import CustomFont from './ins.ttf';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Load custom font
    const font = new FontFace('CustomFont', `url(${CustomFont})`);
    font.load().then(() => document.fonts.add(font));

    // Update frequently for smooth motion
    const timer = setInterval(() => setTime(new Date()), 50); // 20 FPS
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 + time.getMinutes() / 60 + time.getSeconds() / 3600;
  const minutes = time.getMinutes() + time.getSeconds() / 60 + time.getMilliseconds() / 60000;
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = hours * 30; // 360 / 12
  const minuteDeg = minutes * 6; // 360 / 60
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
    transition: 'transform 0.05s linear', // smooth rotation
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
        {/* Numbers */}
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
              <span style={{
                position: 'absolute',
                top: '39%',
                left: '50%',
                transform: `translateX(-50%) rotate(${-angle}deg)`,
                color: '#F4F3E1FF',
                fontSize: '0.8rem',
                fontFamily: 'CustomFont, Arial, sans-serif',
                textShadow: `
                  1px 1px 0 #11010188,
                  -1px -1px 0 #00000088,
                  1px -1px 0 #00000088,
                  -1px 1px 0 #00000088
                `
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1.2rem',
          height: '1.2rem',
          border: '0.15rem solid #F4F3E1FF',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>
    </div>
  );
};

export default AnalogC