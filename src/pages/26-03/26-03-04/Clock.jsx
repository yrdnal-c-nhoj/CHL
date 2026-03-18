import React, { useState, useEffect } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import sunFont from '../../../assets/fonts/26-03-04-sun.ttf';
import sunBg from '../../../assets/images/26-03/26-03-04/sun-40.gif';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  );
  const [fontLoaded, setFontLoaded] = useState(false);

  const digitLetters = {
    0: 'c',
    1: 't',
    2: 'N',
    3: 'W',
    4: 'V',
    5: 'U',
    6: 'D',
    7: 'X',
    8: 'J',
    9: 'g',
  };

  useEffect(() => {
    // 1. Load Custom Font via FontFace API
    const font = new FontFace('SunFont', `url(${sunFont})`);

    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((err) => {
        console.error('Font failed to load', err);
        // Set to true anyway so the clock eventually shows in a fallback font
        setFontLoaded(true);
      });

    // 2. Timer Interval
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 3. Resize Listener
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // 4. Global Styles Cleanup
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#0C0B00';

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const digits = time.toTimeString().split(' ')[0].replace(/:/g, '').split('');

  // Layout Constants
  const boxWidth = isMobile ? '48vw' : '16vw';
  const boxHeight = isMobile ? '25vh' : '40vh';

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${sunBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(2.7) brightness(3.5) contrast(0.4)',
    transform: 'rotate(180deg)',
    zIndex: -1,
  };

  const containerStyle = {
    minHeight: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: fontLoaded ? 1 : 0, // Hide until font is ready
    transition: 'opacity 0.5s ease-in-out',
  };

  const clockGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? `repeat(2, ${boxWidth})`
      : `repeat(6, ${boxWidth})`,
    justifyContent: 'center',
    alignContent: 'center',
    gap: isMobile ? '10px' : '0',
  };

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: boxWidth,
    height: boxHeight,
    fontFamily: "'SunFont', monospace",
    fontSize: isMobile ? '22vh' : '15vw',
    color: '#051160',
    lineHeight: 1,
    textAlign: 'center',
    textShadow: '-1px 0 0 #ffffff',
    overflow: 'hidden',
  };

  return (
    <>
      <div style={backgroundStyle} />
      <div style={containerStyle}>
        <div style={clockGridStyle}>
          {digits.map((digit, index) => (
            <div key={index} style={digitBoxStyle}>
              {digitLetters[digit] || digit}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Clock;
