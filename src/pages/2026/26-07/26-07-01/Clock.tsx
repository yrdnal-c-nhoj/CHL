import labelFont from '@/assets/fonts/26fonts/26-07-01.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { memo, useMemo } from 'react';

/**
 * July 1, 2026 - Alpha Centauri Cosmic Clock System
 * Features a tight central binary core with an un-clippable outer orbit for Proxima Centauri.
 */

export const assets: string[] = [labelFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Share Tech Mono',
    fontUrl: 'https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRBEqV98dVQztYldFcLowEF.woff2',
    options: { weight: 400, style: 'normal' },
  },
  {
    fontFamily: 'LabelFont',
    fontUrl: labelFont,
    options: { weight: 500, style: 'normal' },
  },
];

const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const Starfield: React.FC<{ count: number; speed: number; size: string }> = memo(({ count, speed, size }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: size,
        height: size,
        backgroundColor: '#fff',
        borderRadius: '50%',
        position: 'absolute',
        animationDuration: `${20 + Math.random() * 30}s`,
        animationDelay: `-${Math.random() * 50}s`,
        opacity: Math.random() * 0.5 + 0.3,
        animationName: 'twinkle',
      } as CSSProperties,
    }));
  }, [count, size]);

  const containerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    // This pattern creates a fine, repeating dust of stars
    backgroundImage: `radial-gradient(1px 1px at ${Math.random() * speed}px ${Math.random() * speed}px, white, transparent)`,
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      {stars.map(star => (
        <div key={star.id} style={star.style} />
      ))}
    </div>
  );
});
Starfield.displayName = 'Starfield';

const AlphaCentauriClock: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(() => {
    const h = time.getHours();
    const hours12 = h % 12 || 12;
    return {
      hours: formatDigits(hours12),
      minutes: formatDigits(time.getMinutes()),
      seconds: formatDigits(time.getSeconds()),
    };
  }, [time]);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 40%, #0b0f1a 0%, #05060b 55%, #000000 100%)',
      color: '#eaf2ff',
      fontFamily: "'Share Tech Mono', monospace, system-ui",
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    stage: {
      position: 'relative',
      // Using vmin bounds ensures the entire clock canvas scales gracefully to avoid edge clipping
      width: 'min(76vw, 76vh, 600px)',
      height: 'min(76vw, 76vh, 600px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    systemLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      zIndex: 5,
    },
    binarySystem: {
      display: 'flex',
      gap: '24px', // Tightened gap between A and B
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontFamily: "'LabelFont', serif",
      fontStyle: 'italic',
      letterSpacing: '0.06em',
      color: '#eaf2ff',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0, 0, 0, 0.8)',
      whiteSpace: 'nowrap',
      fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
      fontWeight: 500,
      textAlign: 'center',
    },
    starA: {
      width: 'clamp(65px, 11vw, 100px)',
      height: 'clamp(65px, 11vw, 100px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fff9ea 0%, #ffdf9e 60%, rgba(255,223,158,0) 75%)',
      boxShadow: '0 0 35px 12px rgba(255, 223, 158, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'orbit-a 12s linear infinite',
    },
    starB: {
      width: 'clamp(50px, 8.5vw, 78px)',
      height: 'clamp(50px, 8.5vw, 78px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fff1d9 0%, #ffb066 60%, rgba(255,176,102,0) 75%)',
      boxShadow: '0 0 30px 10px rgba(255, 176, 102, 0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'orbit-b 12s linear infinite',
    },
    starDigits: {
      fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
      fontWeight: 700,
      color: '#120b00',
      lineHeight: 1,
    },
    proximaOrbitTrack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'proxima-orbit 60s linear infinite',
      zIndex: 6,
      pointerEvents: 'none',
    },
    proximaNode: {
      position: 'absolute',
      left: '0px', // Stays bound seamlessly along the left boundary edge of the safe stage
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      transform: 'translateX(-50%)',
    },
    proxima: {
      width: 'clamp(42px, 6.5vw, 55px)',
      height: 'clamp(42px, 6.5vw, 55px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #ff8c72 0%, #c1440e 65%, rgba(193,68,14,0) 80%)',
      boxShadow: '0 0 20px 6px rgba(193, 68, 14, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    proximaDigits: {
      fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
      color: '#ffffff',
      fontWeight: 700,
      lineHeight: 1,
    },
  };

  return (
    <main style={styles.container}>
      {/* Animated Starfield Layers */}
      <Starfield count={150} speed={500} size="1px" />
      <Starfield count={100} speed={800} size="2px" />
      <Starfield count={50} speed={1200} size="3px" />

      <style>{`
        @keyframes orbit-a {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(12px, 4px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes orbit-b {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-12px, -4px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes proxima-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes counter-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          25% { opacity: 0.8; }
          50% { opacity: 0.2; }
          75% { opacity: 0.9; }
        }
      `}</style>

      <div style={styles.stage}>
        {/* Core Centered Elements Block */}
        <div style={styles.systemLayout}>
          <span style={styles.label}>Alpha Centauri A</span>
          
          <div style={styles.binarySystem}>
            <div style={styles.starA}>
              <span style={styles.starDigits}>{hours}</span>
            </div>
            <div style={styles.starB}>
              <span style={styles.starDigits}>{minutes}</span>
            </div>
          </div>

          <span style={styles.label}>Alpha Centauri B</span>
        </div>

        {/* Safe Outer Perimeter Pathing Loop */}
        <div style={styles.proximaOrbitTrack}>
          <div style={styles.proximaNode}>
            <div style={styles.proxima}>
              <span style={{ ...styles.proximaDigits, animation: 'counter-rotate 60s linear infinite' }}>
                {seconds}
              </span>
            </div>
            <span style={{ ...styles.label, animation: 'counter-rotate 60s linear infinite' }}>
              Proxima Centauri
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AlphaCentauriClock;