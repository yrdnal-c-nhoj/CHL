import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';

// Background & Assets
import backgroundImage from '@/assets/images/2026/26-01/26-01-08/tang.jpeg';
import bgLayerTile from '@/assets/images/2026/26-01/26-01-08/tan.webp';
import num12 from '@/assets/images/2026/26-01/26-01-08/12.webp';
import num1 from '@/assets/images/2026/26-01/26-01-08/1.webp';
import num2 from '@/assets/images/2026/26-01/26-01-08/2.webp';
import num3 from '@/assets/images/2026/26-01/26-01-08/3.webp';
import num4 from '@/assets/images/2026/26-01/26-01-08/4.webp';
import num5 from '@/assets/images/2026/26-01/26-01-08/5.webp';
import num6 from '@/assets/images/2026/26-01/26-01-08/6.webp';
import num7 from '@/assets/images/2026/26-01/26-01-08/7.webp';
import num8 from '@/assets/images/2026/26-01/26-01-08/8.webp';
import num9 from '@/assets/images/2026/26-01/26-01-08/9.webp';
import num10 from '@/assets/images/2026/26-01/26-01-08/10.webp';
import num11 from '@/assets/images/2026/26-01/26-01-08/11.webp';
import hourHandImg from '@/assets/images/2026/26-01/26-01-08/hour.webp';
import minuteHandImg from '@/assets/images/2026/26-01/26-01-08/min.webp';
import secondHandImg from '@/assets/images/2026/26-01/26-01-08/seco.webp';

// --- CONSTANTS ---
const CLOCK_LABELS = [num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11];

const SHADOW_FILTER =
  'drop-shadow(0 0 6px rgba(45, 18, 3, 0.9)) drop-shadow(0 0 12px rgba(236, 10, 10, 0.7))';

const CONFIG = {
  colors: {
    centerDot: '#F2850037',
    border: 'rgba(0,0,0,0.1)',
  },
  sizes: {
    hourHand: { width: 0.42, height: 0.7, z: 10 },
    minuteHand: { width: 1.8, height: 1.2, z: 20 },
    secondHand: { width: 0.68, height: 1.0, z: 30 },
    centerDot: { width: 0.005, height: 0.005 },
  },
};

const TangerineClock: React.FC = () => {
  const [time, setTime] = useState(() => new Date());
  const [clockSize, setClockSize] = useState<number>(300);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Asset configuration
  const assetConfig = useMemo(() => ({
    background: { src: backgroundImage },
    bgLayer: { src: bgLayerTile },
    ...Object.fromEntries(
      CLOCK_LABELS.map((label, index) => [`num${index === 0 ? 12 : index}`, { src: label }])
    ),
    hourHand: { src: hourHandImg },
    minuteHand: { src: minuteHandImg },
    secondHand: { src: secondHandImg },
  }), []);

  const assets = useMultiAssetLoader(assetConfig);

  // Handle resizing logic
  const updateClockSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 500);
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

  // High-performance animation loop
  useEffect(() => {
    if (!isClient) return;

    let rafId: number;
    const update = () => {
      setTime(new Date());
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isClient]);

  // Time calculations
  const { secDeg, minDeg, hourDeg, radius } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      secDeg: ((s + ms / 1000) / 60) * 360,
      minDeg: ((m + s / 60) / 60) * 360,
      hourDeg: (((h % 12) + m / 60) / 12) * 360,
      radius: clockSize * 0.42,
    };
  }, [time, clockSize]);

  const getHandStyle = (deg: number, sizeObj: any): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: clockSize * sizeObj.width,
    height: clockSize * sizeObj.height,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: sizeObj.z,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // Optional: Smooths out jitter if the browser drops frames
    willChange: 'transform', 
  });

  if (!isClient) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a0a02' }} />;
  }

  const ready = assets.isAllLoaded;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#1a0a02',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        touchAction: 'none',
        userSelect: 'none',
        opacity: ready ? 1 : 0,
        visibility: ready ? 'visible' : 'hidden',
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {/* Background Layers */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            inset: -20,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '25% auto',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            transform: 'scale(1.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgLayerTile})`,
            backgroundRepeat: 'repeat',
            backgroundPosition: '90px 90px',
            opacity: 0.9,
          }}
        />
      </div>

      {/* Clock Face */}
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
        {/* Numbers */}
        {CLOCK_LABELS.map((label, i) => {
          const angle = (i + 1) * 30;
          const x = Math.sin((angle * Math.PI) / 180) * radius;
          const y = -Math.cos((angle * Math.PI) / 180) * radius;

          return (
            <img
              key={i}
              src={label}
              alt=""
              style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y}px)`,
                width: clockSize * 0.22,
                height: clockSize * 0.22,
                objectFit: 'contain',
                filter: SHADOW_FILTER,
              }}
            />
          );
        })}

        {/* Hour Hand */}
        <div style={getHandStyle(hourDeg, CONFIG.sizes.hourHand)}>
          <img
            src={hourHandImg}
            style={{
              width: '100%',
              height: '50%',
              objectFit: 'contain',
              filter: `brightness(0.9) contrast(1.2) hue-rotate(-20deg) saturate(0.9) ${SHADOW_FILTER}`,
            }}
            alt=""
          />
        </div>

        {/* Minute Hand */}
        <div style={getHandStyle(minDeg, CONFIG.sizes.minuteHand)}>
          <img
            src={minuteHandImg}
            style={{ width: '100%', height: '70%', objectFit: 'contain', filter: SHADOW_FILTER }}
            alt=""
          />
        </div>

        {/* Second Hand */}
        <div style={getHandStyle(secDeg, CONFIG.sizes.secondHand)}>
          <img
            src={secondHandImg}
            style={{ width: '100%', height: '80%', objectFit: 'contain', filter: SHADOW_FILTER }}
            alt=""
          />
        </div>

        {/* Center Dot */}
        <div
          style={{
            position: 'absolute',
            width: clockSize * CONFIG.sizes.centerDot.width,
            height: clockSize * CONFIG.sizes.centerDot.height,
            backgroundColor: CONFIG.colors.centerDot,
            border: `1px solid ${CONFIG.colors.border}`,
            borderRadius: '50%',
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
};

export default TangerineClock;