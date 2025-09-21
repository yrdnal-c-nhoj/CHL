import { useState, useEffect } from 'react';
import font_06_09_2025 from './boom.ttf';
import bgImage from './boo.jpg';
import hourHandImg from './b1.gif';
import minuteHandImg from './b2.gif';
import secondHandImg from './b3.gif';
import tickImg from './b.gif';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [isReady, setIsReady] = useState(false);

  // Preload font + background image
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    const checkReady = () => {
      if (fontLoaded && imageLoaded) setIsReady(true);
    };

    const font = new FontFace(
      'AnalogClockFont_06_09_2025',
      `url(${font_06_09_2025})`
    );
    font.load().then(() => {
      fontLoaded = true;
      checkReady();
    });

    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
  }, []);

  // Update clock every second
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isReady]);

  if (!isReady) {
    // black screen until everything loaded
    return (
      <div style={{ width: '100vw', height: '100dvh', backgroundColor: 'black' }} />
    );
  }

  const clockSize = 50; // in vh
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
        position: 'relative',
        fontFamily: "'AnalogClockFont_06_09_2025', sans-serif",
      }}
    >
      {/* Scoped font */}
      <style>{`
        @font-face {
          font-family: 'AnalogClockFont_06_09_2025';
          src: url(${font_06_09_2025}) format('truetype');
        }
      `}</style>

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Clock container */}
      <div
        style={{
          position: 'absolute',
          width: `${clockSize}vh`,
          height: `${clockSize}vh`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      >
        {/* Numbers */}
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
                background:
                  'linear-gradient(45deg, #8B5A2B, #A0522D, #CD853F, #D2B48C)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: `
                  0.1rem 0.1rem 0.2rem rgba(0,0,0,0.6),
                  -0.1rem -0.1rem 0.1rem rgba(255,255,255,0.3),
                  0.2rem 0.2rem 0.4rem rgba(0,0,0,0.7)
                `,
                userSelect: 'none',
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
            transform: `translate(-50%, -50%) rotate(${hourAngle}deg) translate(0, -${
              radius * 0.25
            }vh)`,
            transformOrigin: '50% 50%',
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
            transform: `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${
              radius * 0.35
            }vh)`,
            transformOrigin: '50% 50%',
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
            transform: `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${
              radius * 0.45
            }vh)`,
            transformOrigin: '50% 50%',
          }}
        />
      </div>
    </div>
  );
};

export default AnalogClock;
