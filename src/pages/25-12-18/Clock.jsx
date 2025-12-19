import React, { useEffect, useLayoutEffect, useState } from 'react';
// Import the font normally so Vite processes the URL correctly
import dripFontUrl from './drip.ttf'; 
import backgroundImage from './ci.webp';

const TiltedReverseClock = () => {
  const [time, setTime] = useState(new Date());
  const [isFontReady, setIsFontReady] = useState(false);

  useLayoutEffect(() => {
    // 1. Inject the @font-face via a style tag
    if (!document.getElementById('drip-font-style')) {
      const style = document.createElement('style');
      style.id = 'drip-font-style';
      style.textContent = `
        @font-face {
          font-family: 'DripFont';
          src: url('${dripFontUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }

    // 2. Force the browser to "watch" for the font to be ready
    if ('fonts' in document) {
      document.fonts.load(`16vh DripFont`).then(() => {
        setIsFontReady(true);
      });
    } else {
      // Fallback for older browsers
      setIsFontReady(true);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours12 = time.getHours() % 12 || 12;
  const minuteDigits = String(time.getMinutes()).padStart(2, '0');
  const hourDigits = String(hours12);

  const DigitBox = ({ value }) => (
    <div
      style={{
        width: '10vh',
        height: '18vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16vh',
        // Fallback to 'serif' ensures it takes up space if the font fails
        fontFamily: isFontReady ? 'DripFont, serif' : 'serif',
        lineHeight: 1,
        color: '#F0DBB6FF',
        letterSpacing: '-0.1em',
        textShadow: '0 0 5px rgba(249, 222, 176, 0.7)',
        transform: 'rotateX(180deg)',
        filter: 'blur(1px)',
        animation: 'flicker 1s infinite linear',
        // If the font isn't ready, we might want to hide the digits 
        // to prevent a "flash of unstyled text"
        visibility: isFontReady ? 'visible' : 'hidden' 
      }}
    >
      {value}
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100dvh', background: 'black', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.4) contrast(1) saturate(0.7) hue-rotate(30deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '4vh',
          right: '0vh',
          display: 'flex',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: 'perspective(220vh) rotateX(222deg) rotateY(-148deg)',
        }}
      >
        {hourDigits.split('').map((d, i) => <DigitBox key={`h-${i}`} value={d} />)}
        {minuteDigits.split('').map((d, i) => <DigitBox key={`m-${i}`} value={d} />)}
      </div>
    </div>
  );
};

export default TiltedReverseClock;