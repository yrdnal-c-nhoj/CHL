import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React from 'react';

const tile = new URL('../../../../assets/images/26_images/26-07/26-07-06/rodeo-bull.webp', import.meta.url).href;
const fontUrl = 'https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap';
export const assets = [tile]; 
const fontConfigs: FontConfig[] = [{ fontFamily: 'Rubik Dirt', fontUrl }];

const VTEC: React.FC = () => {
  const time = useClockTime('ms');
  useSuspenseFontLoader(fontConfigs);

  const columns = 6;
  const rows = 9;

  const timeParts = {
    h: String(time.getHours()).padStart(2, '0'),
    m: String(time.getMinutes()).padStart(2, '0'),
    s: String(time.getSeconds()).padStart(2, '0'),
    ms: String(time.getMilliseconds()).padStart(3, '0').substring(0, 2),
  };

  // Combine all characters into one unified layout array to prevent separate blocks from fighting for space
  const allCharacters = [
    ...timeParts.h.split(''),
    ':',
    ...timeParts.m.split(''),
    ':',
    ...timeParts.s.split(''),
    '.', // Period separator before milliseconds
    ...timeParts.ms.split(''),
  ];

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Rubik Dirt', monospace",
          zIndex: 10,
          // textShadow: '0 0 20px rgba(0,0,0,0.5)',
          color: '#E0C989',
          gap: '0.1vmin', // Even spacing between all elements
        }}
      >
        {allCharacters.map((char, i) => {
          const isSeparator = char === ':' || char === '.';
          
          return (
            <span
              key={i}
              style={{
                // Every single character is allocated the exact same bounding box size
                width: '6vmin',
                // height: '13vmin',
                fontSize: '9vmin',
                
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                
                // Only apply borders/backgrounds to digits to keep separators clean
                ...(!isSeparator && {
                  // border: '1px solid #555',
             
                }),
              }}
            >
              {char}
            </span>
          );
        })}
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