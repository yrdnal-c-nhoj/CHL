import { useState, useEffect } from 'react';
import font_06_09_2025 from './boom.ttf'; // custom font
import bgImage from './boo.jpg'; // full-screen background
import hourHandImg from './b1.gif';
import minuteHandImg from './b2.gif';
import secondHandImg from './b3.gif';
import tickImg from './b.gif'; // tick image

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clockSize = 50; // vh
  const radius = clockSize / 2;

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (360 / 12) * (hours % 12) + (30 / 60) * minutes;
  const minuteAngle = (360 / 60) * minutes + (6 / 60) * seconds;
  const secondAngle = (360 / 60) * seconds;

  const ticks = Array.from({ length: 60 });

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Scoped Font */}
      <style>
        {`
          @font-face {
            font-family: 'analogClockFont';
            src: url(${font_06_09_2025}) format('truetype');
          }
        `}
      </style>

      <div
        style={{
          width: `${clockSize}vh`,
          height: `${clockSize}vh`,
          borderRadius: '50%',
          position: 'relative',
          fontFamily: 'analogClockFont', // only applied here
        }}
      >
        {/* Hour Numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12 - 90;
          const digitRadius = radius * 0.85;
          const x = digitRadius * Math.cos((angle * Math.PI) / 180);
          const y = digitRadius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}vh)`,
                left: `calc(50% + ${x}vh)`,
                transform: 'translate(-50%, -50%)',
                fontSize: '4rem',
                fontWeight: 'bold',
                userSelect: 'none',
                background:
                  'linear-gradient(45deg, #8B5A2B, #A0522D, #CD853F, #D2B48C)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: `
                  1px 1px 2px rgba(0,0,0,0.6),
                  -1px -1px 1px rgba(255,255,255,0.3),
                  2px 2px 4px rgba(0,0,0,0.7)
                `,
              }}
            >
              {i === 0 ? 12 : i}
            </div>
          );
        })}

        {/* Ticks */}
        {ticks.map((_, i) => {
          const angle = (i * 360) / 60;
          const tickLength = i % 5 === 0 ? 2 : 1;
          return (
            <img
              key={i}
              src={tickImg}
              alt="tick"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '0.9rem',
                height: `${tickLength}rem`,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${radius}vh)`,
                transformOrigin: '50% 50%',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.6))',
                userSelect: 'none',
              }}
            />
          );
        })}

        {/* Hour Hand */}
        <img
          src={hourHandImg}
          alt="hour"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3rem',
            height: `${radius * 0.5}vh`,
            transform: `translate(-50%, -50%) rotate(${hourAngle}deg) translate(0, -${radius * 0.25}vh)`,
            transformOrigin: '50% 50%',
            filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.7))',
            userSelect: 'none',
          }}
        />

        {/* Minute Hand */}
        <img
          src={minuteHandImg}
          alt="minute"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3rem',
            height: `${radius * 0.7}vh`,
            transform: `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${radius * 0.35}vh)`,
            transformOrigin: '50% 50%',
            filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.7))',
            userSelect: 'none',
          }}
        />

        {/* Second Hand */}
        <img
          src={secondHandImg}
          alt="second"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2.7rem',
            height: `${radius * 0.9}vh`,
            transform: `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${radius * 0.45}vh)`,
            transformOrigin: '50% 50%',
            filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.7))',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default AnalogClock;
