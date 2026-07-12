import { useMultiAssetLoader } from '@/utils/assetLoader';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Background & Assets
import hourHandImg from '@/assets/images/26_images/26-05/26-05-30/hour.webp';
import minuteHandImg from '@/assets/images/26_images/26-05/26-05-30/minute.webp';
import secondHandImg from '@/assets/images/26_images/26-05/26-05-30/second.webp';
import num1 from '@/assets/images/26_images/26-07/26-07-08/1.webp';
import num10 from '@/assets/images/26_images/26-07/26-07-08/10.webp';
import num11 from '@/assets/images/26_images/26-07/26-07-08/11.webp';
import num12 from '@/assets/images/26_images/26-07/26-07-08/12.webp';
import num2 from '@/assets/images/26_images/26-07/26-07-08/2.webp';
import num3 from '@/assets/images/26_images/26-07/26-07-08/3.webp';
import num4 from '@/assets/images/26_images/26-07/26-07-08/4.webp';
import num5 from '@/assets/images/26_images/26-07/26-07-08/5.webp';
import num6 from '@/assets/images/26_images/26-07/26-07-08/6.webp';
import num7 from '@/assets/images/26_images/26-07/26-07-08/7.webp';
import num8 from '@/assets/images/26_images/26-07/26-07-08/8.webp';
import num9 from '@/assets/images/26_images/26-07/26-07-08/9.webp';
import peachImg from '@/assets/images/26_images/26-07/26-07-08/ocean.webp';

// ─── Constants ────────────────────────────────────────────────────────────────

const CLOCK_LABELS = [
  num1, num2, num3, num4, num5, num6,
  num7, num8, num9, num10, num11, num12,
];

/** Export assets for the upstream preloading pipeline */
export const assets = [...CLOCK_LABELS, hourHandImg, minuteHandImg, secondHandImg, peachImg];

const PEACH_COLOR = '#FFDAB9';

const SHADOW_FILTER =
  'drop-shadow(0 -1px 3px rgba(45, 18, 3, 0.9)) drop-shadow(0 1px 1px rgba(40, 236, 10, 0.7))';

const HOUR_HAND_FILTER =
  `brightness(1.1) contrast(1.0) hue-rotate(-20deg) saturate(1.4) ${SHADOW_FILTER}`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface HandSize {
  width: number;   // fraction of clockSize
  height: number;  // fraction of clockSize
  z: number;       // z-index
}

// ─── Hand config ──────────────────────────────────────────────────────────────

const HAND_CONFIG: Record<'hourHand' | 'minuteHand' | 'secondHand', HandSize> = {
  hourHand:   { width: 0.42, height: 0.8, z: 20 },
  minuteHand: { width: 0.40, height: 0.8, z: 10 },
  secondHand: { width: 0.68, height: 0.6, z: 30 },
};

// ─── ClockFace ────────────────────────────────────────────────────────────────

interface ClockFaceProps {
  clockSize: number;
  radius: number;
  ready: boolean;
}

/**
 * Memoised so the twelve number images don't re-render on every millisecond tick.
 */
const ClockFace = React.memo(({ clockSize, radius, ready }: ClockFaceProps) => (
  <div
    style={{
      position: 'relative',
      width: clockSize,
      height: clockSize,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: ready ? 'scale(1)' : 'scale(0.95)',
      transition: 'transform 0.5s ease-out',
    }}
  >
    {CLOCK_LABELS.map((label, i) => {
      const angle = (i + 1) * 30;
      const x = Math.sin((angle * Math.PI) / 180) * radius;
      const y = -Math.cos((angle * Math.PI) / 180) * radius;
      return (
        <img
          key={i}
          src={label}
          alt={`${i + 1}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            width: clockSize * 0.20,
            height: clockSize * 0.22,
            objectFit: 'contain',
            filter: SHADOW_FILTER,
          }}
        />
      );
    })}
  </div>
));

ClockFace.displayName = 'ClockFace';

// ─── Main Component ───────────────────────────────────────────────────────────

const TangerineClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [clockSize, setClockSize] = useState<number>(300);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Implement a high-frequency update loop using requestAnimationFrame.
  // This ensures the second hand moves in a continuous "sweep" motion at the
  // display's refresh rate (typically 60fps) rather than ticking every second.
  useEffect(() => {
    let rafId: number;
    const updateClock = () => {
      setTime(new Date());
      rafId = requestAnimationFrame(updateClock);
    };
    rafId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Asset loading ──────────────────────────────────────────────────────────

  const assetConfig = useMemo(
    () => ({
      ...CLOCK_LABELS.reduce<Record<string, { src: string }>>((acc, label, index) => {
        acc[`num${index + 1}`] = { src: label };
        return acc;
      }, {}),
      hourHand:   { src: hourHandImg },
      minuteHand: { src: minuteHandImg },
      secondHand: { src: secondHandImg },
      peach:      { src: peachImg },
    }),
    [],
  );

  const loaderState = useMultiAssetLoader(assetConfig);

  // ── Responsive sizing ──────────────────────────────────────────────────────

  const updateClockSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const size = Math.min(
        window.innerWidth  * 0.9,
        window.innerHeight * 0.7,
        500,
      );
      setClockSize(size);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateClockSize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateClockSize, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updateClockSize]);

  // ── Angle calculations ─────────────────────────────────────────────────────

  const radius = useMemo(() => clockSize * 0.42, [clockSize]);

  const { secDeg, minDeg, hourDeg } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s  = time.getSeconds();
    const m  = time.getMinutes();
    const h  = time.getHours();

    const totalSeconds = s + ms / 1000;
    const totalMinutes = m + totalSeconds / 60;
    const totalHours   = (h % 12) + totalMinutes / 60;

    return {
      secDeg:  (totalSeconds / 60) * 360,
      minDeg:  (totalMinutes / 60) * 360,
      hourDeg: (totalHours / 12) * 360,
    };
  }, [time]);

  // ── Hand style factory ─────────────────────────────────────────────────────

  const getHandStyle = (deg: number, size: HandSize): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: clockSize * size.width,
    height: clockSize * size.height,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: size.z,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    willChange: 'transform',
  });

  // ── SSR guard ──────────────────────────────────────────────────────────────

  if (!isClient) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: PEACH_COLOR }} />;
  }

  const ready = loaderState.isAllLoaded;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
       backgroundColor: PEACH_COLOR,
        backgroundImage: `url(${peachImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        touchAction: 'none',
        userSelect: 'none',
        opacity: isClient ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
      }}
    >
      <div style={{ position: 'relative', width: clockSize, height: clockSize }}>

        {/* Static face — memoised, only re-renders when size/ready changes */}
        <ClockFace clockSize={clockSize} radius={radius} ready={ready} />

        {/* Hour Hand */}
        <div style={getHandStyle(hourDeg, HAND_CONFIG.hourHand)}>
          <div
            style={{
              width: '10%',
              height: '40%',
              borderRadius: '99px',
              background: 'rgba(132, 129, 127, 0.75)',
              filter: HOUR_HAND_FILTER,
            }}
          />
        </div>

        {/* Minute Hand */}
        <div style={getHandStyle(minDeg, HAND_CONFIG.minuteHand)}>
          <div
            style={{
              width: '4%',
              height: '70%',
              borderRadius: '99px',
              background: 'rgba(206, 197, 192, 0.75)',
              filter: SHADOW_FILTER,
            }}
          />
        </div>

        {/* Second Hand */}
        <div style={getHandStyle(secDeg, HAND_CONFIG.secondHand)}>
          <div
            style={{
              width: '1%',
              height: '80%',
              borderRadius: '9px',
              background: 'rgba(222, 207, 199, 0.75)',
              filter: SHADOW_FILTER,
            }}
          />
        </div>


      </div>
    </main>
  );
};

export default TangerineClock;
