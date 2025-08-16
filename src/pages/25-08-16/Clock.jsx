import React, { useEffect, useMemo, useState } from 'react';
import imageLeft from './pal.webp';
import imageRight from './pal.webp';
import clockFace from './palm.webp'; // your circular face image (same folder)
import customFontUrl from './palm.ttf';    // your custom font file (same folder)
import hourHandImage from './p1.webp';  // your hour hand image
import minuteHandImage from './p1.webp';// your minute hand image
import secondHandImage from './p3.webp'; // your second hand image

// Unique font-family name to avoid collisions
const CLOCK_FONT_FAMILY = 'ClockFont__Scoped_9k2';

const MirroredBackground = () => {
  // Time state
  const [now, setNow] = useState(() => new Date());

  // Tick every second for smooth seconds hand; adjust if you want less updates
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Inject @font-face once (scoped by unique name; inline styles keep usage local)
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

  // Angles
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secDeg = seconds * 6;          // 360 / 60
  const minDeg = minutes * 6;          // 360 / 60
  const hourDeg = hours * 30;          // 360 / 12

  // Layout constants (using vh/vw/rem only)
  const clockSize = 'min(70vh, 70vw)';  // responsive clock diameter
  const bezel = '1rem';                 // ring thickness
  const centerDot = '0.9rem';           // center hub size

  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100vh',
    isolation: 'isolate',
    position: 'relative',
    overflow: 'hidden',
  };

  const imageSectionStyle = {
    width: '50%',
    height: '100%',
    contain: 'strict',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const leftStyle = {
    ...imageSectionStyle,
    backgroundImage: `url(${imageLeft})`,
  };

  const rightStyle = {
    ...imageSectionStyle,
    backgroundImage: `url(${imageRight})`,
    transform: 'scaleX(-1)',
  };

  // Overlay wrapper to center the clock
  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // allow clicks to pass through if needed
  };

  // Clock shell (circular, with face image)
  const clockStyle = {
    position: 'relative',
    width: clockSize,
    height: clockSize,
    borderRadius: '50%',
    backgroundImage: `url(${clockFace})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 0 0 ' + bezel + ' rgba(0,0,0,0.25) inset, 0 0 0 ' + bezel + ' rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: `'${CLOCK_FONT_FAMILY}', sans-serif`,
    color: 'rgba(0,0,0,0.85)',
  };

  // Number positioning helper
  const numberStyle = (hour) => {
    const angle = (hour - 3) * 30; // Adjust so 12 is at top
    const radius = `calc(${clockSize} * 0.36)`; // Distance from center
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

  // Shared hand style for image-based hands
  const handCommon = {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'center bottom',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  };

  // Hand dimensions relative to clock size via CSS calc
  const hourHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.08)`,
    height: `calc(${clockSize} * 0.24)`,
    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
    backgroundImage: `url(${hourHandImage})`,
  };

  const minuteHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.06)`,
    height: `calc(${clockSize} * 0.33)`,
    transform: `translateX(-50%) rotate(${minDeg}deg)`,
    backgroundImage: `url(${minuteHandImage})`,
  };

  const secondHandStyle = {
    ...handCommon,
    width: `calc(${clockSize} * 0.04)`,
    height: `calc(${clockSize} * 0.38)`,
    transform: `translateX(-50%) rotate(${secDeg}deg)`,
    backgroundImage: `url(${secondHandImage})`,
  };

  // Center hub
  const hubStyle = {
    position: 'absolute',
    width: centerDot,
    height: centerDot,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.95)',
    boxShadow: '0 0 0 0.25rem rgba(255,255,255,0.15) inset',
  };

  // Optional subtle label using custom font (stays inside the clock only)
  const labelStyle = {
    position: 'absolute',
    bottom: '12%',
    width: '100%',
    textAlign: 'center',
    fontSize: '1.1rem',
    letterSpacing: '0.1rem',
    opacity: 0.8,
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      {fontFaceTag}
      <div style={leftStyle} />
      <div style={rightStyle} />

      {/* Overlayed clock */}
      <div style={overlayStyle}>
        <div style={clockStyle} aria-label="Analog clock">
          {/* Hour numbers */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hour => (
            <div key={hour} style={numberStyle(hour)}>
              {hour}
            </div>
          ))}

          {/* Hour hand */}
          <div style={hourHandStyle} />

          {/* Minute hand */}
          <div style={minuteHandStyle} />

          {/* Second hand */}
          <div style={secondHandStyle} />

          {/* Center hub */}
          <div style={hubStyle} />

          {/* Optional label using the custom font */}
          <div style={labelStyle}>PAL CLOCK</div>
        </div>
      </div>
    </div>
  );
};

export default MirroredBackground;