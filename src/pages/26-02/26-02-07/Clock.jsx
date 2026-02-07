import React, { useState, useEffect, useMemo } from 'react';
import customFontUrl from '../../../assets/fonts/26-02-07-gear.ttf?url'; 
import backgroundImage from '../../../assets/clocks/26-02-07/gea.gif'; 

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
    `;
    document.head.appendChild(styleEl);

    if ('fonts' in document) {
      document.fonts.load(`1em ${fontFamily}`)
        .then(() => setFontLoaded(true))
        .catch(() => setFontLoaded(true));
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

  const getTimeParts = (date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hrStr = String(hours).padStart(2, '0');
    const minStr = String(date.getMinutes()).padStart(2, '0');
    const secStr = String(date.getSeconds()).padStart(2, '0');
    return [...hrStr.split(''), ...minStr.split(''), ...secStr.split(''), ...ampm.split('')];
  };

  const digits = getTimeParts(time);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      backgroundColor: '#E8F5AB',
      backgroundImage: 'radial-gradient(circle, #E8F5AB 0%, #E0FA78 100%)',
      overflow: 'hidden',
      fontFamily: fontLoaded ? `'${fontFamily}', sans-serif` : 'sans-serif',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in'
    }}>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)',
          opacity: 0.3,
          filter: 'brightness(2) saturate(0.2) hue-rotate(180deg)',
          zIndex: 1
        }}
      />

      <div className="clock-grid" style={{
        position: 'relative',
        display: 'grid',
        width: '100%',
        height: '100%',
        zIndex: 2,
        color: '#000000'
      }}>
        <style>
          {`
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
              /* Prevents flickering on shadow updates */
              backface-visibility: hidden; 
              
              text-shadow: 
                15vh 15vh 0px rgb(0, 0, 0),
                -15vh 15vh 0px rgb(0, 0, 0),
                15vh -15vh 0px rgb(0, 0, 0),
                -15vh -15vh 0px rgb(0, 0, 0); 
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
          `}
        </style>

        {digits.map((char, i) => (
          /* CRITICAL FIX: Using the index 'i' as the key. 
             This keeps the div element alive across renders so the 
             CSS animation is never interrupted. 
          */
          <div key={`digit-${i}`} className="clock-digit">
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullscreenClock;