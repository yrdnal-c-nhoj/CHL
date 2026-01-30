import React, { useState, useEffect } from 'react';

// Explicit Asset Imports
import clockFont from '../../../assets/fonts/26-01-30-ne.ttf';
import bgLayer1 from "../../../assets/clocks/26-01-30/new.gif"; 
import bgLayer2 from "../../../assets/clocks/26-01-30/ne.gif";

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
      <img src={bgLayer2} alt="" style={styles.imageLayer2} />
      
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
    overflow: 'hidden',
  },
  imageLayer1: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '130%',
    objectFit: 'cover',
    opacity: 0.7,
    zIndex: 3,
    filter: 'contrast(180%) brightness(1.1) hue-rotate(12deg) saturate(50%)',
    pointerEvents: 'none',
  },
  imageLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.9,
    zIndex: 2,
    filter: 'contrast(370%) brightness(1.1) hue-rotate(45deg) saturate(20%)',
    pointerEvents: 'none',
  },
 uiWrapper: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    color: '#EFF2F5B3',
    textShadow: '0 0 20px rgba(168, 180, 225, 0.99)',
    display: 'flex',
    justifyContent: 'center',
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

export default DigitalClock;