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
import React, { useEffect, useRef, useState } from 'react';

// ─── Constants & Configuration ───────────────────────────────────────────────

const CLOCK_LABELS = [num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, num12];
export const assets = [...CLOCK_LABELS, peachImg];

const PEACH_COLOR = '#FFDAB9';
const SHADOW_FILTER = 'drop-shadow(0 -1px 3px rgba(45, 18, 3, 0.9)) drop-shadow(0 1px 1px rgba(40, 236, 10, 0.7))';

const HAND_CONFIG = {
  hour:   { width: 0.04, height: 0.25, z: 10 }, 
  minute: { width: 0.03, height: 0.35, z: 11 }, 
  second: { width: 0.015, height: 0.4, z: 12 }, 
};

// ─── Component: ClockFace ────────────────────────────────────────────────────

interface ClockFaceProps {
  clockSize: number;
  radius: number; 
}

const ClockFace = React.memo(({ clockSize, radius }: ClockFaceProps) => (
  <div
    style={{
      position: 'relative',
      width: clockSize,
      height: clockSize,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'scale(1)',
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
            
            /* ─── Ultra-Soft Vignette Mask ─── */
            // Gradually fades out to transparent starting from the center (20%) to the outer edge (75%)
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)',
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

  const getHandStyle = (config: typeof HAND_CONFIG.hour, type: 'hour' | 'minute' | 'second'): React.CSSProperties => {
    // Custom clip-paths simulating antique brass navigational equipment and chronometers
    let clipPath = 'none';
    if (type === 'hour') {
      clipPath = 'polygon(50% 0%, 100% 35%, 70% 45%, 65% 100%, 35% 100%, 30% 45%, 0% 35%)';
    } else if (type === 'minute') {
      clipPath = 'polygon(50% 0%, 90% 25%, 60% 35%, 60% 100%, 40% 100%, 40% 35%, 10% 25%)';
    } else if (type === 'second') {
      clipPath = 'polygon(50% 0%, 100% 20%, 55% 80%, 80% 85%, 50% 100%, 20% 85%, 45% 80%, 0% 20%)';
    }

    // Aged marine metals
    const antiqueBrass = 'linear-gradient(90deg, #4a3319 0%, #a37c3f 40%, #d1b46a 55%, #8c662d 75%, #36220f 100%)';
    const antiqueCopper = 'linear-gradient(90deg, #2b1105 0%, #8f4423 50%, #52220b 100%)';

    return {
      position: 'absolute',
      bottom: '50%',
      left: `calc(50% - ${(clockSize * config.width) / 2}px)`,
      width: clockSize * config.width,
      height: clockSize * config.height,
      transformOrigin: 'bottom center',
      transform: 'translateX(-50%) rotate(var(--deg, 0deg))',
      zIndex: config.z,
      pointerEvents: 'none',
      willChange: 'transform',
      background: type === 'second' ? antiqueCopper : antiqueBrass,
      clipPath,
      WebkitClipPath: clipPath,
      filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.65))',
    };
  };

  return (
    <>
      <div ref={hourRef} style={getHandStyle(HAND_CONFIG.hour, 'hour')} />
      <div ref={minRef} style={getHandStyle(HAND_CONFIG.minute, 'minute')} />
      <div ref={secRef} style={getHandStyle(HAND_CONFIG.second, 'second')} />
      
      {/* 3D Polished Brass Pin Cap */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: clockSize * 0.045,
          height: clockSize * 0.045,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #f7e7ad 0%, #a37c3f 60%, #36220f 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4)',
          zIndex: 20,
        }}
      />
    </>
  );
});
AnimatedHands.displayName = 'AnimatedHands';

// ─── Main Component ───────────────────────────────────────────────────────────

const TangerineClock: React.FC = () => {
  const [clockSize, setClockSize] = useState<number>(300);
  const [isClient, setIsClient] = useState<boolean>(false);

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
        <ClockFace clockSize={clockSize} radius={radius} />
        <AnimatedHands clockSize={clockSize} />
      </div>
    </main>
  );
};

export default TangerineClock;