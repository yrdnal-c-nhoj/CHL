import { useState, useEffect } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import myFontWoff2 from '../../../assets/fonts/25-08-02-hea.ttf';
import bg2 from '../../../assets/images/25-08/25-08-02/em.webp';
import bg1 from '../../../assets/images/25-08/25-08-02/la.gif';
import bg3 from '../../../assets/images/25-08/25-08-02/la.gif'; // copy of bg1 for flipping

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const fontReady = useFontLoader('MyCustomFont', myFontWoff2, { fallback: true, timeout: 3500 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const bgFilter = 'brightness(1.5) contrast(3.2)';

  const fullScreenBackgroundStyle = (image, opacity, zIndex, custom = {}) => ({
    position: 'fixed',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    opacity,
    zIndex,
    pointerEvents: 'none',
    filter: bgFilter,
    ...custom,
  });

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 10,
    fontFamily: fontReady ? 'MyCustomFont, monospace' : 'monospace',
    fontSize: '0.5rem',
    color: '#CFEAEA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    opacity: fontReady ? 1 : 0,
    visibility: fontReady ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease'
  };

  return (
    <>
      {/* Full-Screen Background Layer for bg2, stretched with distortion */}
      <div
        style={fullScreenBackgroundStyle(bg2, 1, 2, {
          backgroundSize: '100% 100%',
        })}
      />

 
      {/* Clock Display */}
      <div style={clockContainerStyle}>{formatTime(time)}</div>
    </>
  );
};

export default DigitalClock;
