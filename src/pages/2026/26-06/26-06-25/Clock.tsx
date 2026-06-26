import jumpVideo from '@/assets/images/26_images/26-06/26-06-25/tiger.mp4';
import { memo, useEffect, useRef, useState } from 'react';


// --- CONFIG & CONSTANTS ---
const CLOCK_CONFIG = {
  COLORS: {
    primary: '#EC9808D8',
    shadow: 'drop-shadow(1px 1px 0px rgba(44, 20, 6, 0.96))',
  },
};
export const assets = [jumpVideo];


const HAND_DIMENSIONS = {
  hour: { width: '1.9vmin', height: '9vmin', zIndex: 3 },
  minute: { width: '1.2vmin', height: '18vmin', zIndex: 4 },
  second: { width: '0.9vmin', height: '18vmin', zIndex: 5 },
} as const;

const calculateTimeValues = (date: Date) => {
  const ms = date.getMilliseconds();
  const sec = date.getSeconds() + ms / 1000;
  const min = date.getMinutes() + sec / 60;
  return {
    hr: (date.getHours() % 12) + min / 60, // Use fractional minutes for smooth hour hand
    min,
    sec,
  };
};

/**
 * A high-precision clock hook using requestAnimationFrame for the smoothest updates.
 */
const useSmoothClock = () => {
  const [time, setTime] = useState(new Date());
  const rafId = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setTime(new Date());
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return time;
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
  const currentTime = useSmoothClock(); // Use RAF-based hook for perfect smoothness

  const { hr, min, sec } = calculateTimeValues(currentTime);

  return (
    <div style={styles.container}>
      <BackgroundLayers />
      <div style={styles.clockFace}>
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
    position: 'relative' as const,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    right: 0,
    left: 'auto',
    // filter: 'saturate(250%) contrast(1.1) brightness(1.2)',
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    objectPosition: 'center' as const,
    zIndex: 1,
  },
  clockFace: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vmin',
    height: '100vmin',
    zIndex: 7,
    opacity: 0.6,
  },
  handBase: {
    position: 'absolute' as const,
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
