import React, { useState, useEffect, useMemo } from 'react';
import veniceFont from '../../../../assets/fonts/2026/26-03-13-venice.ttf?url';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import { useSecondClock } from '../../../../utils/useSmoothClock';

const Clock: React.FC = () => {
  const time = useSecondClock();
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  // The Live ID from your error message
  const videoId = 'EO_1LWqsCNE'; 

  const fontConfigs = useMemo(() => [
    { fontFamily: 'VeniceFont', fontUrl: veniceFont, options: { weight: 'normal', style: 'normal' } }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setFontLoaded(true);
  }, []);

  const { digits, period } = useMemo(() => {
    let h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'P.M.' : 'A.M.';
    h = h % 12 || 12;
    return { digits: `${h}:${m}`, period: ampm };
  }, [time]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: '#111', // Dark fallback while video loads
      }}
    >
      {/* Video Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
          title="Venice Beach Cam"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '56.25vw', 
            minHeight: '100dvh',
            minWidth: '177.77dvh',
            transform: 'translate(-50%, -50%)',
          }}
        />
     
      </div>

      {/* Clock UI */}
      <div
        className={`venice-clock ${fontLoaded ? 'loaded' : ''}`}
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'VeniceFont, sans-serif',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: fontLoaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(5rem, 22vw, 18rem)',
            lineHeight: 1.7,
            background: 'linear-gradient(to bottom, #F321FA, #EFF70D)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {digits}
        </div>

        <div
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            letterSpacing: '0.2em',
            background: 'linear-gradient(90deg, #00ffff, #DCFF14)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
          }}
        >
          {period}
        </div>
      </div>

      <style>{`
        @keyframes venice-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .loaded {
          animation: venice-float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Clock;