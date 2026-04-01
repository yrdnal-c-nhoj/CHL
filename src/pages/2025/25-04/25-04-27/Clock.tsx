import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import type { CSSProperties } from 'react';
import coinGif from '@/assets/images/2025/25-04/25-04-27/coin.gif';
import spinWebp from '@/assets/images/2025/25-04/25-04-27/spin.webp';

// Component Props interface
interface SpinningCoinClockProps {
  // No props required for this component
}

const SpinningCoinClock: React.FC<SpinningCoinClockProps> = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(`coin-clock-${Date.now()}`);
  const fontName = `CoinClockFont-${componentId.current}`;

  // Font loading configuration (memoized) - no custom fonts needed to avoid network errors
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const updateClock = useCallback((): void => {
    const clock = clockRef.current;
    if (!clock) return;

    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const hourDeg = hours * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    const hourHand = clock.querySelector('.hour-hand') as HTMLElement;
    const minuteHand = clock.querySelector('.minute-hand') as HTMLElement;
    const secondHand = clock.querySelector('.second-hand') as HTMLElement;

    if (hourHand) {
      hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }
    if (minuteHand) {
      minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    }
    if (secondHand) {
      secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    }
  }, [currentTime]);

  useEffect(() => {
    // Update clock immediately and then every second
    updateClock();
    const interval = setInterval(updateClock, 1000);
    
    return () => clearInterval(interval);
  }, [updateClock]);

  return (
    <div
      style={{
        backgroundColor: '#060606',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        margin: 0,
        perspective: '100vw',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        decoding="async"
        loading="lazy"
        src={coinGif}
        alt="coin background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <div
        ref={clockRef}
        id="clock"
        style={{
          width: '80vh',
          height: '80vh',
          borderRadius: '50%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'spin 7s linear infinite',
        }}
      >
        <div
          className="hour-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            backgroundColor: '#d3ad62',
            width: '0.6vw',
            height: '12vw',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="minute-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            backgroundColor: '#d3ad62',
            width: '0.4vw',
            height: '16vw',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="second-hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            backgroundColor: '#d3ad62',
            width: '0.2vw',
            height: '18vw',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="center"
          style={{
            width: '8vh',
            height: '8vh',
            backgroundImage: `url(${spinWebp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        ></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          background-color: #d3ad62;
        }

        .hour-hand {
          width: 0.6vw;
          height: 12vw;
          transform: translateX(-50%);
        }

        .minute-hand {
          width: 0.4vw;
          height: 16vw;
          transform: translateX(-50%);
        }

        .second-hand {
          width: 0.2vw;
          height: 18vw;
          transform: translateX(-50%);
        }

        .number {
          font-family: cursive,
          position: absolute;
          font-size: 6.2vw;
          color: #d3ad62;
          text-align: center;
          width: auto;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default SpinningCoinClock;
