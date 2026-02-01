import React, { useState, useEffect } from 'react';
import lemonBg from '../../../assets/clocks/26-01-31/lemon.webp';
import rainBg from '../../../assets/clocks/26-01-31/lu.webp';
import lemGif from '../../../assets/clocks/26-01-31/lem.gif';
import lemonFont from '../../../assets/fonts/26-01-31-lemon.otf';

const containerStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  overflow: 'hidden',
};

// Base style for all background-related layers
const layerBaseStyle = {
  position: 'absolute',
  inset: 0,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  pointerEvents: 'none', // Prevents layers from blocking interactions
};

const gridStyle = {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 30vmin)',
  gridTemplateRows: 'repeat(3, 30vmin)',
  gap: '2.2vmin',
  zIndex: 10, // Sits above all background layers
  opacity: 0.8,
};

const getCellStyle = (index) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8vmin',
    fontFamily: 'LemonFont, monospace',
    color: '#24954A',
    position: 'relative',
    opacity: 0.8,
  };

  // Center cell (index 4) gets rotating background image
  if (index === 4) {
    return {
      ...baseStyle,
    };
  }

  return baseStyle;
};

const getImageStyle = (index) => {
  const baseImageStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${lemGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
    opacity: 0.4,
  };

  // Define rotations for each cell (clockwise from top-left)
  const rotations = [
    0,    // index 0: top-left (remains same)
    45,   // index 1: top-center
    90,   // index 2: top-right
    135,  // index 3: middle-right
    0,    // index 4: center (rotating animation)
    225,  // index 5: middle-left
    270,  // index 6: bottom-left
    315,  // index 7: bottom-center
    0     // index 8: bottom-right (completes the pattern)
  ];

  // Center cell (index 4) gets rotation animation
  if (index === 4) {
    return {
      ...baseImageStyle,
      animation: 'rotateCounterClockwise 15s linear infinite',
    };
  }

  // Apply rotation to outer cells
  return {
    ...baseImageStyle,
    transform: `rotate(${rotations[index]}deg)`,
  };
};

const SimpleBackground = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Clock Ticker (50ms for smooth millisecond updates)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  // Custom Font Loading
  useEffect(() => {
    const font = new FontFace('LemonFont', `url(${lemonFont})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((err) => {
        console.error("Font loading failed:", err);
        setFontLoaded(true);
      });
  }, []);

  const formatTime = () => {
    let h = time.getHours();
    const isPm = h >= 12;
    h = h % 12 || 12;
    
    const hours = h.toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(time.getMilliseconds() / 100).toString();

    // Map time to the 9-cell grid
    return [
      hours[0],   hours[1],   minutes[0],
      minutes[1], seconds[0], seconds[1],
      ms,         isPm ? 'P' : 'A', 'M'
    ];
  };

  const cells = formatTime();

  useEffect(() => {
    // Add CSS animation to the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rotateCounterClockwise {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(-360deg);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={containerStyle}>
      {/* LAYER 1: The Solid Color (Bottom) */}
      <div style={{ 
        ...layerBaseStyle, 
        backgroundColor: '#F6F20D', 
        zIndex: 0,
        // opacity: 0.8
      }} />

      {/* LAYER 2: Rain Image (Middle) */}
     <div style={{ 
    ...layerBaseStyle, 
    backgroundImage: `url(${rainBg})`, 
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%', // Forces the image to stretch to the edges
    backgroundRepeat: 'no-repeat',
    width: '100vw',               // 100% of Viewport Width
    height: '100vh',              // 100% of Viewport Height
    position: 'fixed',            // Keeps it there even if you scroll
    top: 0,
    left: 0,
        zIndex: 3,
        opacity: 0.8
    
      }} />

     <div style={{ 
    ...layerBaseStyle, 
    backgroundImage: `url(${rainBg})`, 
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 4,
    transform: 'scale(-1, -1)', // This performs the double flip
    opacity: 0.8
}} />

      {/* LAYER 3: Lemon Image (Top) */}
      <div style={{ 
        ...layerBaseStyle, 
        backgroundImage: `url(${lemonBg})`, 
         backgroundPosition: 'center center',
        zIndex: 1,
        opacity: 0.8
      }} />

      {/* LAYER 4: The Time Grid */}
      <div style={gridStyle}>
        {cells.map((char, i) => (
          <div key={i} style={getCellStyle(i)}>
            <div style={getImageStyle(i)} />
            <span style={{ position: 'relative', zIndex: 1 }}>{char}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBackground;