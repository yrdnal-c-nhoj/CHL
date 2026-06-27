import fontUrl from '@/assets/fonts/26fonts/26-06-23.ttf?url';

// Ensure the browser can load and use the font from Vite's bundled URL
// Some font files might not be discoverable by CSS font loading unless we
// explicitly set the family name here.
const FONT_FAMILY = 'ClockFont_26_06_14';

import jumpVideo from '@/assets/images/26_images/26-06/26-06-23/row.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import { memo, useMemo } from 'react';

// --- CONFIG & CONSTANTS ---
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    primary: '#0D1B40D8',
    shadow: 'drop-shadow(1px 1px 0px rgba(242, 209, 188, 0.96))',
  },
};


const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: FONT_FAMILY,
    fontUrl,
  },
];

export const assets = [fontUrl, jumpVideo];


const HAND_DIMENSIONS = {
  hour: { width: '0.5vmin', height: '18vmin', zIndex: 3 },
  minute: { width: '0.4vmin', height: '32vmin', zIndex: 4 },
  second: { width: '0.2vmin', height: '38vmin', zIndex: 5 },
};

// --- UTILITIES ---
const calculateNumeralPosition = (number: number) => {
  const angleRad = (number / 12) * 2 * Math.PI;
  return {
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad),
  };
};

const calculateTimeValues = (date: Date) => {
  const min = date.getMinutes();
  return {
    hr: (date.getHours() % 12) + min / 60,
    min,
    sec: date.getSeconds(),
  };
};

// --- SUB-COMPONENTS ---

// Memoized to prevent video element re-creation/flicker on time updates
const BackgroundLayers = memo(() => (
  <video
    style={styles.backgroundVideo}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={jumpVideo} type="video/mp4" />
  </video>
));
BackgroundLayers.displayName = 'BackgroundLayers';

// 1..12 mapped to letters (I=9, V=5 style or any custom mapping)
const numeralToLetter = (n: number) => {
  const map = ['w', 'T', 'h', 'c', 's', 'y', 'q', 'f', 'e', 'n', 'g', 'L'];
  return map[n - 1] ?? String(n);
};

const ClockNumerals = memo(() => {
  return useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const label = numeralToLetter(num);
      const { x, y } = calculateNumeralPosition(num);

      return (
        <div
          key={num}
          style={{
            ...styles.numeralBase,
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${(num / 12) * 360}deg)`,
          }}
        >
          {label}
        </div>
      );
    });
  }, []);
});
ClockNumerals.displayName = 'ClockNumerals';

interface ClockHandProps {
  type: keyof typeof HAND_DIMENSIONS;
  rotation: number;
}

const ClockHand: React.FC<ClockHandProps> = ({ type, rotation }) => {
  const { width, height, zIndex } = HAND_DIMENSIONS[type];

  return (
    <div
      style={{
        ...styles.handBase,
        width,
        height,
        zIndex,
        transform: `translateX(-50%) rotate(${rotation}deg)`,
      }}
    />
  );
};

// --- MAIN COMPONENT ---
const AnalogClock = () => {
  const currentTime = useClockTime();
  useSuspenseFontLoader(FONT_CONFIGS);

  const { hr, min, sec } = calculateTimeValues(currentTime);

  return (
    <div style={styles.container}>
      <BackgroundLayers />

      <div style={styles.clockFace}>
        <ClockNumerals />
        <ClockHand type="hour" rotation={hr * 30} />
        <ClockHand type="minute" rotation={min * 6} />
        <ClockHand type="second" rotation={sec * 6} />
      </div>
    </div>
  );
};

// --- STATIC STYLES ---
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: CLOCK_CONFIG.COLORS.primary,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 'auto',
    filter: 'saturate(250%) contrast(1.1) brightness(1.2)',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '100% 50%',
    zIndex: 1,
  },
  clockFace: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
    opacity: 0.6,
    fontFamily: FONT_CONFIGS[0]!.fontFamily, // Aligned with config

  },
  numeralBase: {
    position: 'absolute',
    fontSize: '22vmin',
    color: CLOCK_CONFIG.COLORS.primary,
    filter: CLOCK_CONFIG.COLORS.shadow,
    userSelect: 'none',
  },
  handBase: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
      opacity: 0.6,
    background: CLOCK_CONFIG.COLORS.primary,
    transformOrigin: '50% 100%',
    filter: `${CLOCK_CONFIG.COLORS.shadow} sepia(0.4) saturate(1.8) contrast(1.2)`,
    borderRadius: '0px',
  },
};

export default AnalogClock;
