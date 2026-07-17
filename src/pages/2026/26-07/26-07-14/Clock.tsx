import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React from 'react';

// Assuming an image exists in the corresponding folder for the date
import tileImage from '@/assets/images/26_images/26-07/26-07-11/b.webp'; // The tiled overlay image
import backgroundImage from '@/assets/images/26_images/26-07/26-07-11/door.webp'; // The main background
// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-07-11.otf?url';

// Consolidate into a single assets export
export const assets = [backgroundImage, tileImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_11',
    fontUrl,
  },
];

const styles: { [key: string]: React.CSSProperties } = {
  // Note: keyframes are injected via a <style> tag below (inline stylesheets).

  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    fontFamily: '"Share Tech Mono", monospace',
    position: 'relative', // Needed for stacking layers
    overflow: 'hidden',
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
    inset: 0,
    backgroundImage: `url(${tileImage})`,
    backgroundSize: '50px', // Small tile size
    backgroundRepeat: 'repeat',
    opacity: 0.4,
    backgroundPosition: 'center 0px', // Start tiling from the bottom edge (will animate up)
    animation: 'tilingRise 6s linear infinite',
    willChange: 'background-position',
  },
  digitalClock: {
    display: 'flex',
    color: 'white',
    fontSize: 'clamp(2rem, 22vmin, 12rem)',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgb(0, 128, 255)',
    fontFamily: 'ClockFont_26_07_11, "Share Tech Mono", monospace',
    position: 'relative', // Ensure clock is on top of the background layers
    zIndex: 1,
  },
  digitBox: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '0.6em', // Fixed width to prevent jumping
    fontVariantNumeric: 'tabular-nums',
  },
  colon: {
    position: 'relative',
    top: '-0.15em', // Raise the colon slightly more
    width: '0.3em', // Narrower width for the colon
    justifyContent: 'center',
  },
};

/**
 * Formats a number to be two digits, zero-padded.
 * @param num The number to format.
 * @returns A zero-padded string.
 */
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
    <div style={{
      ...styles.container,
    }}>
      {/* Inline keyframes + inline style (no separate CSS file) */}
      <style>{`
        @keyframes tilingRise {
          from { background-position: center 0px; }
          to { background-position: center -50px; }
        }
      `}</style>
      <div style={styles.backgroundLayer} />
      <div style={styles.tileOverlay} />
      <time dateTime={time.toISOString()} style={styles.digitalClock}>
        {timeString.split('').map((char, index) => {
          const isColon = char === ':';
          return (
            <span
              key={index}
              style={{ ...styles.digitBox, ...(isColon && styles.colon) }}
            >{char}</span>
          );
        })}
      </time>
    </div>
  );
}