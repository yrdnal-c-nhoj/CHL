import React, { useState, useEffect } from 'react';

// 1. Standard imports (Best for performance and reliability)
import mazeFont from '../../../assets/fonts/26-02-18-jelly.otf';
import bg1 from '../../../assets/images/26-02/26-02-18/jel.webp';
import bg3 from '../../../assets/images/26-02/26-02-18/jelly.webp';

const ImageDisplay = () => {
  const [time, setTime] = useState(new Date());

  // Load font via CSS injection to prevent FOUC
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'MazeFont';
        src: url('${mazeFont}') format('opentype');
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const layerStyle = {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    mixBlendMode: 'screen', 
    willChange: 'filter, transform',
    backfaceVisibility: 'hidden',
  };

  // Show content immediately - no loading state

  return (
    <div style={{ 
      width: '100vw', 
      height: '100dvh', 
      backgroundColor: '#000', 
      position: 'relative', 
      overflow: 'hidden', 
      isolation: 'isolate' 
    }}>
      
      {/* Background Layers */}
      <div style={{ 
        ...layerStyle, 
        backgroundImage: `url(${bg1})`, 
        filter: 'brightness(0.85) contrast(1.75) saturate(1.3) hue-rotate(-12deg)',
        zIndex: 2 
      }} />
      
      <div style={{ 
        ...layerStyle, 
        backgroundImage: `url(${bg1})`, 
        transform: 'rotate(180deg) scale(1.05)', 
        opacity: 0.8, 
        zIndex: 3 
      }} />

      <div style={{ 
        ...layerStyle, 
        backgroundImage: `url(${bg3})`, 
        filter: 'brightness(0.9) contrast(1.35) saturate(1.45) hue-rotate(-15deg)', 
        zIndex: 4, 
        opacity: 0.75 
      }} />

      {/* Clock */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        fontFamily: "'MazeFont', sans-serif",
        fontSize: 'clamp(4rem, 15vw, 10rem)',
        color: 'rgba(243, 154, 207, 0.48)',
        textShadow: '0 1px 0px rgba(241, 243, 244, 0.89)',
        textAlign: 'center',
        letterSpacing: '0.2em',
        opacity: 0.5,
        pointerEvents: 'none'
       }}>
        {time.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};

export default ImageDisplay;