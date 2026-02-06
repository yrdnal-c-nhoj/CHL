import React, { useState, useEffect, useMemo } from 'react';
// Module-based asset import for Vite fingerprinting
import customFontUrl from '../../../assets/fonts/pin.ttf'; 

const CarouselClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Generate unique font family name: YYYYMMDD-xxxxx
  const fontFamily = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7);
    return `Font-${date}-${random}`;
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
      @keyframes carousel-rotate {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
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
      document.getElementById(styleId)?.remove();
    };
  }, [fontFamily]);

  const getTimeParts = () => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return [
      String(hours).padStart(2, '0'),
      String(time.getMinutes()).padStart(2, '0'),
      String(time.getSeconds()).padStart(2, '0'),
      ampm
    ];
  };

  const parts = getTimeParts();

  // Component Styles
  const stageStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    overflow: 'hidden',
    perspective: '1200px', // Creates the 3D depth
    fontFamily: fontLoaded ? `'${fontFamily}', sans-serif` : 'sans-serif',
    opacity: fontLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease'
  };

  const carouselContainer = {
    width: 'min(40vw, 300px)',
    height: 'min(40vw, 300px)',
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'carousel-rotate 12s linear infinite',
  };

  const getFaceStyle = (index) => {
    // 4 parts = 90 degree increments
    const angle = index * 90; 
    // translateZ determines the radius of the "merry-go-round"
    const radius = 'min(35vw, 250px)'; 
    
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 'clamp(2rem, 53vw, 22rem)',
      color: '#28D1AF',
    //  border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      backfaceVisibility: 'visible',
      transform: `rotateY(${angle}deg) translateZ(${radius})`,
    };
  };

  return (
    <div style={stageStyle}>
      <div style={carouselContainer}>
        {parts.map((val, i) => (
          <div key={i} style={getFaceStyle(i)}>
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselClock;