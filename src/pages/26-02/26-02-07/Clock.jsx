import React, { useState, useEffect, useMemo } from 'react';
import customFontUrl from '../../../assets/fonts/26-02-07-gear.ttf?url'; 
import backgroundImage from '../../../assets/clocks/26-02-07/gear.gif'; 

const FullscreenClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  const fontFamily = useMemo(() => {
    const id = Math.random().toString(36).substring(2, 7);
    return `GearFont-${id}`;
  }, []);

  useEffect(() => {
    const styleId = `style-${fontFamily}`;
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${customFontUrl}') format('truetype');
        font-display: block;
      }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .clock-digit {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 1;
        animation: rotate 60s linear infinite;
        will-change: transform;
        text-shadow: 15vh 15vh 0px rgb(0, 0, 0), -15vh 15vh 0px rgb(0, 0, 0), 15vh -15vh 0px rgb(0, 0, 0), -15vh -15vh 0px rgb(0, 0, 0); 
      }
      @media (min-width: 1024px) {
        .clock-grid { grid-template-columns: repeat(8, 1fr); }
        .clock-digit { font-size: 28vh; }
      }
      @media (min-width: 600px) and (max-width: 1023px) {
        .clock-grid { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); }
        .clock-digit { font-size: 26vh; }
      }
      @media (max-width: 599px) {
        .clock-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 1fr); }
        .clock-digit { font-size: 22vh; }
      }
    `;
    document.head.appendChild(styleEl);

    if ('fonts' in document) {
      document.fonts.load(`1em ${fontFamily}`).finally(() => setFontLoaded(true));
    } else {
      setFontLoaded(true);
    }

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [fontFamily]);

  const digits = useMemo(() => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const str = [
      String(hours).padStart(2, '0'),
      String(time.getMinutes()).padStart(2, '0'),
      String(time.getSeconds()).padStart(2, '0'),
      ampm
    ].join('');
    return str.split('');
  }, [time]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      backgroundColor: '#E9F7AB',
      backgroundImage: 'radial-gradient(circle, #E9F7AB 0%, #CDF296 100%)',
      overflow: 'hidden',
      fontFamily: fontLoaded ? `'${fontFamily}', sans-serif` : 'sans-serif',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in'
    }}>
      {/* Unified Background Layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '45px 45px',
        backgroundRepeat: 'repeat',
        transform: 'scaleX(-1)',
        opacity: 0.4,
        filter: 'brightness(3) contrast(8.5) saturate(0.2) hue-rotate(183deg)',
        zIndex: 1
      }} />
      
      <div className="clock-grid" style={{
        position: 'relative',
        display: 'grid',
        width: '100%',
        height: '100%',
        zIndex: 2,
        color: '#000000'
      }}>
        {digits.map((char, i) => (
          <div key={i} className="clock-digit">
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullscreenClock;