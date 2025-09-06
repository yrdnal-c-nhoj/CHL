import { useState, useEffect } from 'react';
import font_25_09_06 from './ins.ttf';
import centerImage from './sky.gif';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const font = new FontFace('font_25_09_06', `url(${font_25_09_06})`);
    font.load().then(() => document.fonts.add(font));

    const timer = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 + time.getMinutes() / 60 + time.getSeconds() / 3600;
  const minutes = time.getMinutes() + time.getSeconds() / 60 + time.getMilliseconds() / 60000;
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = hours * 30;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  // Single color variable for everything
  const clockColor = '#A7A45FFF'; // <-- Change this one variable to recolor all

  const handStyle = (width, height, origin) => ({
    position: 'absolute',
    width,
    height,
    backgroundColor: clockColor,
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
      <div style={{ position: 'relative', width: '20rem', height: '20rem' }}>
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
                top: '36%',
                left: '50%',
                width: '0.1rem',
                height: '0.5rem',
                backgroundColor: clockColor,
                transform: 'translateX(-50%)',
                borderRadius: '0.05rem',
              }} />

              {/* Number */}
              <span style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: `translateX(-50%) rotate(${-angle}deg)`,
                color: clockColor,
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
          <div style={handStyle('1.4rem', '4rem', 'center 3rem')} />
        </div>

        {/* Minute hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${minuteDeg}deg)` }}>
          <div style={handStyle('0.7rem', '7rem', 'center 4rem')} />
        </div>

        {/* Second hand */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${secondDeg}deg)` }}>
          <div style={handStyle('0.1rem', '7rem', 'center 5rem')} />
        </div>

        {/* Center circle */}
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          backgroundImage: `url(${centerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: `0.1rem solid ${clockColor}`,
        }} />
      </div>
    </div>
  );
};

export default AnalogClock;
