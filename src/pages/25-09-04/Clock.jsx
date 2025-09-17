import { useState, useEffect } from 'react';
import font_25_09_06 from './ins.ttf';
import centerImage from './sky.gif';
import bgImage from './wood.jpeg';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const brassColor = '#bfa166';

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

  const brassGradient = (angle = '45deg') => ({
    background: `linear-gradient(${angle}, #f7e4b2, #d4b06b, #bfa166)`,
    boxShadow: '0 0 0.15rem rgba(255, 255, 255, 0.5), inset 0 0.05rem 0.1rem rgba(255,255,255,0.4)',
  });

  const handStyle = (width, height, origin) => ({
    position: 'absolute',
    width,
    height,
    borderRadius: '0.05rem',
    top: '-1rem',
    left: `calc(50% - ${parseFloat(width) / 2}rem)`,
    transformOrigin: origin,
    transition: 'transform 0.05s linear',
    ...brassGradient(),
    boxShadow: `
      -0.05rem 0 #000, 
      0.05rem 0 #fff,
      0 0 0.2rem rgba(255,255,255,0.5), 
      inset 0 0.05rem 0.15rem rgba(255,255,255,0.4)
    `,
  });

  const tickStyle = {
    width: '0.1rem',
    height: '0.5rem',
    borderRadius: '0.05rem',
    ...brassGradient(),
    boxShadow: '-0.03rem 0 #000, 0.03rem 0 #fff',
  };

  const numberStyle = {
    color: brassColor,
    fontSize: '0.9rem',
    fontFamily: 'font_25_09_06, Arial, sans-serif',
    textShadow: '-0.03rem 0 #000, 0.03rem 0 #fff',
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Background with desaturation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'brightness(1.5) saturate(0.6)',
        zIndex: 0,
      }} />

      {/* Clock */}
      <div style={{ position: 'relative', zIndex: 1, width: '20rem', height: '20rem' }}>
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
              <div style={{ ...tickStyle, position: 'absolute', top: '36%', left: '50%', transform: 'translateX(-50%)' }} />

              {/* Number */}
              <span style={{
                ...numberStyle,
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: `translateX(-50%) rotate(${-angle}deg)`,
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

        {/* Center circle with saturated image */}
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
          border: `0.1rem solid ${brassColor}`,
          filter: 'saturate(1.7)', // only the center image
        }} />
      </div>
    </div>
  );
};

export default AnalogClock;
