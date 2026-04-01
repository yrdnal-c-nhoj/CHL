import React, { useState, useEffect } from 'react';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/useSmoothClock';
import sunFont from '@/assets/fonts/2026/26-03-04-sun.ttf';
import sunBg from '@/assets/images/2026/26-03/26-03-04/sun.webp';

const Clock: React.FC = () => {
  const fontConfigs = [
    {
      fontFamily: 'SunFont',
      fontUrl: sunFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const time = useSecondClock();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  );
  const [fontLoaded, setFontLoaded] = useState<boolean>(fontsLoaded);

  useEffect(() => {
    setFontLoaded(fontsLoaded);
  }, [fontsLoaded]);

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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#0C0B00';

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const digits = time.toTimeString().split(' ')[0].replace(/:/g, '').split('');

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
