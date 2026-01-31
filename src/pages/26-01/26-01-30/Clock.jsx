import React, { useState, useEffect } from 'react';

// Explicit Asset Imports
import clockFont from '../../../assets/fonts/26-01-30-ne.ttf';
import bgLayer1 from "../../../assets/clocks/26-01-30/new.webp"; 
import bgLayer2 from "../../../assets/clocks/26-01-30/nes.gif";
import bgLayer3 from "../../../assets/clocks/26-01-30/ne3.gif";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Load font and prevent FOUT
    const font = new FontFace('MyCustomFont', `url(${clockFont}) format('truetype')`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch(() => {
      setFontLoaded(true); // Show fallback if font fails
    });
    
    return () => clearInterval(timer);
  }, []);

  const rawHours = time.getHours();
  const hours = rawHours % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  return (
    <div style={styles.container}>
      {/* Background Layers */}
      <img src={bgLayer1} alt="" style={styles.imageLayer1} />
      <div style={styles.imageLayer2} />
      <img src={bgLayer3} alt="" style={styles.imageLayer3} />

      
      {/* Clock UI */}
      <div style={styles.uiWrapper}>
        <div style={{...styles.timeText, opacity: fontLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out'}}>
          {hours}:{minutes} <span style={styles.ampmText}>{ampm}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: '33.33%',
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'visible', // Changed from 'hidden' to allow shadows to extend
  },
  imageLayer1: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '130%',
    objectFit: 'cover',
    zIndex: 2,
    opacity: 0.5,
    filter: 'contrast(140%) brightness(1.3) hue-rotate(15deg) saturate(170%)',
    pointerEvents: 'none',
  },
  imageLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 3,
    pointerEvents: 'none',
    
    // Tiling logic
    backgroundImage: `url(${bgLayer2})`,
    backgroundRepeat: 'repeat', // This enables the tiling
    backgroundSize: '200px 200px', // Adjust this to control tile size
    animation: 'tileMove 10s linear infinite', // Continuous movement animation
    
    // Your original filters and blending
    opacity: 0.3,
    filter: 'drop-shadow(-100px -100px 0 white) drop-shadow(100px 100px 0 white) drop-shadow(100px -100px 0 white)',
  },

  imageLayer3: {
     position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    zIndex: 5,
    opacity: 0.1,

    filter: 'drop-shadow(5px -5px 0 white)',
    pointerEvents: 'none',
  },

  uiWrapper: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    color: '#EFF2F530',
    textShadow: '0 0 20px rgba(168, 180, 225, 0.99)',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 4,
    alignItems: 'center', // Add this line
  },
  timeText: {
    fontFamily: 'MyCustomFont, sans-serif', 
    fontSize: 'clamp(4rem, 18vw, 12rem)',
    lineHeight: 1,
    fontStyle: 'italic',
    transform: 'skewX(-40deg)',
  },
  ampmText: {
    fontSize: '0.9em',
  }
};

// Add keyframes for the tile movement animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes tileMove {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -200px 200px; // Move down and right by one tile size
    }
  }
`;
document.head.appendChild(styleSheet);

export default DigitalClock;