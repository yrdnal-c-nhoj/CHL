import cloud from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassbreak, cloud];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Generated layout settings using custom CSS property mapping 
const CLOCK_VARIABLES = {
  '--clock-size': 'min(78vw, 72vh)',
  '--font-size': 'clamp(0.95rem, 4.2vw, 1.35rem)',
  '--radius': '37',
  '--h-width': '5px',
  '--m-width': '3px',
  '--s-width': '2px',
  '--dot-size': '10px',
  // Media query overrides via responsive responsive definitions handled at app context or native layouts
} as CSSProperties;

const AnalogClock: React.FC = () => {
  const time = useSecondClock();

  // Inject Google Font once on mount
  useEffect(() => {
    const fontId = 'google-font-shrikhand';
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap';
    document.head.appendChild(link);

    return () => {
      document.getElementById(fontId)?.remove();
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <main style={styles.mainContainer}>
      {/* Background layers */}
      <div style={styles.bgGlass} />
      <div style={styles.bgClouds} />

      {/* Analog Clock Wrapper injecting layout variables dynamically */}
      <div style={{ ...styles.clock, ...CLOCK_VARIABLES }}>
        <div style={styles.face}>
          {ROMAN_NUMERALS.map((numeral, i) => {
            const angle = (i + 1) * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            
            // Calculate coordinates dynamically inline using CSS math
            return (
              <div
                key={numeral}
                style={{
                  ...styles.numeral,
                  left: `calc(50% + var(--radius) * ${Math.cos(rad)}%)`,
                  top: `calc(50% + var(--radius) * ${Math.sin(rad)}%)`,
                }}
              >
                {numeral}
              </div>
            );
          })}

          {/* Hands */}
          <div
            style={{
              ...styles.hand,
              width: 'var(--h-width)',
              height: '28%',
              transform: `translate(-50%) rotate(${hourDegrees}deg)`,
              backgroundColor: '#fff',
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: 'var(--m-width)',
              height: '38%',
              transform: `translate(-50%) rotate(${minuteDegrees}deg)`,
              backgroundColor: '#fff',
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: 'var(--s-width)',
              height: '42%',
              transform: `translate(-50%) rotate(${secondDegrees}deg)`,
              backgroundColor: '#B4D0F1',
            }}
          />
          
          {/* Center Pin */}
          <div style={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  mainContainer: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgGlass: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${glassbreak})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'contrast(0.9) brightness(1.1)',
    zIndex: 0,
  },
  bgClouds: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${cloud})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    mixBlendMode: 'screen',
    filter: 'contrast(2) brightness(1.1)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  clock: {
    position: 'relative',
    width: 'var(--clock-size)',
    height: 'var(--clock-size)',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  face: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: 2,
    willChange: 'transform',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'var(--dot-size)',
    height: 'var(--dot-size)',
    borderRadius: '50%',
    backgroundColor: '#B4D0F1',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
    zIndex: 1,
  },
  numeral: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    fontSize: 'var(--font-size)',
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: "'Shrikhand', cursive",
    whiteSpace: 'nowrap',
    textRendering: 'geometricPrecision',
    lineHeight: 1,
  },
};

export default AnalogClock;