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
      backgroundColor: '#5669C8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${digitalBgImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        filter: 'contrast(1.5) saturate(2.5)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      <div style={{
        fontFamily: `"${FONT_NAME}", monospace`,
        display: 'flex',
        alignItems: 'center',
        zIndex: 10
      }}>
        {timeString.split('').map((digit, index) => {
          const digitIndex = timeString.length - index - 1; // Reverse index for progressive sizing
          const fontSize = 40 + (digitIndex * -4.5); // Each digit larger than the next, more dramatic difference
          const opacity = 1.0 - (digitIndex * 0.15); // More dramatic opacity drop
          
          return (
            <span
              key={index}
              style={{
                fontSize: `${fontSize}vmin`,
                opacity: fontLoaded ? Math.max(opacity, 0.3) : 0, // Minimum opacity of 0.3
                transition: 'opacity 0.3s ease-in',
                color: '#D0D6F2',
                textShadow: '0 0 15px rgba(10, 63, 240, 0.4)',
                letterSpacing: '-0.1em', // Negative letter spacing to bring digits closer
                display: 'inline-block',
                marginLeft: index > 0 ? '-0.2em' : '0' // Additional negative margin between digits
              }}
            >
              {digit}
            </span>
          );
        })}
      </div>

      <style>{`body { margin: 0; background: black; }`}</style>
    </div>
  );
};

export default SonicBoomClock;