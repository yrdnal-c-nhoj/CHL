import backgroundImageURL from "../../assets/clocks/26-01-08/pyr.webp";
import gizaFont from "../../assets/fonts/26-01-05-giza.otf";
import { useState, useEffect } from 'react';

// Global font injection
const fontStyles = `
  @font-face {
    font-family: 'Giza';
    src: url(${gizaFont}) format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

try {
  const style = document.createElement('style');
  style.textContent = fontStyles;
  document.head.appendChild(style);
} catch (error) {
  console.error('Error adding font styles:', error);
}

const PyramidzBackground = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    setFontLoaded(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      });
      const formattedTime = time
        .replace(/^0/, '')
        .replace(/\s+/g, ''); 
      setTimeString(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundImage: `url('${backgroundImageURL}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div className="marquee-wrapper">
          <div className="marquee-group">
            {timeString.repeat(10)}
          </div>
          <div className="marquee-group">
            {timeString.repeat(10)}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .marquee-wrapper {
          display: flex;
          width: fit-content;
          animation: marquee 1000s linear infinite;
          margin-top: -18vh;
        }
        .marquee-group {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          white-space: nowrap;
          color: #6F696957;
          font-family: ${fontLoaded ? '"Giza"' : '"system-ui"'}, -apple-system, sans-serif;
          font-size: 130vh;
          letter-spacing: -3vh; 
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default PyramidzBackground;