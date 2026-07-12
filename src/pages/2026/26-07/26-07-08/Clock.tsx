import { useMultiAssetLoader } from '@/utils/assetLoader';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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

const CLOCK_LABELS = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, num12];
export const assets = [...CLOCK_LABELS, peachImg];

const PEACH_COLOR = '#FFDAB9';
const LABEL_SHADOW =
  'drop-shadow(0 -1px 3px rgba(45, 18, 3, 0.9)) drop-shadow(0 1px 1px rgba(40, 236, 10, 0.7))';

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
            width: clockSize * 0.2,
            height: clockSize * 0.22,
            objectFit: 'contain',
            filter: LABEL_SHADOW,
          }}
        />
      );
    })}
  </div>
));
ClockFace.displayName = 'ClockFace';

const RegularHands: React.FC<{ clockSize: number }> = React.memo(({ clockSize }) => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const updateAngles = () => {
      const time = new Date();
      const ms = time.getMilliseconds();
      const s = time.getSeconds();
      const m = time.getMinutes();
      const h = time.getHours();

      const totalSeconds = s + ms / 1000;
      const totalMinutes = m + totalSeconds / 60;
      const totalHours = (h % 12) + totalMinutes / 60;

      if (secRef.current) secRef.current.style.setProperty('--deg', `${(totalSeconds / 60) * 360}deg`);
      if (minRef.current) minRef.current.style.setProperty('--deg', `${(totalMinutes / 60) * 360}deg`);
      if (hourRef.current) hourRef.current.style.setProperty('--deg', `${(totalHours / 12) * 360}deg`);

      rafId = requestAnimationFrame(updateAngles);
    };

    rafId = requestAnimationFrame(updateAngles);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handBase = (width: number, height: number, z: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height: clockSize * height,
    marginLeft: -width / 2,
    backgroundColor: color,
    borderRadius: width,
    transformOrigin: 'bottom center',
    transform: 'rotate(var(--deg, 0deg))',
    zIndex: z,
    pointerEvents: 'none',
    willChange: 'transform',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
  });

  const pivot = Math.max(10, clockSize * 0.028);

  return (
    <>
      <div ref={hourRef} style={handBase(Math.max(5, clockSize * 0.018), 0.28, 20, '#fff8f0')} />
      <div ref={minRef} style={handBase(Math.max(3, clockSize * 0.012), 0.38, 25, '#fff')} />
      <div ref={secRef} style={handBase(Math.max(2, clockSize * 0.006), 0.42, 30, '#FF9AA8')} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: pivot,
          height: pivot,
          marginLeft: -pivot / 2,
          marginTop: -pivot / 2,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: `${Math.max(2, clockSize * 0.006)}px solid #FF9AA8`,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
        }}
      />
    </>
  );
});
RegularHands.displayName = 'RegularHands';

const TangerineClock: React.FC = () => {
  const [clockSize, setClockSize] = useState(300);
  const [isClient, setIsClient] = useState(false);

  const assetConfig = useMemo(() => {
    const base = CLOCK_LABELS.reduce<Record<string, { src: string }>>((acc, label, idx) => {
      acc[`num${idx + 1}`] = { src: label };
      return acc;
    }, {});
    return { ...base, peach: { src: peachImg } };
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
        <RegularHands clockSize={clockSize} />
      </div>
    </main>
  );
};

export default TangerineClock;
