import React, { useEffect, useMemo, useState } from 'react';
import imageLeft from './pal.webp';
import imageRight from './pal.webp';
import clockFace from './palm.webp';
import customFontUrl from './palm.ttf';
import hourHandImage from './p1.webp';
import minuteHandImage from './p2.webp';
import secondHandImage from './p3.webp';

const CLOCK_FONT_FAMILY = 'ClockFont__Scoped_9k2';

const MirroredBackground = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fontFaceTag = useMemo(() => {
    const css = `
      @font-face {
        font-family: '${CLOCK_FONT_FAMILY}';
        src: url(${customFontUrl}) format('truetype');
        font-display: swap;
      }
    `;
    return <style>{css}</style>;
  }, []);

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secDeg = seconds * 6;
  const minDeg = minutes * 6;
  const hourDeg = hours * 30;

  const clockSize = 'min(70vh, 70vw)';
  const bezel = '1rem';
  const centerDot = '0.9rem';

  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    isolation: 'isolate',
  };

  const imageSectionStyle = {
    width: '50%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    contain: 'strict',
  };

  const leftStyle = {
    ...imageSectionStyle,
    backgroundImage: `url(${imageLeft})`,
    filter: 'brightness(0.9) contrast(1.0) saturate(0.8) blur(0.2rem)',
  };

  const rightStyle = {
    ...imageSectionStyle,
    backgroundImage: `url(${imageRight})`,
    transform: 'scaleX(-1)',
    filter: 'brightness(0.9) contrast(1.0) saturate(0.8) blur(0.2rem)',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  };

  const clockStyle = {
    position: 'relative',
    width: clockSize,
    height: clockSize,
    borderRadius: '50%',
    backgroundImage: `url(${clockFace})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: `0 0 0 ${bezel} rgba(0,0,0,0.25) inset, 0 0 0 ${bezel} rgba(255,255,255,0.08)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: `'${CLOCK_FONT_FAMILY}', sans-serif`,
    color: '#A3D81BFF',
    filter: 'drop-shadow(0 0 0.5rem rgba(0,0,0,0.3))',
  };

  const numberStyle = (hour) => {
    const angle = (hour - 3) * 30;
    const radius = `calc(${clockSize} * 0.36)`;
    const x = `calc(50% + ${radius} * ${Math.cos(angle * Math.PI / 180)})`;
    const y = `calc(50% + ${radius} * ${Math.sin(angle * Math.PI / 180)})`;

    return {
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      fontSize: `calc(${clockSize} * 0.08)`,
      fontWeight: 'bold',
      textShadow: '0 0 0.3rem rgba(255,255,255,0.8)',
      userSelect: 'none',
      zIndex: 1,
    };
  };

  const handCommon = {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'center bottom',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  };

  const hourHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.22)`,
    height: `calc(${clockSize} * 0.56)`,
    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
    backgroundImage: `url(${hourHandImage})`,
    filter: 'drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) brightness(1.2)',
  };

  const minuteHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.39)`,
    height: `calc(${clockSize} * 0.495)`,
    transform: `translateX(-50%) rotate(${minDeg}deg)`,
    backgroundImage: `url(${minuteHandImage})`,
    // filter: 'drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) brightness(1.2)',
  };

  const secondHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.56)`,
    height: `calc(${clockSize} * 0.47)`,
    transform: `translateX(-50%) rotate(${secDeg}deg)`,
    backgroundImage: `url(${secondHandImage})`,
    // filter: 'drop-shadow(0 0 0.3rem rgba(0,0,0,0.7)) saturate(1.5)',
  };

  const hubStyle = {
    position: 'absolute',
    width: centerDot,
    height: centerDot,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.95)',
    boxShadow: '0 0 0 0.25rem rgba(255,255,255,0.15) inset',
  };

  return (
    <div style={containerStyle}>
      {fontFaceTag}
      <div style={leftStyle} />
      <div style={rightStyle} />

      <div style={overlayStyle}>
        <div style={clockStyle} aria-label="Analog clock">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hour => (
            <div key={hour} style={numberStyle(hour)}>{hour}</div>
          ))}
          <div style={hourHandStyle} />
          <div style={minuteHandStyle} />
          <div style={secondHandStyle} />
          <div style={hubStyle} />
        
        </div>
      </div>
    </div>
  );
};

export default MirroredBackground;
