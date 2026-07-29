import bgImage from '@/assets/images/26_images/26-07/26-07-27/bg.webp';
import cyanBg from '@/assets/images/26_images/26-07/26-07-27/cyan.webp';
import hourImg from '@/assets/images/26_images/26-07/26-07-27/hour.webp';
import minImg from '@/assets/images/26_images/26-07/26-07-27/minute.webp';
import secImg from '@/assets/images/26_images/26-07/26-07-27/second.webp';
import { useSmoothClock } from '@/utils/hooks/useSmoothClock';
import React, { useEffect, useMemo, useRef, type CSSProperties } from 'react';

export const assets = [bgImage, cyanBg, hourImg, minImg, secImg];

const AnalogClock: React.FC<{ now: Date }> = ({ now }) => {
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000; // Includes fractional seconds for a smooth sweep
    const minutes = now.getMinutes() + seconds / 60; // Include fractional minutes
    const hours = now.getHours();

    return {
      secondAngle: seconds * 6, // 360deg / 60s
      minuteAngle: minutes * 6, // 360deg / 60m
      hourAngle: ((hours % 12) + minutes / 60) * 30, // 360deg / 12h
    };
  }, [now]);

  // Common drop-shadow for all hands
  const dropShadow = 'drop-shadow(0px 0px 8px lavender)';
  const handFilter = `brightness(1.2) contrast(1.3) ${dropShadow}`;

  return (
    <div style={clockStyles.wrapper} aria-label="Analog clock">
      <div style={clockStyles.face}>
        <img
          alt="Hour hand"
          src={hourImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.hourHand,
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            filter: handFilter,
          }}
        />

        <img
          alt="Minute hand"
          src={minImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.minuteHand,
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            filter: handFilter,
          }}
        />

        <img
          alt="Second hand"
          src={secImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.secondHand,
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            filter: handFilter,
          }}
        />

        <div style={clockStyles.centerDot} />
      </div>
    </div>
  );
};

const clockStyles: {
  [key: string]: CSSProperties;
}  = {
  wrapper: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    // Use a variable for the clock size to make it responsive
    '--clock-size': 'clamp(200px, 30vmin, 400px)',
  },
  face: {
    width: 'var(--clock-size)',
    height: 'var(--clock-size)',
    borderRadius: '50%',
    position: 'relative',
  },
  handImgBase: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: '50% 100%',
    borderRadius: 999,
    // Add a subtle transition for ultra-smooth rendering
    transition: 'transform 50ms linear',
    userSelect: 'none',
  },
 hourHand: {
    width: 'calc(var(--clock-size) * 0.45)', // Responsive sizing
    height: 'calc(var(--clock-size) * 0.65)',
  },
  minuteHand: {
    width: 'calc(var(--clock-size) * 0.83)', // Responsive sizing
    height: 'calc(var(--clock-size) * 1.12)',
  },
  secondHand: {
    width: 'calc(var(--clock-size) * 0.81)', // Responsive sizing
    height: 'calc(var(--clock-size) * 1.15)',
  },
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  bgLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    filter: 'brightness(0.7) saturate(2.2) contrast(0.7)',
  },
  cyanLayer: {
    position: 'absolute',
    // Make the layer larger than the viewport to prevent clipping on rotation.
    // 142vmax is roughly sqrt(2) * 100, the diagonal of the screen.
    width: '90vmin',
    height: '90vmin',
    left: '50%',
    top: '50%',
    backgroundImage: `url(${cyanBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // filter: 'brightness(0.8) saturate(1.2) contrast(1.2)',
    mixBlendMode: 'screen',
    // opacity: 0.7,
  },
};

const ClockPage: React.FC = () => {
  const now = useSmoothClock();
  const cyanLayerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (cyanLayerRef.current) {
        const currentTime = new Date();
        const ms = currentTime.getMilliseconds();
        const seconds = currentTime.getSeconds() + ms / 1000;
        // -6 degrees per second for a 60-second counter-clockwise rotation
        const rotationAngle = -seconds * 6;
        cyanLayerRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <main style={styles.container}>
      <div style={styles.bgLayer} />
      <div
        ref={cyanLayerRef}
        style={styles.cyanLayer}
      />
      <AnalogClock now={now} />
    </main>
  );
};

export default ClockPage;