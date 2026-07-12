import { useMultiAssetLoader } from '@/utils/assetLoader';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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

// ─── Constants & Configuration ───────────────────────────────────────────────

const CLOCK_LABELS = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, num12];
export const assets = [...CLOCK_LABELS, hourHandImg, minuteHandImg, secondHandImg, peachImg];

const PEACH_COLOR = '#FFDAB9';
const SHADOW_FILTER = 'drop-shadow(0 -1px 3px rgba(45, 18, 3, 0.9)) drop-shadow(0 1px 1px rgba(40, 236, 10, 0.7))';
const HOUR_HAND_FILTER = `brightness(1.1) contrast(1.0) hue-rotate(-20deg) saturate(1.4) ${SHADOW_FILTER}`;

const HAND_CONFIG = {
  hour:   { width: 0.42, height: 0.8, z: 20, filter: HOUR_HAND_FILTER, img: hourHandImg },
  minute: { width: 0.40, height: 0.8, z: 10, filter: SHADOW_FILTER,    img: minuteHandImg },
  second: { width: 0.68, height: 0.6, z: 30, filter: SHADOW_FILTER,    img: secondHandImg },
};

// ─── Component: ClockFace ────────────────────────────────────────────────────

interface ClockFaceProps {
  clockSize: number;
  radius: number;
  ready: boolean;
}

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

// ─── Component: AnimatedHands ────────────────────────────────────────────────

const AnimatedHands: React.FC<{ clockSize: number }> = React.memo(({ clockSize }) => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    
    const updateAngles = () => {
      const time = new Date();
      const ms = time.getMilliseconds();
      const s  = time.getSeconds();
      const m  = time.getMinutes();
      const h  = time.getHours();

      const totalSeconds = s + ms / 1000;
      const totalMinutes = m + totalSeconds / 60;
      const totalHours   = (h % 12) + totalMinutes / 60;

      if (secRef.current) secRef.current.style.setProperty('--deg', `${(totalSeconds / 60) * 360}deg`);
      if (minRef.current) minRef.current.style.setProperty('--deg', `${(totalMinutes / 60) * 360}deg`);
      if (hourRef.current) hourRef.current.style.setProperty('--deg', `${(totalHours / 12) * 360}deg`);

      rafId = requestAnimationFrame(updateAngles);
    };

    rafId = requestAnimationFrame(updateAngles);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const getHandStyle = (config: typeof HAND_CONFIG.hour): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: clockSize * config.width,
    height: clockSize * config.height,
    transformOrigin: 'bottom center',
    transform: 'translateX(-50%) rotate(var(--deg, 0deg))',
    zIndex: config.z,
    pointerEvents: 'none',
    willChange: 'transform',
  });

  return (
    <>
      <div ref={hourRef} style={getHandStyle(HAND_CONFIG.hour)}>
        <img src={HAND_CONFIG.hour.img} alt="Hour" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: HAND_CONFIG.hour.filter }} />
      </div>
      <div ref={minRef} style={getHandStyle(HAND_CONFIG.minute)}>
        <img src={HAND_CONFIG.minute.img} alt="Minute" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: HAND_CONFIG.minute.filter }} />
      </div>
      <div ref={secRef} style={getHandStyle(HAND_CONFIG.second)}>
        <img src={HAND_CONFIG.second.img} alt="Second" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: HAND_CONFIG.second.filter }} />
      </div>
    </>
  );
});
AnimatedHands.displayName = 'AnimatedHands';

// ─── Main Component ───────────────────────────────────────────────────────────

const TangerineClock: React.FC = () => {
  const [clockSize, setClockSize] = useState<number>(300);
  const [isClient, setIsClient] = useState<boolean>(false);

  const assetConfig = useMemo(() => {
    const base = CLOCK_LABELS.reduce<Record<string, { src: string }>>((acc, label, idx) => {
      acc[`num${idx + 1}`] = { src: label };
      return acc;
    }, {});
    return { ...base, hourHand: { src: hourHandImg }, minuteHand: { src: minuteHandImg }, secondHand: { src: secondHandImg }, peach: { src: peachImg } };
  }, []);

  const loaderState = useMultiAssetLoader(assetConfig);

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setClockSize(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 500));
    };

    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const radius = clockSize * 0.42;

  if (!isClient) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: PEACH_COLOR }} />;
  }

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
        <ClockFace clockSize={clockSize} radius={radius} ready={loaderState.isAllLoaded} />
        <AnimatedHands clockSize={clockSize} />
      </div>
    </main>
  );
};

export default TangerineClock;