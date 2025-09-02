import React, { useState, useEffect } from 'react';
import * as DigitalClock from './ChinaClock.module.css';
import NotoSerifCJKSC from './NotoSerif.ttf';
import bgImage from './clo.jpg'; // local background image

const chineseDigits = {
  0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
  5: '五', 6: '六', 7: '七', 8: '八', 9: '九'
};

const ChinaClock = () => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTimeToChinese = (date) => {
    const hours = date.getHours().toString().padStart(2, '0').split('');
    const minutes = date.getMinutes().toString().padStart(2, '0').split('');
    const seconds = date.getSeconds().toString().padStart(2, '0').split('');

    const toChinese = (digits) => digits.map(d => chineseDigits[d]).join('');

    if (isMobile) {
      return [toChinese(hours), toChinese(minutes), toChinese(seconds)];
    } else {
      return `${toChinese(hours)}:${toChinese(minutes)}.${toChinese(seconds)}`;
    }
  };

  const clockStyle = {
    fontFamily: 'Noto Serif CJK SC',
    fontSize: '4rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFE135)', // gold gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: `
      0 0 5px #FFD700,
      0 0 10px #FFA500,
      0 0 15px #FFB900,
      0 2px 2px rgba(0,0,0,0.3),
      0 4px 10px rgba(0,0,0,0.5)
    `,
    fontWeight: 'bold',
    letterSpacing: '0.1rem',
    position: 'relative', // ensure it's above the background
    zIndex: 1,
  };

  const partStyle = { textAlign: 'center' };

  const timeParts = formatTimeToChinese(time);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    }}>
      {/* Cinematic Background Layer */}
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
        filter: 'invert(100%) hue-rotate(180deg) brightness(0.5) contrast(1.3) saturate(1.2)',
        zIndex: 0,
      }}>
        {/* Optional Vignette Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)',
        }} />
      </div>

      {/* Clock */}
      <div style={clockStyle} className={DigitalClock.clock}>
        <style>
          {`
            @font-face {
              font-family: 'Noto Serif CJK SC';
              src: url(${NotoSerifCJKSC}) format('truetype');
              font-weight: normal;
              font-style: normal;
            }
          `}
        </style>
        {isMobile
          ? timeParts.map((part, idx) => <div key={idx} style={partStyle}>{part}</div>)
          : <span style={partStyle}>{timeParts}</span>
        }
      </div>
    </div>
  );
};

export default ChinaClock;
