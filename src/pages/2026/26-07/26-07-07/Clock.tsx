import type { FontConfig } from '@/types/clock';
import { formatTime, useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React from 'react';

const tile = new URL('../../../../assets/images/26_images/26-07/26-07-06/rodeo-bull.webp', import.meta.url).href;
// Using the public Google Fonts web font URL fallback
const fontUrl = 'https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap';
export const assets = [tile]; 
const fontConfigs: FontConfig[] = [{ fontFamily: 'Rubik Dirt', fontUrl }];

const VTEC: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const columns = 6;
  const rows = 4;

  return (
    <div
      style={{
        ...vtecStyles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Import Rubik Dirt straight into the component's scope */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap');
        @keyframes popIn { from { opacity: 0; scale: 0.5; } to { opacity: 1; scale: 1; } }
      `}</style>
      
      {/* Checkerboard Grid Container */}
      <div style={{
        position: 'absolute',
        inset: '-10vh',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        filter: 'saturate(1) contrast(2.2) brightness(0.8)',
      }}>
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, colIndex) => {
            const isFlipped = (rowIndex + colIndex) % 2 !== 0;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  backgroundImage: `url(${tile})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  transform: isFlipped ? 'scaleX(-1)' : 'none',
                }}
              />
            );
          })
        )}
      </div>

      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: "'Rubik Dirt', system-ui, sans-serif",
          fontSize: '18vmin',
          color: '#eee',
          zIndex: 10,
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {formatTime(time, '24h')}
      </time>
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
    backgroundColor: '#000',
  },
};

export default VTEC;