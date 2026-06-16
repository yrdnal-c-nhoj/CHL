import fontUrl from '@/assets/fonts/26fonts/26-06-14.ttf?url';
import jumpVideo from '@/assets/images/26_images/26-06/26-06-14/carflood.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import { useMemo } from 'react';

const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    background: '#000000A7', // Keep background black
    primary: '#B1360ED8', // Rust color
    shadow: 'drop-shadow(2px 2px 0px rgba(50, 20, 0, 0.96))', // Darker, earthy shadow
    decayHighlight: 'rgba(255, 149, 0, 0.77)', // For subtle highlights of decay
    decayShadow: 'rgb(0, 0, 0)', // For subtle shadows of decay
  },
};

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_14',
    fontUrl,
  },
];

export const assets = [fontUrl, jumpVideo];

const HAND_DIMENSIONS = {
  hour: { width: '0.4vmin' as const, height: '18vmin' as const, zIndex: 3 },
  minute: { width: '0.3vmin' as const, height: '32vmin' as const, zIndex: 4 },
  second: { width: '0.2vmin' as const, height: '38vmin' as const, zIndex: 5 },
};

const calculateNumeralPosition = (number: number) => {
  const angleRad = (number / 12) * 2 * Math.PI;

  return {
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad),
  };
};

const calculateTimeValues = (date: Date) => {
  const min = date.getMinutes();
  const hr = (date.getHours() % 12) + min / 60;
  const sec = date.getSeconds();

  return { hr, min, sec };
};

const BackgroundLayers = () => (
  <video
    style={{
      position: 'absolute',
      inset: 0,
      filter: 'saturate(150%) contrast(1.1) brightness(1.2)',
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
            transform: `translate(-50%, -50%) rotate(${(num / 12) * 360}deg)`,
            fontSize: 'clamp(2rem, 4vw, 19rem)',
            color: CLOCK_CONFIG.COLORS.primary,
            filter: CLOCK_CONFIG.COLORS.shadow,
            userSelect: 'none',
            // Added for decayed/chipped look
            textShadow: `
              -1px -1px 0px ${CLOCK_CONFIG.COLORS.decayShadow},
              1px 1px 0px ${CLOCK_CONFIG.COLORS.decayHighlight},
              -2px -2px 2px ${CLOCK_CONFIG.COLORS.decayShadow},
              2px 2px 2px ${CLOCK_CONFIG.COLORS.decayHighlight}
            `,
          }}
        >
          {String(num).padStart(2, '0')}
        </div>
      );
    });
  }, []);

  return numerals;
};

interface ClockHandProps {
  type: keyof typeof HAND_DIMENSIONS;
  rotation: number;
}

const ClockHand: React.FC<ClockHandProps> = ({ type, rotation }) => {
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
        filter: `${CLOCK_CONFIG.COLORS.shadow} sepia(0.4) saturate(1.8) contrast(1.2)`,
        borderRadius: '0px', // Removed for sharper, more decayed edges
        transform: `translate(-50%, 0) rotate(${rotation}deg)`,
      }}
    />
  );
};

const AnalogClock = () => {
  const currentTime = useClockTime();
  useSuspenseFontLoader(FONT_CONFIGS);

  const { hr, min, sec } = calculateTimeValues(currentTime);

  return (
    <div style={styles.container}>
      <BackgroundLayers />

      <div style={{ ...styles.clockFace, fontFamily: "'ClockFont_26_06_14', serif" }}>
        <ClockNumerals />

        <ClockHand type="hour" rotation={hr * 30} />
        <ClockHand type="minute" rotation={min * 6} />
        <ClockHand type="second" rotation={sec * 6} />
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
    opacity: 0.5,
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
  },
};

export default AnalogClock;