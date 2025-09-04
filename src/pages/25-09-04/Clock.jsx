import { useState, useEffect } from 'react';
import CustomFont from './in.ttf';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Load custom font
    const font = new FontFace('CustomFont', `url(${CustomFont})`);
    font.load().then(() => document.fonts.add(font));

    // Update more frequently for smooth motion
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
      height: '100dvh',
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
                color: '#F8E2F5FF',
                fontSize: '1.0rem',
                fontFamily: 'CustomFont, Arial, sans-serif',
              }}>
                {i + 1}
              </span>
            </div>
          );
        })}

        {/* Hour hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${hourDeg}deg)` }}>
          <div style={handStyle('0.5rem', '5rem', '#fff', 'center 3rem')} />
        </div>

        {/* Minute hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${minuteDeg}deg)` }}>
          <div style={handStyle('0.3rem', '7rem', '#ccc', 'center 4rem')} />
        </div>

        {/* Second hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${secondDeg}deg)` }}>
          <div style={handStyle('0.1rem', '7rem', '#EEBFE5FF', 'center 5rem')} />
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
