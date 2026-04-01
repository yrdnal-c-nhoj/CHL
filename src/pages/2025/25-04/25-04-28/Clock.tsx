import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';
import SkaterFont from '@/assets/fonts/2025/25-04-28-Skater.ttf?url';

const fontFaceStyle = `
  @font-face {
    font-family: 'Skater';
    src: url(${SkaterFont}) format('truetype');
  }
`;

const grayShades = [
  '#747070',
  '#767D7C',
  '#33312D',
  '#4D4E55',
  '#DAD3DB',
  '#282838',
  '#171417',
  '#d6d6d6',
  '#262616',
  '#161414',
];

// Clock impression interface
interface ClockImpression {
  id: number;
  time: string;
  style: CSSProperties;
}

// Component Props interface
interface ClockAppProps {
  // No props required for this component
}

const ClockApp: React.FC<ClockAppProps> = () => {
  const [currentTime, setCurrentTime] = useState<string>('00:00:00');
  const [impressions, setImpressions] = useState<ClockImpression[]>([]);
  const [impressionCount, setImpressionCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'Skater',
      fontUrl: SkaterFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const clockTime = useSecondClock();

  const getRandomPosition = useCallback((): { x: number; y: number } => {
    const x = Math.random() * (100 - 38.5);
    const y = Math.random() * (100 - 43.125);
    return { x, y };
  }, []);

  const getRandomRotation = useCallback((): { rotationX: number; rotationY: number; rotationZ: number } => {
    return {
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      rotationZ: Math.random() * 360,
    };
  }, []);

  const getRandomGrayShade = useCallback((): string => {
    const shade = grayShades[Math.floor(Math.random() * grayShades.length)];
    return shade || '#000000';
  }, []);

  const getRandomSize = useCallback((): string => {
    const size = Math.random() * (6.25 - 0.625) + 0.625;
    return `${size}rem`;
  }, []);

  const getRandomSkew = useCallback((): string => {
    const skewX = Math.random() * 60 - 30;
    const skewY = Math.random() * 60 - 30;
    return `skew(${skewX}deg, ${skewY}deg)`;
  }, []);

  const addClockImpression = useCallback((): void => {
    if (impressionCount >= 1000) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const timeString = `${String(clockTime.getHours()).padStart(2, '0')}:${String(clockTime.getMinutes()).padStart(2, '0')}:${String(clockTime.getSeconds()).padStart(2, '0')}`;
    setCurrentTime(timeString);

    const { x, y } = getRandomPosition();
    const { rotationX, rotationY, rotationZ } = getRandomRotation();

    const newImpression: ClockImpression = {
      id: Date.now() + Math.random(), // Unique ID using timestamp + random
      time: timeString,
      style: {
        position: 'absolute',
        left: `${x}vw`,
        top: `${y}vh`,
        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) ${getRandomSkew()}`,
        fontSize: getRandomSize(),
        color: getRandomGrayShade(),
      },
    };

    setImpressions((prev) => [...prev, newImpression]);
    setImpressionCount((prev) => prev + 1);
  }, [clockTime, getRandomPosition, getRandomRotation, getRandomSkew, getRandomSize, getRandomGrayShade]);

  useEffect(() => {
    // Start after 0.5s
    timeoutRef.current = setTimeout(() => {
      addClockImpression(); // First one
      intervalRef.current = setInterval(addClockImpression, 250); // Then every 0.25s
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const bodyStyle = {
    fontFamily: "'Skater', sans-serif",
    height: '100dvh',
    width: '100vw',
    backgroundColor: '#929dae',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <>
      <style>{fontFaceStyle}</style>
      <div style={bodyStyle}>
        {/* Current time hidden offscreen or removed if not needed */}
        {impressions.map((impression) => (
          <div
            key={impression.id}
            className="clock-impression"
            style={impression.style}
          >
            {impression.time}
          </div>
        ))}
      </div>
    </>
  );
};

export default ClockApp;
