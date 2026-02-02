import React, { useEffect, useState } from 'react';
import digitalBgImage from '../../../assets/clocks/26-02-01/boom.webp';

// Try the explicit 400 weight import if index.css fails
import "@fontsource/share-tech-mono/400.css";

const FONT_NAME = 'Share Tech Mono';

const SonicBoomClock = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1. Update time
    const interval = setInterval(() => setTime(new Date()), 100);
    
    // 2. Track font loading specifically for this family
    document.fonts.load(`1em "${FONT_NAME}"`).then(() => {
      setFontLoaded(true);
    });

    return () => clearInterval(interval);
  }, []);

  const timeString = time.getHours().toString().padStart(2, '0') +
                     time.getMinutes().toString().padStart(2, '0') +
                     time.getSeconds().toString().padStart(2, '0') +
                     Math.floor(time.getMilliseconds() / 100).toString();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#7390C7',
      backgroundImage: `url(${digitalBgImage})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'hue-rotate(10deg) saturate(3.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        // APPLY FONT IMMEDIATELY - fallback to monospace while loading
        fontFamily: `"${FONT_NAME}", monospace`,
        fontSize: '14vmin',
        color: '#D0D6F2',
        // Text is invisible until font is ready to prevent "jump"
        opacity: fontLoaded ? 0.8 : 0, 
        transition: 'opacity 0.3s ease-in',
        textShadow: '0 0 15px rgba(138, 165, 255, 0.4)',
        letterSpacing: '0.05em',
        zIndex: 10
      }}>
        {timeString}
      </div>

      <style>{`body { margin: 0; background: black; }`}</style>
    </div>
  );
};

export default SonicBoomClock;