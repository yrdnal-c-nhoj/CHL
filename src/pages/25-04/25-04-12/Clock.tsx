import React, { useEffect, useState, useRef } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import angFont from '../../../assets/fonts/25-04-12-ang.ttf';

const digitFontSizes = {
  0: '51vh',
  1: '46vh',
  2: '21vh',
  3: '18vh',
  4: '20vh',
  5: '19vh',
  6: '16vh',
  7: '21vh',
  8: '17vh',
  9: '20vh',
};

const mediaQueryFontSizes = {
  0: '33vh',
  1: '29vh',
  2: '26vh',
  3: '23vh',
  4: '25vh',
  5: '24vh',
  6: '21vh',
  7: '26vh',
  8: '22vh',
  9: '25vh',
};

const AngFontClock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'AngFontClockFont',
      fontUrl: angFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [timeStr, setTimeStr] = useState<any>(['', '', '']);
  const [prevDigits, setPrevDigits] = useState<any>(['', '', '']);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(fontsLoaded);
  const componentId = useRef(`angfont-clock-${Date.now()}`);
  const animationTimeouts = useRef([]);

  // Update fontLoaded state when fontsLoaded changes
  useEffect(() => {
    setFontLoaded(fontsLoaded);
  }, [fontsLoaded]);

  // Font loading handled by useMultipleFontLoader

  useEffect(() => {
    const updateTime: React.FC = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      hours = hours % 12 || 12; // 12-hour format, no leading zero

      const h = hours.toString(); // no padStart
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');

      setTimeStr([h, m, s]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 600);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];

    animationTimeouts.current.push(
      setTimeout(() => {
        setPrevDigits(timeStr);
      }, 300),
    );

    return () => animationTimeouts.current.forEach(clearTimeout);
  }, [timeStr]);

  const getFontSize = (digit) => {
    const n = parseInt(digit, 10);
    return isSmallScreen
      ? mediaQueryFontSizes[n] || '19vh'
      : digitFontSizes[n] || '19vh';
  };

  const bodyStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100dvh',
    width: '100vw',
    margin: 0,
    backgroundColor: '#ff00ff',
    fontFamily: fontLoaded ? 'AngFontClockFont, system-ui' : 'system-ui',
    fontStyle: 'normal',
  };

  const clockStyle = {
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: 'center',
  };

  const timeUnitStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const digitBoxStyle = {
    width: isSmallScreen ? '15vw' : '13vh',
    height: isSmallScreen ? '18vh' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const renderDigits = (str, unitIndex) =>
    str.split('').map((char, i) => {
      const animate =
        prevDigits[unitIndex] && prevDigits[unitIndex][i] !== str[i];

      return (
        <div key={`${unitIndex}-${i}`} style={digitBoxStyle}>
          <span
            style={{
              position: 'absolute',
              color: '#EDBFEAFF',
              textShadow:
                '4rem 0rem #E71BCBFF, 15px -15px #DF54CAFF, -4rem 0rem #ED0EC4FF, -6px 15px #CB26ADFF',
              fontSize: getFontSize(char),
              animation: animate ? 'fadeInOut 0.3s ease-in-out' : undefined,
              transformOrigin: 'center',
              display: 'inline-block',
            }}
          >
            {char}
          </span>
        </div>
      );
    });

  return (
    <div style={bodyStyle}>
      <div style={clockStyle}>
        <div style={timeUnitStyle}>{renderDigits(timeStr[0], 0)}</div>
        <div style={timeUnitStyle}>{renderDigits(timeStr[1], 1)}</div>
        <div style={timeUnitStyle}>{renderDigits(timeStr[2], 2)}</div>
      </div>

      <style>
        {`
        @font-face {
          font-family: 'AngFontClockFont';
          src: url(${angFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}
      </style>
    </div>
  );
};

export default AngFontClock;
