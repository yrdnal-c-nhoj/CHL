import React, { useEffect, useState } from 'react';

// Assets
import analogMirageFont from '../../../assets/fonts/25-09-10-lava.otf?url';
import analogBgImage from '../../../assets/clocks/26-01-25/mirage.webp';
import { materialOpacity } from 'three/tsl';

const STYLE_CONFIG = {
  tickColor: '#EA81E0FF',
  faceOverlayColor: 'rgba(0, 0, 0, 0.25)',
};

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load custom font (kept in case you add other text elements later)
  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogMirageFont})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
  }, []);

  // Time ticker
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundImage: `url(${analogBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: fontReady ? "'BorrowedAnalog', system-ui, sans-serif" : 'system-ui, sans-serif',
  };

  const faceOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: STYLE_CONFIG.faceOverlayColor,
  };

  const faceContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95vmin',
    height: '95vmin',
    borderRadius: '50%',
    overflow: 'hidden',
  };

const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '999px',
    // Applying global opacity to all hands here, or individually below
    opacity: 0.1, 
  };

  const hourHandStyle = {
    ...handBaseStyle,
    width: '1.2vmin',
    height: '25vmin',
    background: 'linear-gradient(to top, #888787, #ffffff, #FCF8F8EE)',
    transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
    boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.5)',
    zIndex: 2,
    // opacity: 0.3, // You can also place it here
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    width: '0.8vmin',
    height: '35vmin',
    background: 'linear-gradient(to top, #ADADAD, #ffffff, #F8F5F5E4)',
    transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
    boxShadow: '0 0.2rem 0.4rem rgba(0,0,0,0.4)',
    zIndex: 3,
    // opacity: 0.3, // Ensure this is set to 0.3
  };

  return (
    <div style={containerStyle}>
      <div style={faceOverlayStyle} />
      <div style={faceContainerStyle}>
        <div style={hourHandStyle} />
        <div style={minuteHandStyle} />
      
      </div>
    </div>
  );
};

export default AnalogClockTemplate;