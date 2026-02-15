import React, { useState, useEffect, useMemo } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';import customFontUrl from '../../../assets/fonts/26-02-07-gear.ttf?url'; 
import backgroundImage from '../../../assets/images/26-02-07/gear.gif'; 

const FullscreenClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const FONT_NAME = 'GearFont';

  useEffect(() => {
    const font = new FontFace(FONT_NAME, `url(${customFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      height: '100vh',
      backgroundColor: '#E9F7AB',
      backgroundImage: 'radial-gradient(circle, #E9F7AB 0%, #CDF296 100%)',
      overflow: 'hidden',
      fontFamily: fontLoaded ? `'${FONT_NAME}', sans-serif` : 'sans-serif',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in',
      visibility: fontLoaded ? 'visible' : 'hidden', // Prevent FOUC for custom font
    }}>
      
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .clock-grid {
          position: relative;
          display: grid;
          width: 100%;
          height: 100%;
          z-index: 2;
          color: #7B0404;
        }

        .clock-digit {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          line-height: 1;
          animation: rotate 60s linear infinite;
          will-change: transform;
          /* Restored your exact original 16vh tech shadows */
          text-shadow: 16vh 16vh 0px #1111aa, -16vh 16vh 0px #1111aa, 16vh -16vh 0px #1111aa, -16vh -16vh 0px #1111aa; 
        }

        /* Laptop: 2 rows of 4 digits */
        @media (min-width: 1024px) {
          .clock-grid { 
            grid-template-columns: repeat(4, 1fr); 
            grid-template-rows: repeat(2, 1fr); 
          }
          .clock-digit { font-size: 28vh; }
        }

        /* Tablet/Medium: Keep 4 columns */
        @media (min-width: 600px) and (max-width: 1023px) {
          .clock-grid { 
            grid-template-columns: repeat(4, 1fr); 
            grid-template-rows: repeat(2, 1fr); 
          }
          .clock-digit { font-size: 22vh; }
        }

        /* Phone: 4 rows of 2 digits */
        @media (max-width: 599px) {
          .clock-grid { 
            grid-template-columns: repeat(2, 1fr); 
            grid-template-rows: repeat(4, 1fr); 
          }
          .clock-digit { 
            font-size: 14vh; 
            text-shadow: 8vh 8vh 0px #1111aa, -8vh 8vh 0px #1111aa, 8vh -8vh 0px #1111aa, -8vh -8vh 0px #1111aa;
          }
        }

        /* Small phones: 4 rows of 2 digits with smaller sizes */
        @media (max-width: 400px) {
          .clock-grid { 
            grid-template-columns: repeat(2, 1fr); 
            grid-template-rows: repeat(4, 1fr); 
          }
          .clock-digit { 
            font-size: 12vh; 
            text-shadow: 6vh 6vh 0px #1111aa, -6vh 6vh 0px #1111aa, 6vh -6vh 0px #1111aa, -6vh -6vh 0px #1111aa;
          }
        }

        /* Very small phones: 4 rows of 2 digits with minimal sizes */
        @media (max-width: 320px) {
          .clock-grid { 
            grid-template-columns: repeat(2, 1fr); 
            grid-template-rows: repeat(4, 1fr); 
          }
          .clock-digit { 
            font-size: 10vh; 
            text-shadow: 4vh 4vh 0px #1111aa, -4vh 4vh 0px #1111aa, 4vh -4vh 0px #1111aa, -4vh -4vh 0px #1111aa;
          }
        }
      `}</style>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="gear-fix">
          <feColorMatrix type="matrix" values="
             -0.81  2.13  0.18  0  0
              0.18 -0.81  2.13  0  0
              2.13  0.18 -0.81  0  0
              0     0     0     0.4 0" />
        </filter>
      </svg>

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '15vh 15vh',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        transform: 'scaleX(-1) translateZ(0)',
        filter: 'url(#gear-fix) brightness(2.8) contrast(0.8)', 
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      <div className="clock-grid">
        {digits.map((char, i) => (
          /* key={i} ensures the DIV is not re-mounted, so rotation is continuous */
          <div key={i} className="clock-digit">
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullscreenClock;