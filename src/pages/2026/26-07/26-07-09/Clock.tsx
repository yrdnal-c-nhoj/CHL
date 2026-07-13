import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef } from 'react';

import carVideo from '@/assets/images/26_images/26-07/26-07-09/city.mp4';
// Import the corresponding font from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-07-09.ttf?url';

// Export assets for the preloading pipeline
export const assets = [carVideo];

// Font configuration for the suspense loader
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const AnalogClock: React.FC = () => {
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // This ensures the milliseconds update smoothly in the digital boxes.
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();
  const isoTime = useMemo(() => now.toISOString(), [now]);

  return (
    <div style={styles.container}>
      <div style={styles.videoOverlay} />
      <video
        style={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <time dateTime={isoTime} style={styles.timeWrapper}>
        <div style={styles.digitalTime}>
          <span style={styles.digitGroup}>
            <span style={styles.digitBox}>
              {String(hours).padStart(2, '0')[0]}
            </span>
            <span style={styles.digitBox}>
              {String(hours).padStart(2, '0')[1]}
            </span>
            <span style={styles.digitBox}>
              {String(minutes).padStart(2, '0')[0]}
            </span>
            <span style={styles.digitBox}>
              {String(minutes).padStart(2, '0')[1]}
            </span>
            <span style={styles.digitBox}>
              {String(seconds).padStart(2, '0')[0]}
            </span>
            <span style={styles.digitBox}>
              {String(seconds).padStart(2, '0')[1]}
            </span>
            <span style={styles.digitBox}>
              {String(Math.floor(ms / 10)).padStart(2, '0')[0]}
            </span>
            <span style={styles.digitBox}>
              {String(Math.floor(ms / 10)).padStart(2, '0')[1]}
            </span>
          </span>
        </div>
      </time>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'ClockFont, monospace',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
  },
  timeWrapper: {
    zIndex: 10,
    color: '#fff',
    textAlign: 'center',
  },
  digitalTime: {
    marginBottom: '2rem',
  },
  digitGroup: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '10px',
    opacity: 0.4,

  },
  digitBox: {
    width: '9.8vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14vw',
    color: '#F1F1B9',
},
  hand: {
    /* This style is not used in the final component but kept for reference */
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
  },
};

export default AnalogClock;
