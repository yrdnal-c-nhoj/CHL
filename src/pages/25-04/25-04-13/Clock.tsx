import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import backgroundImage from '../../../assets/images/25-04/25-04-13/pattern.jpeg';
import pizzaFace from '../../../assets/images/25-04/25-04-13/pie.webp';
import hourSlice from '../../../assets/images/25-04/25-04-13/s3.webp';
import minuteSlice from '../../../assets/images/25-04/25-04-13/s2.webp';
import secondSlice from '../../../assets/images/25-04/25-04-13/s1.webp';

// Component Props interface
interface PizzaClockProps {
  // No props required for this component
}

// Clock refs interface
interface ClockRefs {
  hour: React.RefObject<HTMLDivElement | null>;
  minute: React.RefObject<HTMLDivElement | null>;
  second: React.RefObject<HTMLDivElement | null>;
}

const PizzaClock = () => {
  const clockRefs: ClockRefs = {
    hour: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    second: useRef<HTMLDivElement>(null),
  };

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();

  const updateClockSmooth = useCallback((): void => {
    const ms = currentTime.getMilliseconds();
    const s = currentTime.getSeconds() + ms / 1000;
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;

    const hourDeg = h * 30;
    const minuteDeg = m * 6;
    const secondDeg = s * 6;

    if (clockRefs.hour.current)
      clockRefs.hour.current.style.transform = `rotate(${hourDeg}deg)`;
    if (clockRefs.minute.current)
      clockRefs.minute.current.style.transform = `rotate(${minuteDeg}deg)`;
    if (clockRefs.second.current)
      clockRefs.second.current.style.transform = `rotate(${secondDeg}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClockSmooth();
  }, [updateClockSmooth]);

  return (
    <div
      style={{
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        decoding="async"
        loading="lazy"
        src={backgroundImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(2.5)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '80vmin', // vmin ensures a square that fits within viewport
          height: '80vmin',
          aspectRatio: '1',
          backgroundImage: `url(${pizzaFace})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: '50%',
          filter: 'saturate(1.6)',
          zIndex: 1,
        }}
      >
        <div
          ref={clockRefs.minute}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        >
          <img
            decoding="async"
            loading="lazy"
            src={minuteSlice}
            alt="Minute Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '55%',
              opacity: 0.8,
              filter: 'brightness(190%) contrast(120%)',
            }}
          />
        </div>

        <div
          ref={clockRefs.hour}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 9,
          }}
        >
          <img
            decoding="async"
            loading="lazy"
            src={hourSlice}
            alt="Hour Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '34%',
              opacity: 0.8,
              filter: 'brightness(190%) contrast(200%)',
            }}
          />
        </div>

        <div
          ref={clockRefs.second}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <img
            decoding="async"
            loading="lazy"
            src={secondSlice}
            alt="Second Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '50%',
              filter: 'brightness(290%) contrast(190%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PizzaClock;
