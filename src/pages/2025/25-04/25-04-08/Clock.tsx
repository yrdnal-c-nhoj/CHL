import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import sageFontUrl from '@/assets/fonts/2025/25-04-08-sage.ttf?url';

// Component Props interface
interface TripleCactusClockProps {
  // No props required for this component
}

// Clock refs interface
interface ClockRefs {
  hours: React.RefObject<HTMLDivElement | null>;
  minutes: React.RefObject<HTMLDivElement | null>;
  seconds: React.RefObject<HTMLDivElement | null>;
  milliseconds: React.RefObject<HTMLDivElement | null>;
}

const TripleCactusClock = () => {
  const clockRefs: ClockRefs = {
    hours: useRef<HTMLDivElement>(null),
    minutes: useRef<HTMLDivElement>(null),
    seconds: useRef<HTMLDivElement>(null),
    milliseconds: useRef<HTMLDivElement>(null),
  };

  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'CactusClockFont',
      fontUrl: sageFontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();
  const componentId = useRef(`cactus-clock-${Date.now()}`);

  const setDigits = useCallback((container: HTMLDivElement | null, text: string): void => {
    if (!container) return;
    container.innerHTML = '';
    for (let char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      Object.assign(span.style, {
        color: '#f3f586',
        fontSize: '12vh',
        lineHeight: '8vh',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        fontFamily: 'CactusClockFont, sans-serif',
      });
      container.appendChild(span);
    }
  }, []);

  const updateClock = useCallback((): void => {
    setDigits(clockRefs.hours.current, String(currentTime.getHours()).padStart(2, '0'));
    setDigits(clockRefs.minutes.current, String(currentTime.getMinutes()).padStart(2, '0'));
    setDigits(clockRefs.seconds.current, String(currentTime.getSeconds()).padStart(2, '0'));
    setDigits(
      clockRefs.milliseconds.current,
      String(currentTime.getMilliseconds()).padStart(3, '0'),
    );
  }, [currentTime, setDigits]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        height: '100%',
        overflow: 'hidden',
        background: '#01151d',
      }}
    >
      <style>{`
        @keyframes skyCycle {
          0% { background: #3bbdf0; }
          15% { background: #8fbee2; }
          25% { background: #e8a30d; }
          50% { background: #fd1d1d; }
          60% { background: #b43a87; }
          75% { background: #833ab4; }
          90% { background: #02027f; }
          100% { background: #010102; }
        }
        @keyframes sunVertical {
          0% { top: 10%; opacity: 1; }
          45% { top: 50%; opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column',
          animation: 'skyCycle 20s ease-in-out infinite alternate',
        }}
      >
        {/* Sun / Clock */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'sunVertical 20s linear infinite alternate',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'CactusClockFont',
            }}
          >
            <div
              style={{ display: 'flex', gap: '1.3vh', margin: '1vh 0' }}
              ref={clockRefs.hours}
            ></div>
            <div
              style={{ display: 'flex', gap: '1.3vh', margin: '1vh 0' }}
              ref={clockRefs.minutes}
            ></div>
            <div
              style={{ display: 'flex', gap: '1.3vh', margin: '1vh 0' }}
              ref={clockRefs.seconds}
            ></div>
            <div
              style={{ display: 'flex', gap: '1.3vh', margin: '1vh 0' }}
              ref={clockRefs.milliseconds}
            ></div>
          </div>
        </div>

        {/* Mountains */}
        <div
          style={{
            position: 'absolute',
            bottom: '40vh',
            width: '100%',
            height: 0,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            gap: '1vw',
            opacity: 0.6,
          }}
        >
          {['#48638f', '#707d93', '#48638f'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 0,
                height: 0,
                borderLeft: '15vw solid transparent',
                borderRight: '15vw solid transparent',
                borderBottom: `15vh solid ${color}`,
              }}
            />
          ))}
        </div>

        {/* Ground and Cacti */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: '27vh',
            width: '100%',
            background: '#c5a770',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15vw',
              marginBottom: '8vh',
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '2vw',
                  height: '15vh',
                  background: '#228b22',
                  borderRadius: '1vw',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '1vw',
                    height: '6vh',
                    background: '#228b22',
                    borderRadius: '50% 50% 0 0',
                    left: '-1vw',
                    top: '20%',
                    transform: 'rotate(-40deg)',
                    transformOrigin: 'bottom right',
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    width: '1vw',
                    height: '6vh',
                    background: '#228b22',
                    borderRadius: '50% 50% 0 0',
                    right: '-1vw',
                    top: '10%',
                    transform: 'rotate(40deg)',
                    transformOrigin: 'bottom left',
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripleCactusClock;
