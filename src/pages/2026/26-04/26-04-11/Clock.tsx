import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import eyesFont from '@/assets/fonts/26-04-12-eyes.ttf';
import bgImage from '@/assets/images/2026/26-04/26-04-12/eyes.webp';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const digitToLetter = (digit: string): string => {
  const map: Record<string, string> = {
    '0': 'W', '1': 'A', '2': 'Z', '3': 'E', '4': 'J',
    '5': 'B', '6': 'P', '7': 'M', '8': 'T', '9': 'R',
  };
  return map[digit] || digit;
};

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Eyes', fontUrl: eyesFont }
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return {
      hours: h.split('').map(digitToLetter),
      minutes: m.split('').map(digitToLetter),
      seconds: s.split('').map(digitToLetter),
    };
  }, [time]);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#000', // Fallback
  };

  const bgOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    filter: 'contrast(0.3) brightness(1.2)',
    zIndex: 0,
  };

  const digitStyle: React.CSSProperties = {
    color: '#F81D3E',
    lineHeight: 1,
    fontFamily: 'Eyes, monospace',
    textShadow: '2px 0 0 black, -2px 0 0 white',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={bgOverlayStyle} />
      <style>{`
        .clock-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          width: 100%;
          height: 100%;
          // padding: 1rem;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .digit-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        /* Mobile: Large, filling the screen */
        .digit-box span {
          font-size: 25vh;
        }

        /* Laptop/Desktop: Scaled down significantly */
        @media (min-width: 824px) {
          .clock-grid {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .digit-box {
            width: 16vw;
            height: 25vw;
            flex: 0 0 auto;
          }
          .digit-box span {
            /* Lowering this value makes it smaller on laptop */
            font-size: 20vw; 
          }
        }
      `}</style>
      <div className="clock-grid">
        <div className="digit-box"><span style={digitStyle}>{hours[0]}</span></div>
        <div className="digit-box"><span style={digitStyle}>{hours[1]}</span></div>
        <div className="digit-box"><span style={digitStyle}>{minutes[0]}</span></div>
        <div className="digit-box"><span style={digitStyle}>{minutes[1]}</span></div>
        <div className="digit-box"><span style={digitStyle}>{seconds[0]}</span></div>
        <div className="digit-box"><span style={digitStyle}>{seconds[1]}</span></div>
      </div>
    </div>
  );
};

export default Clock;