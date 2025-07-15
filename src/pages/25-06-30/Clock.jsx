import { useEffect } from 'react';
import friedEgg from './fried-egg.gif';
import num1 from './1.gif';
import num2 from './2.gif';
import num3 from './3.gif';
import num4 from './4.gif';
import num5 from './5.gif';
import num6 from './6.gif';
import num7 from './7.gif';
import num8 from './8.gif';
import num9 from './9.gif';
import num10 from './10.gif';
import num11 from './11.gif';
import num12 from './12.gif';
import hourHand from './whi.gif';
import minuteHand from './whis.gif';
import secondHand from './w.gif';
import './Arial.ttf';

const App = () => {
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

    const intervalId = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(intervalId);
  }, []);

  const htmlStyles = {
    backgroundColor: 'rgb(240, 203, 36)',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5rem' height='5rem' viewBox='0 0 50 50'%3E%3Ctext x='25' y='35' font-size='30' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif'%3E🥚%3C/text%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '5rem 5rem',
    minHeight: '100vh',
    margin: 0,
    fontFamily: 'Arial, sans-serif',
  };

  const bodyStyles = {
    margin: 0,
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontSize: '1rem',
  };

  const bgImageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    animation: 'slow-rotate 60s linear infinite',
    transformOrigin: 'center center',
  };

  const clockStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '55vh',
    width: '55vh',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const numberStyles = {
    position: 'absolute',
    height: '3rem',
    width: '3rem',
    transform: 'translate(-50%, -50%)',
  };

  const handStyles = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  };

  const hourStyles = {
    ...handStyles,
    zIndex: 2,
    height: '18vh',
    width: '12.8rem',
  };

  const minuteStyles = {
    ...handStyles,
    zIndex: 1,
    height: '25vh',
    width: '5rem',
  };

  const secondStyles = {
    ...handStyles,
    zIndex: 3,
    height: '30vh',
    width: '7.2rem',
    filter: 'brightness(120%)',
  };

  const numberPositions = [
    { src: num1, top: '15%', left: '73%' },
    { src: num2, top: '27%', left: '85%' },
    { src: num3, top: '50%', left: '90%' },
    { src: num4, top: '73%', left: '85%' },
    { src: num5, top: '85%', left: '73%' },
    { src: num6, top: '90%', left: '50%' },
    { src: num7, top: '85%', left: '27%' },
    { src: num8, top: '73%', left: '15%' },
    { src: num9, top: '50%', left: '10%' },
    { src: num10, top: '27%', left: '15%' },
    { src: num11, top: '15%', left: '27%' },
    { src: num12, top: '10%', left: '50%' },
  ];

  return (
    <div style={htmlStyles}>
      <style>
        {`
          @keyframes slow-rotate {
            0% {
              transform: rotate(0deg) scale(1.5);
            }
            100% {
              transform: rotate(-360deg) scale(1.5);
            }
          }
          @font-face {
            font-family: 'Arial';
            src: url('./Arial.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={bodyStyles}>
        <img src={friedEgg} style={bgImageStyles} alt="Background" />
        <div style={clockStyles}>
          {numberPositions.map((num, index) => (
            <img
              key={index}
              src={num.src}
              style={{ ...numberStyles, top: num.top, left: num.left }}
              alt={`Number ${index + 1}`}
            />
          ))}
          <img src={hourHand} style={hourStyles} id="hour" alt="Hour hand" />
          <img src={minuteHand} style={minuteStyles} id="minute" alt="Minute hand" />
          <img src={secondHand} style={secondStyles} id="second" alt="Second hand" />
        </div>
      </div>
    </div>
  );
};

export default App;