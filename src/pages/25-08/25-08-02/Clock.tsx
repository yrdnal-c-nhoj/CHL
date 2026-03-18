import { useState, useEffect, useRef } from 'react';
import { useMultiAssetLoader } from '../../../utils/assetLoader';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import myFontWoff2 from '../../../assets/fonts/25-08-02-hea.ttf';
import bg2 from '../../../assets/images/25-08/25-08-02/em.webp';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentId = useRef(`digital-clock-${Date.now()}`);

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'hea',
      fontUrl: myFontWoff2,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  // Update fontLoaded state when fontsLoaded changes
  useEffect(() => {
    setFontLoaded(fontsLoaded);
  }, [fontsLoaded]);

  // Font loading handled by useMultipleFontLoader

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
    position: 'absolute',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity,
    zIndex,
    pointerEvents: 'none',
    filter: bgFilter,
    ...custom,
  });

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 10,
    fontFamily: fontLoaded ? "'hea', monospace" : 'monospace',
    fontSize: '0.5rem',
    color: '#CFEAEA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    opacity: fontLoaded ? 1 : 0,
    visibility: fontLoaded ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease',
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
