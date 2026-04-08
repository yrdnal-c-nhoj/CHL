import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2026/26-04/26-04-07/wall.webp';
import wallFont from '@/assets/fonts/26-04-07-wall.ttf';

const formatDigit = (num: number) => num.toString().padStart(2, '0');

const DigitBox: React.FC<{ value: string }> = ({ value }) => (
  <span style={digitBoxStyle}>{value}</span>
);

const Clock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Wall_26-04-07', fontUrl: wallFont }],
    []
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  // Better digit extraction
  const displayTime = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    return [...h, ...m];
  }, [time]);

  const clockCountInSet = 4;

  return (
    <div style={containerStyle} role="img" aria-label={`Current time: ${time.getHours()}:${formatDigit(time.getMinutes())}`}>
      <style>{`
        @keyframes panBackground {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Background */}
      <div style={backgroundWrapperStyle} aria-hidden="true">
        <img src={bgImage} style={bgImageStyle} alt="" />
        <img src={bgImage} style={bgImageStyle} alt="" />
      </div>

      {/* Marquee */}
      <div style={marqueeContainerStyle}>
        <div style={marqueeTrackStyle}>
          {Array.from({ length: clockCountInSet * 2 }).map((_, index) => (
            <div key={index} style={clockInstanceStyle}>
              {displayTime.map((digit, i) => (
                <DigitBox key={i} value={digit} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
  touchAction: 'none',
  userSelect: 'none',
};

const backgroundWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  minWidth: '200vw',
  willChange: 'transform',
  animation: 'panBackground 30s linear infinite',
};

const bgImageStyle: React.CSSProperties = {
  height: '100%',
  width: 'auto',
  flexShrink: 0,
  objectFit: 'cover',
};

const marqueeContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10%',
  left: 0,
  width: '100%',
  zIndex: 2,
  pointerEvents: 'none',
  overflow: 'hidden',
};

const marqueeTrackStyle: React.CSSProperties = {
  display: 'flex',
  width: 'fit-content',
  minWidth: '200vw',
  willChange: 'transform',
  animation: 'marquee 120s linear infinite',
};

const clockInstanceStyle: React.CSSProperties = {
  display: 'flex',
  fontFamily: 'Wall_26-04-07, monospace',
  fontSize: 'clamp(3rem, 12vw, 7rem)',
  color: '#fff',
  paddingRight: '5vw',
  whiteSpace: 'nowrap',
};

const digitBoxStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '0.6ch',           // slightly wider for better spacing
  textAlign: 'center',
  padding: '0.1em 0.2em',
  margin: '0 0.1em',
  color: '#3d2914',
  opacity: 0.75,
  filter: 'sepia(0.3) contrast(0.95)',
  textShadow: '0 0 8px rgba(0,0,0,0.6)', // added depth
};

export default Clock;