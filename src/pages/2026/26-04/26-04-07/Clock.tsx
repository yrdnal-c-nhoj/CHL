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
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Wall_26-04-07', fontUrl: wallFont }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const time = useClockTime();

  const digits = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    return [...h, ...m];
  }, [time]);

  const clockCountInSet = 4;
  const clockSet = Array.from({ length: clockCountInSet });

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

      <div style={backgroundWrapperStyle} aria-hidden="true">
        <img src={bgImage} style={bgImageStyle} alt="" />
        <img src={bgImage} style={bgImageStyle} alt="" aria-hidden="true" />
      </div>

      <div style={marqueeContainerStyle}>
        <div style={marqueeTrackStyle}>
          {[...clockSet, ...clockSet].map((_, index) => (
            <div key={index} style={clockInstanceStyle}>
              {digits.map((d, i) => (
                <DigitBox key={i} value={d} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
  touchAction: 'none',
};

const backgroundWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  height: '100%',
  minWidth: '200vw',
  willChange: 'transform',
  animation: 'panBackground 30s linear infinite',
};

const bgImageStyle: React.CSSProperties = {
  height: '100%',
  width: 'auto',
  maxWidth: 'none',
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
};

const digitBoxStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '0.5ch',
  textAlign: 'center',
  padding: '0.15em 0.25em',
  margin: '0 0.08em',
  color: '#3d2914',
  opacity: 0.75,
  filter: 'sepia(0.3) contrast(0.95)',
};

export default Clock;