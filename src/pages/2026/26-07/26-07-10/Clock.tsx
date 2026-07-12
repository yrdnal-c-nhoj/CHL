import cloud from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassbreak, cloud];

type Device = 'phone' | 'tablet' | 'desktop' | 'tv';

const getDevice = (width: number): Device => {
  if (width < 768) return 'phone';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'tv';
};

const useDevice = () => {
  const [device, setDevice] = useState<Device>(() => {
    if (typeof window !== 'undefined') {
      return getDevice(window.innerWidth);
    }
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => setDevice(getDevice(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};

const DEVICE_LAYOUT: Record<
  Device,
  {
    clockSize: string;
    fontSize: string;
    hourWidth: number;
    minuteWidth: number;
    secondWidth: number;
    centerSize: number;
    numeralRadius: number;
  }
> = {
  phone: {
    clockSize: 'min(78vw, 72vh)',
    fontSize: 'clamp(0.95rem, 4.2vw, 1.35rem)',
    hourWidth: 5,
    minuteWidth: 3,
    secondWidth: 2,
    centerSize: 10,
    numeralRadius: 37,
  },
  tablet: {
    clockSize: 'min(58vw, 62vh)',
    fontSize: 'clamp(1.1rem, 2.8vw, 1.55rem)',
    hourWidth: 6,
    minuteWidth: 4,
    secondWidth: 2,
    centerSize: 12,
    numeralRadius: 38,
  },
  desktop: {
    clockSize: 'min(42vw, 58vh, 440px)',
    fontSize: 'clamp(1.15rem, 1.8vw, 1.65rem)',
    hourWidth: 6,
    minuteWidth: 4,
    secondWidth: 2,
    centerSize: 12,
    numeralRadius: 38,
  },
  tv: {
    clockSize: 'min(36vw, 55vh, 640px)',
    fontSize: 'clamp(1.5rem, 1.4vw, 2.25rem)',
    hourWidth: 8,
    minuteWidth: 5,
    secondWidth: 3,
    centerSize: 16,
    numeralRadius: 39,
  },
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const AnalogClock: React.FC = () => {
  const time = useSecondClock();
  const device = useDevice();
  const layout = DEVICE_LAYOUT[device];

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

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background layers keep filters so the clock stays crisp */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${glassbreak})`,
          backgroundSize: 'cover',
          backgroundPosition: device === 'phone' ? '60% center' : 'center',
          filter: 'contrast(0.9) brightness(1.1)',
          zIndex: 0,
        }}
      />
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
      <div
        style={{
          ...styles.clock,
          width: layout.clockSize,
          height: layout.clockSize,
        }}
      >
        <div style={styles.face}>
          {ROMAN_NUMERALS.map((numeral, i) => {
            const angle = (i + 1) * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const left = 50 + layout.numeralRadius * Math.cos(rad);
            const top = 50 + layout.numeralRadius * Math.sin(rad);
            return (
              <div
                key={numeral}
                style={{
                  ...styles.numeral,
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: layout.fontSize,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {numeral}
              </div>
            );
          })}

          <div
            style={{
              ...styles.hand,
              width: layout.hourWidth,
              height: '28%',
              marginLeft: -layout.hourWidth / 2,
              backgroundColor: '#fff',
              transform: `rotate(${hourDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: layout.minuteWidth,
              height: '38%',
              marginLeft: -layout.minuteWidth / 2,
              backgroundColor: '#fff',
              transform: `rotate(${minuteDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: layout.secondWidth,
              height: '42%',
              marginLeft: -layout.secondWidth / 2,
              backgroundColor: '#B4D0F1',
              transform: `rotate(${secondDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.centerDot,
              width: layout.centerSize,
              height: layout.centerSize,
            }}
          />
        </div>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  clock: {
    position: 'relative',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: '50%',
    backgroundColor: '#B4D0F1',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
    zIndex: 1,
  },
  numeral: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: "'Shrikhand', cursive",
    whiteSpace: 'nowrap',
    textRendering: 'geometricPrecision',
  },
};

export default AnalogClock;
