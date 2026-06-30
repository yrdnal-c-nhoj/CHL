import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef } from 'react';

import carVideo from '@/assets/images/26_images/26-06/26-06-29/manufacture.mp4';
// Import the corresponding font from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-06-29.ttf?url';
// Export assets for the preloading pipeline
export const assets = [carVideo, fontUrl];

// Font configuration for the suspense loader
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  digitalTime: {
    fontFamily: 'ClockFont, monospace',
    fontSize: '18vh',
    color: 'rgba(255, 255, 255, 0.85)',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    letterSpacing: '0.05em',
    display: 'flex',
    gap: '0.5ch',
  },
  timeWrapper: {
    zIndex: 3,
  },
};

interface HandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const getHandZIndex = (type: 'hour' | 'minute' | 'second'): number => {
  if (type === 'second') return 30;
  if (type === 'minute') return 20;
  return 10;
};

const getHandBorderRadius = (
  type: 'hour' | 'minute' | 'second',
  width: number,
): string => {
  if (type === 'second') return '1px';
  return `${width / 2}px`;
};

const getHandTransition = (type: 'hour' | 'minute' | 'second'): string => {
  if (type === 'second') return 'none';
  return 'transform 0.1s ease-out';
};

const ClockHand: React.FC<HandProps> = ({
  angle,
  length,
  width,
  color,
  type,
}) => {
  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: getHandBorderRadius(type, width),
    zIndex: getHandZIndex(type),
    transition: getHandTransition(type),
  };

  return (
    <div style={handStyle} data-hand-type={type} />
  );
};

const AnalogClock: React.FC = () => {
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // This ensures the milliseconds update smoothly in the digital boxes.
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();
  const isoTime = now.toISOString();

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  const tickMarks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      return {
        id: i,
        angle,
        isHour,
        length: isHour ? 16 : 8,
        width: isHour ? 4 : 2,
      };
    });
  }, []);

  const numbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i === 0 ? 12 : i;
      const angle = i * 30;
      const radian = (angle - 90) * (Math.PI / 180);
      const radius = 35;
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      return {
        num,
        x,
        y,
      };
    });
  }, []);

  return (
    <div style={styles.container}>
      {/* <div style={styles.videoOverlay} /> */}
      <video
        style={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <div style={styles.timeWrapper}>
        <time dateTime={isoTime} style={styles.digitalTime}>
          <span>{String(hours).padStart(2, '0')[0]}</span>
          <span>{String(hours).padStart(2, '0')[1]}</span>
          <span style={{ opacity: 0.5 }}>:</span>
          <span>{String(minutes).padStart(2, '0')[0]}</span>
          <span>{String(minutes).padStart(2, '0')[1]}</span>
          <span style={{ opacity: 0.5 }}>:</span>
          <span>{String(seconds).padStart(2, '0')[0]}</span>
          <span>{String(seconds).padStart(2, '0')[1]}</span>
        </time>
      </div>
    </div>
  );
};

export default AnalogClock;
