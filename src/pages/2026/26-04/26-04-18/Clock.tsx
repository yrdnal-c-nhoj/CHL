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
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    filter: 'grayscale(100%) brightness(1.3)',
    backgroundPosition: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(2, ${cell})`,
    gridTemplateRows: `repeat(2, ${cell})`,
  };

  const charWrapper: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const charStyle: React.CSSProperties = {
    fontFamily: "'H1', monospace",
    color: '#f222ff',
    fontSize: `calc(${cell} * 1.05)`, // 🔥 push near max
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    transform: 'translateY(14%)',
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <div style={charWrapper}><div style={charStyle}>{hours[0]}</div></div>
        <div style={charWrapper}><div style={charStyle}>{hours[1]}</div></div>
        <div style={charWrapper}><div style={charStyle}>{minutes[0]}</div></div>
        <div style={charWrapper}><div style={charStyle}>{minutes[1]}</div></div>
      </div>
    </div>
  );
};

export default Clock;