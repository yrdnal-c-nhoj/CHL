import { useState, useEffect } from 'react';
import centerImage from './sky.gif';
import bgImage from './wood.jpeg';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const brassColor = '#bfa166';

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Ticking hands
  const hours = time.getHours() % 12 + Math.floor(time.getMinutes()) / 60;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = hours * 30;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const brassGradient = (angle = '45deg') => ({
    background: `linear-gradient(${angle}, #f7e4b2, #d4b06b, #bfa166)`,
    boxShadow: '0 0 0.15rem rgba(255, 255, 255, 0.5), inset 0 0.05rem 0.1rem rgba(255,255,255,0.4)',
  });

  // Adjust handStyle so hour hand is closer to center
  const handStyle = (width, height, origin, offset = 6) => ({
    position: 'absolute',
    width,
    height,
    borderRadius: '0.5rem',
    top: `${offset}rem`, // smaller offset = closer to center
    left: `calc(50% - ${parseFloat(width)}rem / 2)`,
    transformOrigin: origin,
    transition: 'transform 0.1s step-end',
    ...brassGradient(),
    boxShadow: `
      -0.05rem 0 #000, 
      0.05rem 0 #fff,
      0 0 0.2rem rgba(255,255,255,0.5), 
      inset 0 0.05rem 0.15rem rgba(255,255,255,0.4)
    `,
  });

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Background */}
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
        filter: 'brightness(1.5) saturate(2.6)',
        zIndex: 0,
      }} />

      {/* Clock container */}
      <div style={{ position: 'relative', zIndex: 1, width: '51rem', height: '51rem' }}>
        {/* Clock hands */}
     {/* Clock hands */}
<div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${hourDeg}deg)` }}>
  <div style={handStyle('1.4rem', '11rem', 'center 2rem', 6)} /> {/* Changed from 10 to 6 */}
</div>
<div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${minuteDeg}deg)` }}>
  <div style={handStyle('0.7rem', '11rem', 'center 4rem', 6)} />
</div>
<div style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${secondDeg}deg)` }}>
  <div style={handStyle('0.1rem', '11rem', 'center 5rem', 6)} />
</div>

        {/* Clock center */}
        <div style={{
          width: '13rem',
          height: '13rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, #f7e4b2, #bfa166, #6d5220)`,
          boxShadow: `
            inset 0 0.6rem 1.2rem rgba(255,255,255,0.5),
            inset 0 -0.6rem 1.2rem rgba(0,0,0,0.6),
            0 0.8rem 1.5rem rgba(0,0,0,0.8)
          `,
          border: '0.45rem solid rgba(140,110,60,0.9)',
        }}>
          <div style={{
            width: '12rem',
            height: '12rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundImage: `url(${centerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.7)',
          }} />
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
