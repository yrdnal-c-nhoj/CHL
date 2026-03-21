import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import type { CSSProperties } from 'react';
import lightningImg from '../../../assets/images/25-05/25-05-01/lightning.webp';
import innerFontTTF from '../../../assets/fonts/25-05-01-Inner.ttf?url';

// Time state interface
interface TimeState {
  hours: string;
  minutes: string;
}

// Component Props interface
interface SlowLightningClockProps {
  // No props required for this component
}

const SlowLightningClock: React.FC<SlowLightningClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'InnerFont',
      fontUrl: innerFontTTF,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const [time, setTime] = useState<TimeState>({ hours: '--', minutes: '--' });
  const clockRef = useRef<HTMLDivElement>(null);
  const flashWhiteRef = useRef<HTMLDivElement>(null);
  const flashBlackRef = useRef<HTMLDivElement>(null);

  // Update clock time whenever currentTime changes
  const updateClock = useCallback((): void => {
    setTime({
      hours: String(currentTime.getHours()).padStart(2, '0'),
      minutes: String(currentTime.getMinutes()).padStart(2, '0'),
    });
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  // Clock shaking animation
  const triggerClockEffect = useCallback((): void => {
    if (!clockRef.current) return;
    clockRef.current.classList.add('animate-clock');
    setTimeout(() => {
      if (clockRef.current) {
        clockRef.current.classList.remove('animate-clock');
      }
    }, 330);
  }, []);

  // Flash effect for white or black flash
  const triggerFlash = useCallback((type: 'white' | 'black'): void => {
    const el = type === 'white' ? flashWhiteRef.current : flashBlackRef.current;
    if (!el) return;
    el.style.opacity = '1';
    setTimeout(() => {
      if (el) el.style.opacity = '0';
    }, 100);
  }, []);

  // Loop random effects
  useEffect(() => {
    let isMounted = true;
    function randomEffectsLoop() {
      if (!isMounted) return;

      const rand = Math.random();

      if (rand < 0.02) {
        triggerClockEffect();
      }

      if (rand > 0.9) {
        triggerFlash(Math.random() > 0.5 ? 'white' : 'black');
      }

      setTimeout(randomEffectsLoop, 500);
    }
    randomEffectsLoop();
    return () => {
      isMounted = false;
    };
  }, []);

  // Inline styles (converted from your CSS)
  const styles = {
    '@font-face': {
      fontFamily: 'Inner',
      src: `url(${innerFontTTF}) format('truetype')`,
    },
    body: {
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'black',
    },
    bgimage: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      height: '100dvh',
      width: '100vw',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      opacity: 0.9,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    bgimage1: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      height: '100vh',
      width: '100vw',
      transform: 'scaleX(-1)',
      top: '50%',
      left: '50%',
      transformOrigin: 'center',
      translate: '-50%, -50%',
      zIndex: 2,
      opacity: 0.9,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    clockContainer: {
      position: 'relative',
      zIndex: 7,
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    clock: {
      color: 'rgb(244, 243, 230)',
      fontFamily: "'Inner', sans-serif",
      display: 'flex',
      fontSize: '80vh',
      userSelect: 'none',
    },
    clockSpan: {
      display: 'block',
    },
    flashWhite: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999,
      pointerEvents: 'none',
      backgroundColor: 'rgb(236, 241, 218)',
      opacity: 0,
      transition: 'opacity 0.1s ease-out',
    },
    flashBlack: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999,
      pointerEvents: 'none',
      backgroundColor: 'rgb(7, 5, 19)',
      opacity: 0,
      transition: 'opacity 0.1s ease-out',
    },
    // ShakeJump animation keyframes are best handled in CSS
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Inner';
          src: url('${innerFontTTF}') format('truetype');
        }
        @keyframes shakeJump {
          0%, 100% {
            transform: translate(-50%, 190%) translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-50%, -50%) translate(-10px, -20px) rotate(-2deg);
          }
          40% {
            transform: translate(-50%, 50%) translate(10px, 10px) rotate(3deg);
          }
          60% {
            transform: translate(80%, -50%) translate(-15px, 5px) rotate(-1deg);
          }
          80% {
            transform: translate(-50%, -80%) translate(5px, -15px) rotate(2deg);
          }
        }
        .animate-clock {
          animation: shakeJump 0.33s ease-in-out;
        }
        @media (max-width: 600px) {
          #clock {
            flex-direction: column;
            align-items: center;
            gap: 2vh;
            font-size: 50vw !important;
          }
        }
      `}</style>

      {/* Background images */}
      <img
        decoding="async"
        loading="lazy"
        src={lightningImg}
        alt="lightning"
        style={styles.bgimage}
        draggable={false}
      />
      <img
        decoding="async"
        loading="lazy"
        src={lightningImg}
        alt="lightning mirrored"
        style={{
          ...styles.bgimage,
          transform: 'translate(-50%, -50%) scaleX(-1)',
          zIndex: 2,
        }}
        draggable={false}
      />

      <div style={styles.clockContainer}>
        <div id="clock" ref={clockRef} style={styles.clock}>
          <span style={styles.clockSpan} id="hours">
            {time.hours}
          </span>
          <span style={styles.clockSpan} id="minutes">
            {time.minutes}
          </span>
        </div>
      </div>

      <div ref={flashWhiteRef} style={styles.flashWhite} />
      <div ref={flashBlackRef} style={styles.flashBlack} />
    </>
  );
}

export default SlowLightningClock;
