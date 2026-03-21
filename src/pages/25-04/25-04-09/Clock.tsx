import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import roomImage from '../../../assets/images/25-04/25-04-09/room.webp';

// Component Props interface
interface EmptyRoomClockProps {
  // No props required for this component
}

// Window size interface
interface WindowSize {
  width: number;
  height: number;
}

// Clock refs interface
interface ClockRefs {
  hour: React.RefObject<HTMLDivElement | null>;
  minute: React.RefObject<HTMLDivElement | null>;
  second: React.RefObject<HTMLDivElement | null>;
}

const EmptyRoomClock = () => {
  const clockRefs: ClockRefs = {
    hour: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    second: useRef<HTMLDivElement>(null),
  };

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateClock = useCallback((): void => {
    const hour = currentTime.getHours() % 12;
    const minute = currentTime.getMinutes();
    const second = currentTime.getSeconds();

    const hourDeg = (hour + minute / 60) * 30;
    const minuteDeg = (minute + second / 60) * 6;
    const secondDeg = second * 6;

    if (clockRefs.hour.current)
      clockRefs.hour.current.style.transform = `translate(-50%) rotate(${hourDeg}deg)`;
    if (clockRefs.minute.current)
      clockRefs.minute.current.style.transform = `translate(-50%) rotate(${minuteDeg}deg)`;
    if (clockRefs.second.current)
      clockRefs.second.current.style.transform = `translate(-50%) rotate(${secondDeg}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  const clockSize = Math.min(windowSize.width, windowSize.height) * 0.4;

  // Distance from bottom of viewport
  const clockBottom = windowSize.height * 0.2; // 10% from bottom
  const clockLeft = windowSize.width * 0.6; // center horizontally

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <img
        decoding="async"
        loading="lazy"
        src={roomImage}
        alt="Room background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: clockSize,
          height: clockSize,
          backgroundImage: `url(${roomImage})`,
          backgroundSize: 'cover',
          filter: 'brightness(0.92)',
          backgroundPosition: 'center',
          border: '2px solid #a19f63',
          borderRadius: '50%',
          position: 'absolute',
          bottom: clockBottom,
          left: clockLeft,
          transform: 'translateX(-50%) rotateX(-9deg) rotateZ(3deg)',
          transformOrigin: 'bottom center',
          boxShadow: `
            1px 1px rgba(191, 32, 32, 0.5),
            -1px 1px rgba(191, 32, 32, 0.5),
            -1px -1px rgba(191, 32, 32, 0.5),
            1px -1px rgba(191, 32, 32, 0.5),
            -10px 15px 30px rgba(0, 0, 0, 0.5)
          `,
          zIndex: 1,
          transition:
            'width 0.3s ease, height 0.3s ease, bottom 0.3s ease, left 0.3s ease',
        }}
      >
        <div
          ref={clockRefs.hour}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.023,
            height: clockSize * 0.21,
            background: '#333',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          ref={clockRefs.minute}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.019,
            height: clockSize * 0.356,
            background: '#666',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          ref={clockRefs.second}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.0044,
            height: clockSize * 0.5,
            background: 'rgb(186, 41, 41)',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: clockSize * 0.022,
            height: clockSize * 0.022,
            background: '#333',
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -(clockSize * 0.045),
            left: clockSize * 0.044,
            width: clockSize * 0.35,
            height: clockSize * 0.045,
            background: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(10px)',
            borderRadius: '50%',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default EmptyRoomClock;
