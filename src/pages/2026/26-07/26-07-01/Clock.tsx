import labelFont from '@/assets/fonts/26fonts/26-07-01.ttf?url';
import digitFont from '@/assets/fonts/26fonts/26-07-01digit.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';

/**
 * July 1, 2026 - Alpha Centauri Cosmic Clock System
 * Features a tight central binary core with an un-clippable outer orbit for Proxima Centauri.
 */

export const assets: string[] = [labelFont, digitFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'DigitFont',
    fontUrl: digitFont,
    options: { weight: 400, style: 'normal' },
  },
  {
    fontFamily: 'LabelFont',
    fontUrl: labelFont,
    options: { weight: 500, style: 'normal' },
  },
];

const formatDigits = (num: number): string => num.toString().padStart(2, '0');

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
      fontFamily: "'DigitFont', 'Share Tech Mono', monospace, system-ui",
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
      letterSpacing: '0.02em',
      color: '#C9D8EF',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0, 0, 0, 0.8)',
      whiteSpace: 'nowrap',
      fontSize: '6vh',
      fontWeight: 300,
      textAlign: 'center',
    },
    starA: {
      width: ' 30vh',
      height: ' 30vh',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fff9ea 0%, #ffdf9e 60%, rgba(255,223,158,0) 75%)',
      boxShadow: '0 0 35px 12px rgba(255, 223, 158, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'orbit-a 12s linear infinite',
    },
    starB: {
      width: ' 26vh',
      height:  ' 26vh',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fff1d9 0%, #ffb066 60%, rgba(255,176,102,0) 75%)',
      boxShadow: '0 0 30px 10px rgba(255, 176, 102, 0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'orbit-b 12s linear infinite',
    },
    starDigits: {
      fontSize: '9vh',
      fontWeight: 300,
      color: '#2E245B',
      lineHeight: 1,
      textShadow: '1px 1px 0px rgba(252, 248, 248, 1)',
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
      width: '20vh',
      height:  '20vh',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #ff8c72 0%, #c1440e 65%, rgba(193,68,14,0) 80%)',
      boxShadow: '0 0 20px 6px rgba(193, 68, 14, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    proximaDigits: {
      fontSize: '6vh',
      color: '#0C0202',
      fontWeight: 700,
      lineHeight: 1,
      textShadow: '1px 1px 0px rgb(242, 235, 235)',
    },
  };

  return (
    <main style={styles.container}>
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