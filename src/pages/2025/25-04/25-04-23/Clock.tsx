import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import type { CSSProperties } from 'react';
import pirateHook from '../../../../assets/images/2025/25-04/25-04-23/hook.webp';
import pirateCutlass from '../../../../assets/images/2025/25-04/25-04-23/pirate_foam.gif';
import pirateKnife from '../../../../assets/images/2025/25-04/25-04-23/cut.gif';
import pirateOverlay from '../../../../assets/images/2025/25-04/25-04-23/sasasd.gif';
import pirateBackground from '../../../../assets/images/2025/25-04/25-04-23/water.webp';

// Component Props interface
interface PirateClockProps {
  // No props required for this component
}

const PirateClock: React.FC<PirateClockProps> = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  
  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const romanNumerals = [
    'XII',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
  ];

  const placeNumbers = useCallback((): void => {
    const clock = clockRef.current;
    if (!clock) return;

    clock.querySelectorAll('.number').forEach((el) => el.remove());

    const clockWidth = clock.offsetWidth;
    const radius = clockWidth * 0.45;
    const center = clockWidth / 2;

    romanNumerals.forEach((num, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const number = document.createElement('div');

      Object.assign(number.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(2.4rem, 4vw, 2.5rem)', // Responsive font size
        color: '#c29b0e',
        textShadow: 'rgb(14, 2, 26) 1px 1px 5px',
        textAlign: 'center',
        width: '4vw',
        height: '4vw',
        lineHeight: '4vw',
        minWidth: '30px',
        minHeight: '30px',
        animation: `float ${3.5 + Math.random()}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 2}s`,
        fontFamily: 'Metamorphous, serif',
        zIndex: '10',
      });

      number.textContent = num;
      number.className = 'number';
      clock.appendChild(number);
    });
  }, []);

  const updateClock = useCallback((): void => {
    const hour = currentTime.getHours() % 12;
    const min = currentTime.getMinutes();
    const sec = currentTime.getSeconds();

    const hourDeg = hour * 30 + min * 0.5;
    const minuteDeg = min * 6;
    const secondDeg = sec * 6;

    const hourHand = document.querySelector('.hour') as HTMLElement;
    const minuteHand = document.querySelector('.minute') as HTMLElement;
    const secondHand = document.querySelector('.second') as HTMLElement;

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
    placeNumbers();
    updateClock();

    const handleResize = () => placeNumbers();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [placeNumbers, updateClock]);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
        }
        html {
          width: 100%;
          height: 100%;
        }
        @keyframes float {
          0%   { transform: translate(-50%, -50%) translateY(0); }
          50%  { transform: translate(-50%, -50%) translateY(-1.9vw); }
          100% { transform: translate(-50%, -50%) translateY(0); }
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100dvh',
          width: '100vw',
          margin: 0,
          padding: 0,
          backgroundColor: '#1c4dd3',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${pirateOverlay})`,
            backgroundSize: '15% 15%',
            backgroundRepeat: 'repeat',
            opacity: 0.4,
            zIndex: 1,
          }}
        />
        <img
          decoding="async"
          loading="lazy"
          src={pirateBackground}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          ref={clockRef}
          style={{
            position: 'relative',
            width: 'min(80vw, 80vh)',
            height: 'min(80vw, 80vh)',
            borderRadius: '50%',
            fontFamily: 'Metamorphous, serif',
            zIndex: 2,
          }}
        >
          <img
            decoding="async"
            loading="lazy"
            className="hand hour"
            src={pirateHook}
            alt="Hour hand"
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom center',
              transform: 'translateX(-50%)',
              width: '20%',
              filter: 'contrast(0.8)',
              zIndex: 5,
            }}
          />
          <img
            decoding="async"
            loading="lazy"
            className="hand minute"
            src={pirateCutlass}
            alt="Minute hand"
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom center',
              transform: 'translateX(-50%)',
              width: '18%',
              filter: 'saturate(0.8)',
              zIndex: 3,
            }}
          />
          <img
            decoding="async"
            loading="lazy"
            className="hand second"
            src={pirateKnife}
            alt="Second hand"
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom center',
              transform: 'translateX(-50%)',
              width: '28%',
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PirateClock;
