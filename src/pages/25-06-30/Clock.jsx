import React, { useEffect } from 'react';
import bgImage from './fried-egg.gif';
import img1 from './1.gif';
import img2 from './2.gif';
import img3 from './3.gif';
import img4 from './4.gif';
import img5 from './5.gif';
import img6 from './6.gif';
import img7 from './7.gif';
import img8 from './8.gif';
import img9 from './9.gif';
import img10 from './10.gif';
import img11 from './11.gif';
import img12 from './12.gif';
import hourHand from './whi.gif';
import minuteHand from './whis.gif';
import secondHand from './w.gif';

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours() % 12;

      const secondDeg = second * 6;
      const minuteDeg = minute * 6 + second * 0.1;
      const hourDeg = hour * 30 + minute * 0.5;

      document.getElementById('second').style.transform = `translate(-50%, 0%) rotate(${secondDeg}deg)`;
      document.getElementById('minute').style.transform = `translate(-50%, 0%) rotate(${minuteDeg}deg)`;
      document.getElementById('hour').style.transform = `translate(-50%, 0%) rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const eggBackground = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    objectFit: 'cover',
    zIndex: 1,
    animation: 'slow-rotate 60s linear infinite',
    transformOrigin: 'center center',
  };

  const clockStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '75vh',
    width: '75vh',
        zIndex: 2,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const numberStyle = {
    position: 'absolute',
    height: '3rem',
    width: '3rem',
    transform: 'translate(-50%, -50%)',
  };

  const handStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  };

  return (
    <div
      style={{
        backgroundColor: 'rgb(240, 203, 36)',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ctext x='25' y='35' font-size='30' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif'%3E🥚%3C/text%3E%3C/svg%3E\")",
        backgroundRepeat: 'repeat',
        backgroundSize: '15vw 15vw',
        margin: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontSize: '1rem',
        position: 'relative',
      }}
    >
      {/* Animated Background */}
      <img src={bgImage} alt="Egg background" style={eggBackground} />

      {/* Clock */}
      <div style={clockStyle}>
        {[img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12].map((img, i) => {
          const positions = [
            { top: '13%', left: '73%' },
            { top: '29%', left: '85%' },
            { top: '50%', left: '92%' },
            { top: '73%', left: '85%' },
            { top: '85%', left: '73%' },
            { top: '90%', left: '50%' },
            { top: '85%', left: '27%' },
            { top: '73%', left: '15%' },
            { top: '50%', left: '9%' },
            { top: '29%', left: '15%' },
            { top: '15%', left: '27%' },
            { top: '10%', left: '50%' },
          ];
          return (
            <img
              key={i}
              src={img}
              alt={`Number ${i + 1}`}
              style={{ ...numberStyle, ...positions[i] }}
            />
          );
        })}
        <img id="hour" src={hourHand} alt="Hour hand" style={{ ...handStyle, height: '18vh', width: '12.8rem', zIndex: 2 }} />
        <img id="minute" src={minuteHand} alt="Minute hand" style={{ ...handStyle, height: '25vh', width: '5rem', zIndex: 1 }} />
        <img id="second" src={secondHand} alt="Second hand" style={{ ...handStyle, height: '30vh', width: '7.2rem', zIndex: 3, filter: 'brightness(120%)' }} />
      </div>

      {/* Slow rotate keyframe */}
      <style>
        {`
          @keyframes slow-rotate {
            0% { transform: rotate(0deg) scale(1.5); }
            100% { transform: rotate(-360deg) scale(1.5); }
          }
        `}
      </style>
    </div>
  );
};

export default Clock;
