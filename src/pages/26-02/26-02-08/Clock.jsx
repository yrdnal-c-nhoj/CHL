import React, { useEffect, useState } from 'react';

// Assets
import analogFontUrl from '../../../assets/fonts/26-02-08-eiffel.ttf?url';
import analogBgImage from '../../../assets/clocks/26-02-08/tower.webp';
import eifGif from '../../../assets/clocks/26-02-08/eif.gif';

const STYLE_CONFIG = {
  ironColor: '#8DA3A4', 
  brassColor: '#E8D183', 
  accentColor: '#916567',
  glowColor: 'rgb(255, 253, 208)',
};

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogFontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontReady(true);
    }).catch(() => setFontReady(true));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    fontFamily: fontReady ? "'BorrowedAnalog', serif" : "'Playfair Display', serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Solid base color while image loads
  };

  const backgroundLayerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${analogBgImage})`,
    backgroundSize: 'con',
    backgroundPosition: 'center',
    // Apply filters ONLY here
    filter: 'brightness(0.7) saturate(0.9) contrast(0.9)',
    zIndex: 0,
  };

  const faceContainerStyle = {
    position: 'relative',
    width: '100vmin',
    height: '100vmin',
    zIndex: 1, // Sits above the filtered background
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
  };

  const hourHandStyle = {
    ...handBaseStyle,
    width: '2.5vmin',
    height: '24vmin',
    backgroundColor: STYLE_CONFIG.ironColor,
    clipPath: 'polygon(50% 0%, 100% 20%, 70% 20%, 70% 100%, 30% 100%, 30% 20%, 0% 20%)', 
    transform: `translate(-50%, 0) rotate(${(h / 12) * 360}deg)`,
    border: `0.3vmin solid ${STYLE_CONFIG.brassColor}`,
    filter: 'drop-shadow(0.8vmin 0.8vmin 1vmin rgba(0,0,0,0.6))',
    zIndex: 3,
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    width: '1.5vmin',
    height: '38vmin',
    backgroundColor: STYLE_CONFIG.ironColor,
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
    transform: `translate(-50%, 0) rotate(${(m / 60) * 360}deg)`,
    border: `0.2vmin solid ${STYLE_CONFIG.brassColor}`,
    filter: 'drop-shadow(0.6vmin 0.6vmin 0.8vmin rgba(0,0,0,0.5))',
    zIndex: 7,
  };

  const secondHandStyle = {
    ...handBaseStyle,
    width: '0.6vmin',
    height: '42vmin',
    backgroundColor: STYLE_CONFIG.accentColor,
    transform: `translate(-50%, 0) rotate(${(s / 60) * 360}deg)`,
    // Prevent backward spin on reset (59 -> 0)
    transition: s === 0 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 2.3, 0.6, 1)',
    filter: 'drop-shadow(0.4vmin 0.4vmin 0.5vmin rgba(0,0,0,0.4))',
    zIndex: 4,
  };

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5vmin',
    height: '5vmin',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${STYLE_CONFIG.brassColor} 0%, #8B6B0E 100%)`,
    border: `0.8vmin solid ${STYLE_CONFIG.ironColor}`,
    zIndex: 8,
    boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.6)',
  };

  const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

  const renderNumerals = () => {
    const radiusPercent = 38;
    return romanNumerals.map((num, i) => {
      const angle = (i / 12) * 2 * Math.PI;
      const x = 50 + radiusPercent * Math.sin(angle);
      const y = 50 - radiusPercent * Math.cos(angle);
      const rotation = (i / 12) * 360;
      return (
        <div
          key={num}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            color: STYLE_CONFIG.brassColor,
            fontSize: '9vmin',
            textShadow: `2px 2px 0px ${STYLE_CONFIG.ironColor}, 0 0 15px ${STYLE_CONFIG.glowColor}`,
            letterSpacing: '-0.2vmin',
            pointerEvents: 'none',
          }}
        >
          {num}
        </div>
      );
    });
  };

  return (
    <div style={containerStyle}>
      {/* Background layer with filter - independent of clock */}
      <div style={backgroundLayerStyle} />
      
      {/* Second background image layer - eif.gif as tiling image on top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${eifGif})`,
        backgroundSize: '50px 100px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        opacity: 0.5,
    filter: 'brightness(1.7) hue-rotate(180deg) contrast(1.9) drop-shadow(0.4vmin 0.4vmin 0.5vmin rgba(0,0,0,0.4))',

        zIndex: 1, // Between background (0) and clock face (1)
      }} />
       
      {/* Clock Face Layer */}
      <div style={faceContainerStyle}>
        {renderNumerals()}
        <div style={hourHandStyle} />
        <div style={minuteHandStyle} />
        <div style={secondHandStyle} />
        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;