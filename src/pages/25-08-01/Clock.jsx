import { useState, useEffect, useRef } from 'react';
import myFontWoff2 from './zod.ttf';
import bg1 from './sta.gif';
import bg2 from './stars.webp';
import htmlLogo from './zod.gif';

const romanNumerals = ['l', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [numerals, setNumerals] = useState(
    romanNumerals.map(() => ({
      angle: Math.random() * 360,
      radius: (100 + Math.random() * 50) * 0.6, // 50% closer to center
      speed: 0.02 + Math.random() * 0.04,
      scale: 1 + Math.random() * 0.5,
    }))
  );

  const numeralsRef = useRef(numerals);
  numeralsRef.current = numerals;

  useEffect(() => {
    let animationFrameId;
    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    let animationFrameId;
    const updateAngles = () => {
      setNumerals((prev) =>
        prev.map((num) => ({
          ...num,
          angle: (num.angle - num.speed + 360) % 360,
        }))
      );
      animationFrameId = requestAnimationFrame(updateAngles);
    };
    animationFrameId = requestAnimationFrame(updateAngles);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const timers = [];
    romanNumerals.forEach((_, i) => {
      const changeSpeedRandomly = () => {
        setNumerals((prev) => {
          const newNumerals = [...prev];
          const current = newNumerals[i];
          let newSpeed = current.speed + (Math.random() - 0.5) * 0.06;
          newSpeed = Math.min(0.1, Math.max(0.005, newSpeed));
          newNumerals[i] = { ...current, speed: newSpeed };
          return newNumerals;
        });
        timers[i] = setTimeout(changeSpeedRandomly, 100 + Math.random() * 900);
      };
      timers[i] = setTimeout(changeSpeedRandomly, 100 + Math.random() * 900);
    });
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const originalStyle = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundRepeat: document.body.style.backgroundRepeat,
      margin: document.body.style.margin,
      padding: document.body.style.padding,
      height: document.body.style.height,
      display: document.body.style.display,
      justifyContent: document.body.style.justifyContent,
      alignItems: document.body.style.alignItems,
    };

    document.body.style.backgroundImage = `url(${bg1})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow: hidden;
      }

      .html-image {
        position: absolute;
        width: 260px;
        height: 260px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: rotateClockwise 30s linear infinite;
        z-index: 1;
      }

      @keyframes rotateClockwise {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

  .numeral {
  position: absolute;
  font-size: 6.5rem;
  color: #FDCA84FF;
  font-family: 'MyCustomFont', sans-serif;
  text-align: center;
  width: 2rem;
  pointer-events: none;
  z-index: 30;
  text-shadow: 1px 1px  #0667E6FF;
}

    `;
    document.head.appendChild(styleSheet);

    const font = new FontFace('MyCustomFont', `url(${myFontWoff2}) format('woff2')`);
    font.load().then(() => {
      document.fonts.add(font);
    }).catch(console.error);

    return () => {
      Object.assign(document.body.style, originalStyle);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const minutes = time.getMinutes();
  const hours = time.getHours() % 12 + minutes / 60;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  const wrapperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const containerStyle = {
    position: 'relative',
    width: 'min(16rem, 90vw)',
    height: 'min(16rem, 90vw)',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  };

  const centerDotStyle = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#000',
    borderRadius: '50%',
    zIndex: 6,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const handStyle = (width, height, color, angle, zIndex) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: color,
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    transformOrigin: 'bottom center',
    zIndex,
    transition: 'transform 0.1s linear',
    borderRadius: '0.2rem',
  });

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${myFontWoff2}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${bg1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${bg2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />

          <img src={htmlLogo} alt="HTML Logo" className="html-image" />

          <div style={centerDotStyle} />
          <div style={handStyle('0.25rem', '4rem', '#556389FF', hourDeg, 5)} />
          <div style={handStyle('0.15rem', '5rem', '#3E5E6DFF', minuteDeg, 5)} />

          {romanNumerals.map((numeral, index) => {
            const centerX = 0;
            const centerY = 0;
            const x = centerX + Math.cos((numerals[index].angle * Math.PI) / 180) * numerals[index].radius;
            const y = centerY - Math.sin((numerals[index].angle * Math.PI) / 180) * numerals[index].radius;
            return (
              <div
                key={numeral}
                className="numeral"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${numerals[index].scale})`,
                  transformOrigin: 'center center',
                }}
              >
                {numeral}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AnalogClock;
