import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import type { CSSProperties } from 'react';
import lava1 from '../../../../assets/images/2025/25-04/25-04-24/lava.webp';
import lava2 from '../../../../assets/images/2025/25-04/25-04-24/vp2OVr.gif';
import lava3 from '../../../../assets/images/2025/25-04/25-04-24/lava.webp';
import lavaFont from '../../../../assets/fonts/2025/25-04-24-lava.ttf?url';

// Time state interface
interface TimeState {
  hours: string;
  minutes: string;
}

// Component Props interface
interface LavaClockProps {
  // No props required for this component
}

const LavaClock: React.FC<LavaClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'Rubik Burned',
      fontUrl: lavaFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const [time, setTime] = useState<TimeState>({ hours: '00', minutes: '00' });
  const [showGif, setShowGif] = useState<boolean>(false);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  const updateClock = useCallback((): void => {
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    setTime({ hours, minutes });
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setShowGif(true);
    }, 100);

    const timeout2 = setTimeout(() => {
      setFadeOut(true);
    }, 100);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  // Properly typed styles
  const screenStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundColor: 'rgb(205, 15, 15)',
    opacity: fadeOut ? 0 : 0.5,
    transition: 'opacity 1s ease',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  const bgImageStyle1: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '170vw',
    height: '100vh',
    objectFit: 'cover',
    opacity: '90%',
    zIndex: 4,
    display: showGif ? 'block' : 'none',
  };

  const bgImageStyle2: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '160vh',
    objectFit: 'cover',
    opacity: '60%',
    transform: 'scaleX(-1)',
    zIndex: 3,
  };

  const bgImageStyle3: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    filter: 'saturate(150%)',
    opacity: '50%',
    zIndex: 1,
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  };

  const timePartStyle: CSSProperties = {
    color: 'rgb(250, 9, 58)',
    textShadow:
      '#9f3406 -0.1rem -0.1rem 0.5rem, #efc107 0.1rem 0.1rem 0.4rem, #ef0707 1.3rem 1.3rem 1.7rem, #ff1104 -1.1rem 1.3rem 1.8rem, #ef0707 1.3rem -1.3rem 1.8rem, #dc2b03 -1.3rem -1.1rem 1.9rem, #f7390f -0.1rem -0.1rem 0.8rem, #ef2906 0.3rem 3.3rem 2.3rem',
    fontFamily: 'Rubik Burned, system-ui',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '7rem',
    lineHeight: '9rem',
  };

  return (
    <div
      style={{
        backgroundColor: '#f70f07',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={screenStyle}></div>

      <img
        decoding="async"
        loading="lazy"
        src={lava2}
        style={bgImageStyle3}
        alt="Lava Layer 3"
      />
      <img
        decoding="async"
        loading="lazy"
        src={lava1}
        style={bgImageStyle2}
        alt="Lava Layer 2"
      />
      <img
        decoding="async"
        loading="lazy"
        src={lava3}
        style={bgImageStyle1}
        alt="Lava Layer 1"
      />

      <div style={containerStyle}>
        <div style={timePartStyle}>{time.hours}</div>
        <div style={timePartStyle}>{time.minutes}</div>
      </div>
    </div>
  );
};

export default LavaClock;
