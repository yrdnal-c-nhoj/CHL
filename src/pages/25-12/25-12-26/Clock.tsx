import { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';

// Asset imports
import bgImage from '../../../assets/images/25-12/25-12-26/sat.webp';
import overlayImage from '../../../assets/images/25-12/25-12-26/scythe.webp';
import fontFile from '../../../assets/fonts/sat.ttf?url'; // ?url tells Vite to copy the file to output

const FONT_FAMILY = 'SaturnFont';

// Custom hook for clock
function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

// Format time with padding
function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return {
    hours: pad(date.getHours()),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds()),
  };
}

// Overlay component
function ScytheOverlay({ rotation = 0, top = '40%' }) {
  return (
    <img
      decoding="async"
      loading="lazy"
      src={overlayImage}
      alt=""
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        width: '90vw',
        height: '100vw',
        objectFit: 'contain',
        pointerEvents: 'none',
        zIndex: 1,
        filter: 'saturate(0.7) hue-rotate(-190deg) brightness(0.9)', // Example filters
        opacity: 0.6,
      }}
    />
  );
}

// Main component
export default function SaturnClock() {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: FONT_FAMILY, fontUrl: fontFile }
  ], []);

  useSuspenseFontLoader(fontConfigs);
  
  const now = useClock();

  const { hours, minutes } = formatTime(now);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: 0,
        animation: 'fadeIn 0.5s ease-in forwards',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Background image with filters applied only to it */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(0.5) hue-rotate(140deg) brightness(1.9)', // Example filters
          zIndex: 0,
        }}
      />

      {/* Content layer - no filters applied */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ScytheOverlay rotation={0} top="40%" />
        <ScytheOverlay rotation={180} top="60%" />

        <div
          style={{
            width: 'min(90vw, 90dvh)',
            height: 'min(90vw, 90dvh)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 'min(8vw, 8dvh)',
              letterSpacing: '0.04em',
              color: '#7C9497',
              textAlign: 'center',
              lineHeight: '1',
              opacity: 0.5,
              textShadow: '1px 1px 0 white, -1px -1px 0 black',
            }}
          >
            {hours}
            {minutes}
          </div>
        </div>
      </div>
    </div>
  );
}
