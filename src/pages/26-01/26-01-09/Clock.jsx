import React, { useState, useEffect, useCallback } from 'react';

// Explicit module-based imports for the background
import gifOne from '../../../assets/clocks/26-01-12/tic.webp';
import gifTwo from '../../../assets/clocks/26-01-12/tic2.gif';
import gifThree from '../../../assets/clocks/26-01-12/tic3.gif';
import gifFour from '../../../assets/clocks/26-01-12/tic4.gif';
import customFont from '../../../assets/fonts/26-01-12-tic.ttf';

const BackgroundGrid = ({ children, isFontLoaded }) => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
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

    let mounted = true;

    const fontPromise = new Promise(resolve => {
      if (document.fonts.check('1px CustomClockFont') || !isFontLoaded) {
        resolve();
      } else {
        const checkFont = () => {
          if (document.fonts.check('1px CustomClockFont')) {
            resolve();
            document.fonts.removeEventListener('loadingdone', checkFont);
          }
        };
        document.fonts.addEventListener('loadingdone', checkFont);
      }
    }).then(() => mounted && setFontReady(true));

    Promise.all([fontPromise, ...imagePromises])
      .then(() => {
        if (mounted) setIsBackgroundLoaded(true);
      })
      .catch((err) => {
        console.error('Resource loading failed', err);
        if (mounted) setIsBackgroundLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [isFontLoaded]);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: 0,
    backgroundColor: '#000',
    zIndex: 1,
    opacity: isBackgroundLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
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

  // Add viewport meta tag for mobile responsiveness
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no';
        document.head.appendChild(meta);
      }
    }
  }, []);

  return (
    <>
      <div style={containerStyle}>
        {gridCells}
      </div>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: isBackgroundLoaded && fontReady ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        {children}
      </div>
    </>
  );
};

export default function TicTacToeClock() {
  const [time, setTime] = useState(() => new Date());
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Memoize the time formatter to prevent unnecessary recalculations
  const formatTime = useCallback((date) => {
    const hours = date.getHours();
    const minutes = date.getHours();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return {
      h1: Math.floor(displayHours / 10),
      h2: displayHours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
      ms1: Math.floor((ms % 100) / 10),
      ampm: ampm
    };
  }, []);

  const [displayTime, setDisplayTime] = useState(() => formatTime(new Date()));

  // Load font and set up animation frame
  useEffect(() => {
    setIsClient(true);
    
    const loadFont = async () => {
      try {
        const font = new FontFace('CustomClockFont', `url(${customFont})`, {
          display: 'swap',
        });
        
        await font.load();
        document.fonts.add(font);
        setIsFontLoaded(true);
      } catch (err) {
        console.error('Font loading failed, falling back to system font', err);
        setIsFontLoaded(true);
      }
    };
    
    loadFont();

    // Use requestAnimationFrame for smoother updates
    let animationFrameId;
    let lastUpdate = 0;
    
    const updateTime = (timestamp) => {
      if (!lastUpdate || timestamp - lastUpdate >= 16) { // ~60fps
        setTime(new Date());
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    animationFrameId = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // Update display time when time changes
  useEffect(() => {
    setDisplayTime(formatTime(time));
  }, [time, formatTime]);


  const clockContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: isClient ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    fontFamily: isFontLoaded ? 'CustomClockFont, monospace' : 'monospace',
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1px',
    width: '90vmin',
    height: '90vmin',
    maxWidth: '500px',
    maxHeight: '500px',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
  };

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(24px, 25vmin, 120px)',
    color: '#00ff88',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    textAlign: 'center',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  // Memoize time values array to prevent unnecessary re-renders
  const timeValues = React.useMemo(() => [
    displayTime.h1, displayTime.h2, displayTime.m1,
    displayTime.m2, displayTime.s1, displayTime.s2,
    displayTime.ms1, displayTime.ampm.charAt(0), displayTime.ampm.charAt(1)
  ], [displayTime]);

  // Only render on the client to prevent hydration mismatches
  if (!isClient) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        backgroundColor: '#000',
        position: 'relative',
        zIndex: 1
      }} />
    );
  }

  return (
    <BackgroundGrid isFontLoaded={isFontLoaded}>
      <div style={clockContainerStyle}>
        <div style={gridStyle}>
          {timeValues.map((value, index) => {
            const isEven = index % 2 === 0;
            const color = isEven ? '#ff4444' : '#4444ff';
            const shadowColor = isEven ? '255, 68, 68' : '68, 68, 255';
            
            return (
              <div 
                key={index}
                style={{
                  ...cellStyle,
                  color,
                  textShadow: `0 0 10px rgba(${shadowColor}, 0.5)`,
                  willChange: 'transform',
                  transform: 'translateZ(0)' // Promote to own layer for better performance
                }}
                aria-hidden="true"
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
    </BackgroundGrid>
  );
}
