import React, { useState, useEffect } from 'react';
import veniceFont from '../../../assets/fonts/26-03-13-venice.ttf?url';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';

const Clock: React.FC = () => {
  const time = useSecondClock();
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  const fontConfigs = React.useMemo(() => [
    { fontFamily: 'VeniceFont', fontUrl: veniceFont, options: { weight: 'normal', style: 'normal' } }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setFontLoaded(true);
  }, []);

  const { digits, period } = (() => {
    let h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'P.M.' : 'A.M.';
    h = h % 12 || 12;
    return { digits: `${h}:${m}`, period: ampm };
  })();

  const videoId = 'EO_1LWqsCNE';

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
      }}
    >
      <div
        className="video-background"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
          title="Venice Beach"
          frameBorder="0"
          allow="autoplay; fullscreen"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      </div>

      <div
        className={`venice-clock ${fontLoaded ? 'loaded' : ''}`}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'VeniceFont, sans-serif',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(4rem,16vw,14rem)',
            lineHeight: 1.3,
            padding: '0.2em 0',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(90deg,#F321FA,#EFF70D,#ff1493)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'venice-glow 4s ease-in-out infinite',
          }}
        >
          {digits}
        </div>

        <div
          style={{
            fontSize: 'clamp(3rem,9vw,8rem)',
            marginTop: '1rem',
            letterSpacing: '.25em',
            fontWeight: 900,
            background: 'linear-gradient(90deg,#ff1493,#00ffff,#DCFF14)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'venice-glow 3s ease-in-out infinite',
          }}
        >
          {period}
        </div>
      </div>
    </div>
  );
};

export default Clock;
