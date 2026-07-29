import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { memo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-29.otf?url';
import backgroundVideo from '@/assets/images/26_images/26-07/26-07-29/eiffel.mp4';

// ======================================================
// Config & Constants
// ======================================================

export const assets = [backgroundVideo, fontUrl];

// ======================================================
// Main Component
// ======================================================

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_29',
    fontUrl,
  },
];

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#2A2765',
    contain: 'layout style paint',
    isolation: 'isolate',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    willChange: 'transform',
    zIndex: 5,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25vh',
    color: '#ececef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'ClockFont_26_07_29', sans-serif",
    zIndex: 10,
  },
  digitGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.05vmin',
    justifyContent: 'center',
  },
  digitBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '2rem',
    fontSize: '1.8rem',
    flexShrink: 0,
    textAlign: 'center',
  },
  separator: {
    fontSize: '1.8rem',
    paddingBottom: '0.2rem',
  },
};

const ClockComponent: React.FC = () => {
  const currentTime = useMillisecondClock();

  useSuspenseFontLoader(FONT_CONFIGS);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(currentTime.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  return (
    <div style={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        style={styles.backgroundLayer}
      />

      <div style={styles.face}>
        <div style={styles.digitGroup}>
          <span style={styles.digitGroup}>
            <span style={styles.digitBox}>{hours[0]}</span>
            <span style={styles.digitBox}>{hours[1]}</span>
            <span style={styles.separator}>:</span>
            <span style={styles.digitBox}>{minutes[0]}</span>
            <span style={styles.digitBox}>{minutes[1]}</span>
            <span style={styles.separator}>:</span>
            <span style={styles.digitBox}>{seconds[0]}</span>
            <span style={styles.digitBox}>{seconds[1]}</span>
            <span style={styles.separator}>:</span>
            <span style={styles.digitBox}>{milliseconds[0]}</span>
            <span style={styles.digitBox}>{milliseconds[1]}</span>
          </span>
        </div>
      </div>

      {/* Accessible time element as per ARCHITECTURE.md */}
      <time dateTime={currentTime.toISOString()} className="sr-only">
        {currentTime.toLocaleTimeString()}
      </time>
    </div>
  );
};

const MemoizedClock = memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_07_29';

export default MemoizedClock;
