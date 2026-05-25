import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';


import edGif from '@/assets/images/25_images/25-05/25-05-04/ed-ezgif.com-optimize.gif';
import spinnGif from '@/assets/images/25_images/25-05/25-05-04/spinn.gif';
import tumbGif from '@/assets/images/25_images/25-05/25-05-04/tumb-ezgif.com-optimize.gif';
import wallpaperGif from '@/assets/images/25_images/25-05/25-05-04/wallpapaer-ezgif.com-optimize.gif';

// Component Props interface
interface ClockProps {
  // No props required for this component
}

const Clock: React.FC<ClockProps> = () => {
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  // Keep reference so it’s not treated as unused; hook likely updates internal state
  void currentTime;


  const clockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateClock = (): void => {


      const now = new Date();

      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours();

      const secDeg = sec * 6;
      const minDeg = min * 6 + sec * 0.1;
      const hrDeg = hr * 30 + min * 0.5;

      const secondEl = document.getElementById('second');
      if (secondEl instanceof HTMLElement) {
        secondEl.style.transform = `rotate(${secDeg}deg)`;
      }

      const minuteEl = document.getElementById('minute');
      if (minuteEl instanceof HTMLElement) {
        minuteEl.style.transform = `rotate(${minDeg}deg)`;
      }

      const hourEl = document.getElementById('hour');
      if (hourEl instanceof HTMLElement) {
        hourEl.style.transform = `rotate(${hrDeg}deg)`;
      }


    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const containerStyle: CSSProperties = {

    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    fontFamily: "'Oxanium', 'Nanum Gothic Coding', 'Roboto Slab', monospace",
  };

  const slideshowStyle: CSSProperties = {

    position: 'relative',
    width: '90vh',
    height: '90vh',
    overflow: 'hidden',
    zIndex: 5,
  };

  const imageStyle = (index: number): CSSProperties => ({

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    opacity: 0,
    animation: `fade 9s infinite`,
    animationDelay: `${index * 3}s`,
  });

  const clockStyle: CSSProperties = {

    width: '87vh',
    height: '87vh',
    borderRadius: '50%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9,
  };

  const handStyle: CSSProperties = {

    width: '50%',
    height: '4px',
    position: 'absolute',
    top: '50%',
    transformOrigin: '100%',
    transform: 'rotate(90deg)',
    transition: 'transform 0.05s ease-in-out',
  };

  const wallpaperStyle: CSSProperties = {

    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '110%',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={slideshowStyle}>
        {[tumbGif, spinnGif, edGif].map((src, i) => (
          <img
            decoding="async"
            loading="lazy"
            key={i}
            src={src}
            alt={`frame-${i}`}
            style={imageStyle(i)}
          />
        ))}
      </div>

      <div style={clockStyle}>
        <div
          id="hour"
          style={{
            ...handStyle,
            height: '6px',
            background: 'rgb(113, 107, 113)',
          }}
        ></div>
        <div
          id="minute"
          style={{ ...handStyle, background: 'rgb(65, 69, 69)' }}
        ></div>
        <div
          id="second"
          style={{ ...handStyle, height: '1px', background: 'rgb(65, 69, 69)' }}
        ></div>
      </div>

      <img
        decoding="async"
        loading="lazy"
        src={wallpaperGif}
        alt="background"
        style={wallpaperStyle}
      />

      <style>{`
        @keyframes fade {
          0% { opacity: 0; }
          11.1% { opacity: 1; }
          33.3% { opacity: 1; }
          44.4% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Clock;
