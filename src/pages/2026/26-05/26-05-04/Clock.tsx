import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import fontUrl from '@/assets/fonts/2026/26-05-03-dolphin.ttf?url';
import jumpVideo from '@/assets/images/2026/26-05/26-05-04/jump.mp4';

const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    background: '#000000',
    primary: '#0D3E9F56',
    shadow: 'drop-shadow(2px 2px 0px rgba(250, 249, 249, 0.8))',
  },
};

const HAND_DIMENSIONS = {
  hour: { width: '1.2vmin', height: '20vmin', zIndex: 3 },
  minute: { width: '0.8vmin', height: '32vmin', zIndex: 4 },
  second: { width: '0.4vmin', height: '38vmin', zIndex: 5 },
};

const calculateNumeralPosition = (number) => {
  const angleRad = (number / 12) * 2 * Math.PI;

  return {
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad),
  };
};

const calculateTimeValues = (date) => {
  const min = date.getMinutes();
  const hr = (date.getHours() % 12) + min / 60;

  return { hr, min };
};

const BackgroundLayers = () => (
  <video
    style={{
      position: 'absolute',
      inset: 0,
      filter: 'saturate(120%) contrast(0.8) brightness(1.2)',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 1,
    }}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={jumpVideo} type="video/mp4" />
  </video>
);

const ClockNumerals = () => {
  const numerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const { x, y } = calculateNumeralPosition(num);

      return (
        <div
          key={num}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(4rem, 10vw, 19rem)',
            color: CLOCK_CONFIG.COLORS.primary,
            filter: CLOCK_CONFIG.COLORS.shadow,
            userSelect: 'none',
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return numerals;
};

const ClockHand = ({ type, rotation }) => {
  const { width, height, zIndex } = HAND_DIMENSIONS[type];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        width,
        height,
        background: CLOCK_CONFIG.COLORS.primary,
        zIndex,
        transformOrigin: '50% 100%',
        filter: CLOCK_CONFIG.COLORS.shadow,
        borderRadius: '10px',
        transform: `translate(-50%, 0) rotate(${rotation}deg)`,
      }}
    />
  );
};


const AnalogClock = () => {
  const currentTime = useClockTime();
  const { hr, min } = calculateTimeValues(currentTime);

  return (
    <div style={styles.container}>
      <style>{`
        @font-face {
          font-family: 'ClockFont';
          src: url(${fontUrl}) format('truetype');
        }
      `}</style>

      <BackgroundLayers />

      <div style={{ ...styles.clockFace, fontFamily: "'ClockFont', serif" }}>
        <ClockNumerals />

        <ClockHand type="hour" rotation={hr * 30} />
        <ClockHand type="minute" rotation={min * 6} />

      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: CLOCK_CONFIG.COLORS.background,
  },

  clockFace: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
  },
};

export default AnalogClock;