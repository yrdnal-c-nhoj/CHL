import { useEffect, useRef } from 'react';

// === Local assets (module-based, fingerprinted by Vite) ===
import wallTexture from '../../assets/clocks/26-01-01/fan.gif';       // subtle plaster / stone texture
import brassTexture from '../../assets/clocks/26-01-01/fan.gif';     // optional brass grain
import watchFontUrl from '../../assets/fonts/26-01-01-fan.otf';



import bg1 from '../../assets/clocks/26-01-01/fan.gif';
import myFontUrl from '../../assets/fonts/26-01-01-fan.otf';



export default function NichePocketWatch() {
  const watchRef = useRef(null);

  // === Load font (Vite-modern behavior) ===
  useEffect(() => {
    const font = new FontFace(
      'WatchNumerals',
      `url(${watchFontUrl})`
    );

    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });

    return () => {
      // FontFace cleanup is handled by browser; nothing persistent added
    };
  }, []);

  // === Subtle pendulum swing ===
  useEffect(() => {
    let rafId;
    let start;

    const animate = (t) => {
      if (!start) start = t;
      const elapsed = (t - start) / 1000;

      // gentle, slow swing
      const angle = Math.sin(elapsed * 0.9) * 3;

      if (watchRef.current) {
        watchRef.current.style.transform =
          `translateX(-50%) rotate(${angle}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // === Shared sizing ===
  const nicheWidth = '70vw';
  const nicheMaxWidth = '420px';

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${wallTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'WatchNumerals, serif'
      }}
    >
      {/* === Niche === */}
      <div
        style={{
          position: 'relative',
          width: nicheWidth,
          maxWidth: nicheMaxWidth,
          aspectRatio: '1 / 1.25',
          borderTopLeftRadius: '100% 100%',
          borderTopRightRadius: '100% 100%',
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
          background: 'linear-gradient(180deg, #e6ded2, #cfc6b8)',
          boxShadow:
            'inset 0 1.5rem 2.5rem rgba(0,0,0,0.25), inset 0 -0.5rem 1rem rgba(255,255,255,0.3)',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* === Chain === */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            width: '2px',
            height: '25%',
            background:
              'linear-gradient(180deg, #b08d57, #6e542e)',
            boxShadow: '0 0 2px rgba(0,0,0,0.4)'
          }}
        />

        {/* === Pocket Watch === */}
        <div
          ref={watchRef}
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transformOrigin: 'top center',
            width: '38%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            backgroundImage: `url(${brassTexture})`,
            backgroundSize: 'cover',
            boxShadow:
              '0 1.5rem 2.5rem rgba(0,0,0,0.35), inset 0 0 0.25rem rgba(255,255,255,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Watch face */}
          <div
            style={{
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: '#f7f3ee',
              boxShadow: 'inset 0 0 0.5rem rgba(0,0,0,0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'clamp(1rem, 3vw, 1.6rem)',
              color: '#2e2a24'
            }}
          >
            XII
          </div>
        </div>
      </div>
    </div>
  );
}
