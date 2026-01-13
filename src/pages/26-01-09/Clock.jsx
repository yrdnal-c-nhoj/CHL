import React, { useState, useEffect } from 'react';

// Explicit module-based imports for the background
import gifOne from '../../assets/clocks/26-01-12/tic.webp';
import gifTwo from '../../assets/clocks/26-01-12/tic2.gif';
import gifThree from '../../assets/clocks/26-01-12/tic3.gif';
import gifFour from '../../assets/clocks/26-01-12/tic4.gif';
import customFont from '../../assets/fonts/26-01-12-tic.ttf';

const BackgroundGrid = ({ children }) => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  useEffect(() => {
    // Preload all background images
    const images = [gifOne, gifTwo, gifThree, gifFour];
    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsBackgroundLoaded(true))
      .catch((err) => {
        console.error('Background image loading failed', err);
        setIsBackgroundLoaded(true); // Show content anyway if images fail
      });
  }, []);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: 0,
    backgroundColor: '#000',
    position: 'fixed', // Fixed to ensure it stays in background
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: isBackgroundLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
  };

  const gridItemStyle = {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover', // Changed to cover for a more seamless grid
    backgroundRepeat: 'no-repeat',
  };

  const gridCells = Array.from({ length: 16 }).map((_, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const imageIndex = (row + col) % 4;
    
    let backgroundImage;
    switch(imageIndex) {
      case 0: backgroundImage = gifOne; break;
      case 1: backgroundImage = gifTwo; break;
      case 2: backgroundImage = gifThree; break;
      case 3: backgroundImage = gifFour; break;
      default: backgroundImage = gifOne;
    }

    return (
      <div
        key={index}
        style={{
          ...gridItemStyle,
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
    );
  });

  return (
    <>
      <div style={containerStyle}>
        {gridCells}
      </div>
      {/* This container sits on top of the grid */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </>
  );
};

export default function TicTacToeClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    // Load custom font
    const font = new FontFace('CustomClockFont', `url(${customFont})`, {
      display: 'swap',
    });

    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setIsFontLoaded(true);
      })
      .catch((err) => {
        console.error('Font loading failed, falling back to sans-serif', err);
        setIsFontLoaded(true);
      });

    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return {
      h1: Math.floor(hours / 10),
      h2: hours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
      ms1: Math.floor((ms % 100) / 10),
      ampm: ampm
    };
  };

  const t = formatTime(time);

  const clockContainerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: mounted ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    fontFamily: 'sans-serif',
    position: 'relative',
    zIndex: 10,
  };

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1px',
    width: 'min(95vw, 95vh)',
    height: 'min(95vw, 95vh)',
    // maxWidth: '500px',
    // maxHeight: '500px',
  };

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Added to center digits vertically
    fontSize: 'clamp(32px, 40vmin,144px)',
    color: '#00ff88',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: isFontLoaded ? 'CustomClockFont, sans-serif' : 'sans-serif',
    };

  // Array of time values to render
  const timeValues = [
    t.h1, t.h2, t.m1,
    t.m2, t.s1, t.s2,
    t.ms1, t.ampm.charAt(0), t.ampm.charAt(1)
  ];

  return (
    <BackgroundGrid>
      <div style={clockContainerStyle}>
        <div style={gridStyle}>
          {timeValues.map((value, index) => (
            <div 
              key={index}
              style={{
                ...cellStyle,
                color: index % 2 === 0 ? '#ff4444' : '#4444ff', // Alternate red and blue
                textShadow: `0 0 10px rgba(${index % 2 === 0 ? '255, 68, 68' : '68, 68, 255'}, 0.5)`
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </BackgroundGrid>
  );
}
