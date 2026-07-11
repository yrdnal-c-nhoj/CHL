import type { FontConfig } from '@/types/clock';
import { formatTime, useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React from 'react';
const tile = new URL('../../../../assets/images/26_images/26-07/26-07-06/rodeo-bull.webp', import.meta.url).href;

const fontUrl = 'https://fonts.gstatic.com/s/rubikdirt/v3/go-5-A1p6-5-9W22_MDHY-g.woff2';
export const assets = [tile, fontUrl];
const fontConfigs: FontConfig[] = [{ fontFamily: 'Rubik Dirt', fontUrl }];

const VTEC: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  return (
    <div
      style={{
        ...vtecStyles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes popIn { from { opacity: 0; scale: 0.5; } to { opacity: 1; scale: 1; } }
      `}</style>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${tile})`,
        backgroundPosition: 'center',
        backgroundSize: '45vh',
        filter: 'saturate(1) contrast(2.2) brightness(0.8)',
      }} />
      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: "'Rubik Dirt', monospace",
          fontSize: '18vmin',
          color: '#eee',
          zIndex: 10,
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >{formatTime(time, '24h')}</time>
    </div>
  );
};

const vtecStyles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    zIndex: 5,
    backgroundPosition: 'center',
    backgroundSize: '15vh',
  },
};

export default VTEC;