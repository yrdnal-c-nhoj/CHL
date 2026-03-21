import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import angFont from '../../../assets/fonts/25-04-12-ang.ttf?url';

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

// Digit font size interfaces
interface DigitFontSizes {
  [key: number]: string;
}

// Component Props interface
interface AngFontClockProps {
  // No props required for this component
}

const AngFontClock = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'AngFontClockFont',
      fontUrl: angFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const componentId = useRef(`angfont-clock-${Date.now()}`);
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  const [timeStr, setTimeStr] = useState<string[]>(['', '', '']);
  const [prevDigits, setPrevDigits] = useState<string[]>(['', '', '']);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const updateTime = useCallback((): void => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    hours = hours % 12 || 12; // 12-hour format, no leading zero

    const h = hours.toString(); // no padStart
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    setTimeStr([h, m, s]);
  }, [currentTime]);

  useEffect(() => {
    updateTime();
  }, [updateTime]);

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

  const getFontSize = useCallback((digit: string): string => {
    const n = parseInt(digit, 10);
    return isSmallScreen
      ? mediaQueryFontSizes[n] || '19vh'
      : digitFontSizes[n] || '19vh';
  }, [isSmallScreen]);

  const bodyStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100dvh',
    width: '100vw',
    margin: 0,
    backgroundColor: '#ff00ff',
    fontFamily: 'AngFontClockFont, system-ui',
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
