import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import fontUrl from '@/assets/fonts/26-04-18-h1.ttf?url';
import bgImg from '@/assets/images/2026/26-04/26-04-18/radio.webp';

export const assets = [bgImg];

const Clock: React.FC = () => {
  const time = useClockTime();

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'H1', fontUrl }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const size = 'min(100vw, 100vh)';
  const cell = `calc(${size} / 2)`;

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8E4D7',
    overflow: 'hidden',
    position: 'relative',
  };

  const bgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'grayscale(100%) brightness(1.1) contrast(1.5)',
    opacity: 0.3,
    zIndex: 0,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(2, calc(${cell} * 0.85))`,
    gridTemplateRows: `repeat(2, ${cell})`,
    position: 'relative',
    zIndex: 2,
  };

  const charWrapper: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.13) 0%, rgba(0,0,0,0) 50%, rgba(255, 0, 255, 0.17) 100%)',
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes radioWave {
          0%, 100% {
            color: #F4F1F1;
            text-shadow: 3px 1px 0 rgba(246, 241, 241, 0.99);
          }
          25% {
            color: #3E4638;
            text-shadow: 1px 0 0 rgb(255, 0, 0);
         }
          50% {
            color: #D0D7D0;
            text-shadow: -1px -2px 0 rgb(255, 242, 3);
          }
          75% {
            color: #6E596E;
            text-shadow: 1px 0 0 rgb(255, 0, 0);
            }
        }
        .radio-digit {
          font-family: 'H1', monospace;
          font-size: calc(${cell} * 1.05);
          line-height: 1;
          font-variant-numeric: tabular-nums;
          user-select: none;
          animation: radioWave 40s ease-in-out infinite;
          letter-spacing: -0.05em;
          transform: translateY(14%);
          opacity: 0.9;
        }
        .radio-digit:nth-child(1) { animation-delay: 0s; }
        .radio-digit:nth-child(2) { animation-delay: 2s; }
        .radio-digit:nth-child(3) { animation-delay: 12s; }
        .radio-digit:nth-child(4) { animation-delay: 28s; }
      `}</style>
      <div style={bgStyle} />
      <div style={overlayStyle} />
      <div style={gridStyle}>
        <div style={charWrapper}><div className="radio-digit">{hours[0]}</div></div>
        <div style={charWrapper}><div className="radio-digit">{hours[1]}</div></div>
        <div style={charWrapper}><div className="radio-digit">{minutes[0]}</div></div>
        <div style={charWrapper}><div className="radio-digit">{minutes[1]}</div></div>
      </div>
    </div>
  );
};

export default Clock;