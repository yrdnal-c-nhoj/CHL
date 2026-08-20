import { memo, useEffect, useRef, useMemo } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import tumbGif from '@/assets/images/25_images/25-05/25-05-04/tumb-ezgif.com-optimize.gif';
import spinnGif from '@/assets/images/25_images/25-05/25-05-04/spinn.gif';
import edGif from '@/assets/images/25_images/25-05/25-05-04/ed-ezgif.com-optimize.gif';
import wallpaperGif from '@/assets/images/25_images/25-05/25-05-04/wallpapaer-ezgif.com-optimize.gif';
import styles from './Clock.module.css';

export const assets = [tumbGif, spinnGif, edGif, wallpaperGif];

const fontConfigs: FontConfig[] = [];

const Clock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();
  const clockRef = useRef<HTMLDivElement>(null);

  const secDeg = time.getSeconds() * 6;
  const minDeg = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hrDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  const containerStyle = {
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    fontFamily: "'Oxanium', 'Nanum Gothic Coding', 'Roboto Slab', monospace",
  };

  const slideshowStyle = {
    position: 'relative',
    width: '90vh',
    height: '90vh',
    overflow: 'hidden',
    zIndex: 5,
  };

  const clockStyle = {
    width: '87vh',
    height: '87vh',
    borderRadius: '50%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9,
  };

  const handStyle = {
    width: '50%',
    height: '4px',
    position: 'absolute',
    top: '50%',
    transformOrigin: '100%',
    transform: 'rotate(90deg)',
    transition: 'transform 0.05s ease-in-out',
  };

  const wallpaperStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '110%',
    zIndex: 1,
  };

  return (
    <main className={styles.container} style={containerStyle}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div style={slideshowStyle}>
        {[tumbGif, spinnGif, edGif].map((src, i) => (
          <img
            decoding="async"
            loading="lazy"
            key={i}
            src={src}
            alt={`frame-${i}`}
            className={styles.fade}
            style={{ animationDelay: `${i * 3}s` }}
          />
        ))}
      </div>

      <div style={clockStyle}>
        <div
          id="hour"
          style={{ ...handStyle, height: '6px', background: 'rgb(113, 107, 113)', transform: `translateX(-50%) rotate(${hrDeg}deg)` }}
        />
        <div
          id="minute"
          style={{ ...handStyle, background: 'rgb(65, 69, 69)', transform: `translateX(-50%) rotate(${minDeg}deg)` }}
        />
        <div
          id="second"
          style={{ ...handStyle, height: '1px', background: 'rgb(65, 69, 69)', transform: `translateX(-50%) rotate(${secDeg}deg)` }}
        />
      </div>

      <img
        decoding="async"
        loading="lazy"
        src={wallpaperGif}
        alt="background"
        style={wallpaperStyle}
      />
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_05_04';
export default MemoizedClock;
