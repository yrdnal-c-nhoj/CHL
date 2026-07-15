import fontUrl from '@/assets/fonts/26fonts/26-07-09.ttf?url';
import carVideo from '@/assets/images/26_images/26-07/26-07-09/city.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export const assets = [carVideo];

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const AnalogClock: React.FC = () => {
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  const [isMobile, setIsMobile] = useState(false);

  // Suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optimized animation loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      forceRender();
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  // Time calculation (still inside render for simplicity and React 18+ concurrency safety)
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const isoTime = useMemo(() => now.toISOString(), [now]);

  // Memoized digit grid style (only changes on mobile toggle)
  const digitGridStyle = useMemo<React.CSSProperties>(() => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gridTemplateRows: isMobile ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
    gap: '-0.5vh',
    padding: '0rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '10px',
    opacity: 0.7,
  }), [isMobile]);

  const finalStyles = useMemo(() => ({
    ...styles,
    digitGrid: digitGridStyle,
  }), [digitGridStyle]);

  return (
    <div style={styles.container}>
  
      <video
        style={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <time dateTime={isoTime} style={styles.timeWrapper}>
        <div style={finalStyles.digitalTime}>
          <span style={finalStyles.digitGrid}>
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
    filter: 'brightness(1.3) hue-rotate(20deg) saturate(1.8)',
    zIndex: 1,
  },
  timeWrapper: {
    zIndex: 10,
    textAlign: 'center',
  },
  digitalTime: {
    marginBottom: '2rem',
  },
  digitBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '11.6vw',
    height: '13.7vw',
    fontSize: '14vw',
    color: '#F1F1B9',
  },
};

export default AnalogClock;