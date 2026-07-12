import cloud from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassbreak, cloud];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const AnalogClock: React.FC = () => {
  const time = useSecondClock();

  // Load the 'Shrikhand' Google Font
  useEffect(() => {
    const fontId = 'google-font-shrikhand';
    if (document.getElementById(fontId)) {
      return;
    }
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap';
    document.head.appendChild(link);

    return () => {
      document.getElementById(fontId)?.remove();
    };
  }, []);

  // Calculate clock hand rotations
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Add fractional parts for smoother hand movement
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundImage: `url(${glassbreak})`,
        backgroundSize: 'cover',
        filter: 'contrast(0.9) brightness(1.1)',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Cloud Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${cloud})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          filter: 'contrast(2) brightness(1.1)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Analog Clock */}
      <div style={styles.clock}>
        <div style={styles.face}>
          {/* Roman Numerals */}
          {Array.from({ length: 12 }, (_, i) => {
            const numeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][i];
            const angle = (i + 1) * 30;
            return (
              <div
                key={i}
                style={{
                  ...styles.numeral,
                  // Centers the element first, rotates towards the target layout path, 
                  // and moves it outwards. The numeral remains aligned with the radius.
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -11.5vmin)`,
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
              ...styles.hourHand,
              transform: `rotate(${hourDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              transform: `rotate(${minuteDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              ...styles.secondHand,
              transform: `rotate(${secondDegrees}deg)`,
            }}
          />
          <div style={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  clock: {
    position: 'relative',
    width: 'clamp(300px, 50vmin, 450px)',
    height: 'clamp(300px, 50vmin, 450px)',
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 30px rgba(0,0,0,0.3)',
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
    borderRadius: '2px',
  },
  hourHand: {
    width: '6px',
    height: '25%',
    marginLeft: '-3px',
    backgroundColor: '#fff',
  },
  minuteHand: {
    width: '4px',
    height: '35%',
    marginLeft: '-2px',
    backgroundColor: '#fff',
  },
  secondHand: {
    width: '2px',
    height: '40%',
    marginLeft: '-1px',
    backgroundColor: '#B4D0F1',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#B4D0F1',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
  },
  numeral: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '40px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(0.9rem, 3vmin, 1.5rem)',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: "'Shrikhand', cursive",
  },
};

export default AnalogClock;