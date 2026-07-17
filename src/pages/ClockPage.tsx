import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-11.otf?url';
import tileImage from '@/assets/images/26_images/26-07/26-07-11/b.webp';
import backgroundImage from '@/assets/images/26_images/26-07/26-07-11/door.webp';

export const assets = [backgroundImage, tileImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_11',
    fontUrl,
  },
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    fontFamily: '"Share Tech Mono", monospace',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000', // fallback
  },

  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  tileOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 'calc(100% + 600px)',
    backgroundImage: `url(${tileImage})`,
    backgroundSize: '50px',
    backgroundRepeat: 'repeat',
    opacity: 0.4,
    animation: 'tilingRise 60s linear infinite',
    willChange: 'transform',
    imageRendering: 'pixelated',
    backfaceVisibility: 'hidden',
  },

  digitalClock: {
    display: 'flex',
    color: 'white',
    fontSize: 'clamp(2rem, 22vmin, 12rem)',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgb(0, 128, 255)',
    fontFamily: 'ClockFont_26_07_11, "Share Tech Mono", monospace',
    position: 'relative',
    zIndex: 1,
  },

  digitBox: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '0.6em',
    fontVariantNumeric: 'tabular-nums',
  },

  colon: {
    position: 'relative',
    top: '-0.15em',
    width: '0.3em',
    justifyContent: 'center',
  },
};

const formatTime = (num: number): string => num.toString().padStart(2, '0');

export default function DigitalClock() {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const timeString = [
    formatTime(time.getHours()),
    formatTime(time.getMinutes()),
    formatTime(time.getSeconds()),
  ].join(':');

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes tilingRise {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(0, -600px, 0);
          }
        }
      `}</style>

      {/* Background Image */}
      <div style={styles.backgroundLayer} />

      {/* Tiling Overlay */}
      <div style={styles.tileOverlay} />

      {/* Digital Clock */}
      <time dateTime={time.toISOString()} style={styles.digitalClock}>
        {timeString.split('').map((char, index) => {
          const isColon = char === ':';
          return (
            <span
              key={index}
              style={{
                ...styles.digitBox,
                ...(isColon && styles.colon),
              }}
            >
              {char}
            </span>
          );
        })}
      </time>
    </div>
  );
}