import React, { useState, useEffect, useMemo } from 'react';
// Assets - ensure these paths are correct in your project structure
import customFontUrl from '../../../assets/fonts/26-02-07-gear.ttf?url'; 
import backgroundImage from '../../../assets/clocks/26-02-07/gear.gif'; 

const FullscreenClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Memoize the font name once per mount to prevent style-tag thrashing
  const fontFamily = useMemo(() => {
    const id = Math.random().toString(36).substring(2, 7);
    return `GearFont-${id}`;
  }, []);

  useEffect(() => {
    // 1. Inject @font-face
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

    // 2. Wait for font to actually load
    if ('fonts' in document) {
      document.fonts.load(`1em ${fontFamily}`)
        .then(() => setFontLoaded(true))
        .catch(() => setFontLoaded(true));
    } else {
      setFontLoaded(true);
    }

    // 3. Setup Timer
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 4. Cleanup
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
    // Returns array of characters: ["0", "9", "4", "5", "0", "1", "A", "M"]
    return [...hrStr.split(''), ...minStr.split(''), ...secStr.split(''), ...ampm.split('')];
  };

  const digits = getTimeParts(time);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      backgroundImage: 'radial-gradient(circle, #E9F7AB 0%, #CDF296 100%)',      overflow: 'hidden',
      fontFamily: fontLoaded ? `'${fontFamily}', sans-serif` : 'sans-serif',
      opacity: fontLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in'
    }}>
      {/* Background Image Layer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
           backgroundSize: '90px 90px',
          backgroundPosition: 'center center',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)',
          opacity: 0.3,
          filter: 'brightness(3)  contrast(8.5) saturate(0.2) hue-rotate(183deg)',
          zIndex: 1
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '30px 30px',
          backgroundPosition: 'center center',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)',
          opacity: 0.3,
          zIndex: 2,
       filter: 'brightness(3)  contrast(8.5) saturate(0.2) hue-rotate(183deg)',
       
          zIndex: 0
        }}
      />
 <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '270px 270px',
          backgroundPosition: 'center center',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)',
          opacity: 0.3,
          zIndex: 3,
       filter: 'brightness(3)  contrast(8.5) saturate(0.2) hue-rotate(183deg)',
       
          zIndex: 0
        }}
      />




      {/* Clock Grid */}
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

  /* Your original high-offset shadows restored and fixed */
  text-shadow: 
    15vh 15vh 0px rgb(0, 0, 0),
    -15vh 15vh 0px rgb(0, 0, 0),
    15vh -15vh 0px rgb(0, 0, 0),
    -15vh -15vh 0px rgb(0, 0, 0); 
}
    

            /* Responsive Grid Sizing */
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
  // Using only the index 'i' as the key ensures the 
  // DOM element persists even when 'char' changes.
  <div key={i} className="clock-digit">
    {char}
  </div>
))}

 
      </div>
    </div>
  );
};

export default FullscreenClock;