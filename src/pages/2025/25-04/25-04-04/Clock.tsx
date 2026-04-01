import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';

import beat4 from '../../../../assets/images/2025/25-04/25-04-04/beat4.webp';
import tumblrImg from '../../../../assets/images/2025/25-04/25-04-04/heart.webp';

// Component Props interface
interface HeartbeatClockProps {
  // No props required for this component
}

// Clock refs interface
interface ClockRefs {
  hour: React.RefObject<HTMLDivElement | null>;
  minute: React.RefObject<HTMLDivElement | null>;
  second: React.RefObject<HTMLDivElement | null>;
}

// Style interfaces - simplified to avoid CSSProperties conflicts
type BodyStyle = React.CSSProperties;
type BackgroundStyle = React.CSSProperties;
type ClockStyle = React.CSSProperties;
type HandBaseStyle = React.CSSProperties;
type HourStyle = React.CSSProperties;
type MinuteStyle = React.CSSProperties;
type SecondStyle = React.CSSProperties;
type CenterDotStyle = React.CSSProperties;

const HeartbeatClock = () => {
  const clockRefs: ClockRefs = {
    hour: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    second: useRef<HTMLDivElement>(null),
  };

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const updateClock = useCallback((): void => {
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    const secDeg = seconds * 6;
    const minDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    if (clockRefs.second.current)
      clockRefs.second.current.style.transform = `rotate(${secDeg}deg)`;
    if (clockRefs.minute.current)
      clockRefs.minute.current.style.transform = `rotate(${minDeg}deg)`;
    if (clockRefs.hour.current)
      clockRefs.hour.current.style.transform = `rotate(${hourDeg}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  const bodyStyle: BodyStyle = {
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyle: BackgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${beat4})`,
    filter: 'saturate(300%)',
    backgroundRepeat: 'repeat',
    backgroundSize: '6%',
    zIndex: 0,
  };

  const clockStyle: ClockStyle = {
    position: 'relative',
    width: '50vh',
    height: '50vh',
    backgroundImage: `url(${tumblrImg})`,
    filter: 'hue-rotate(200deg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: '2px solid #eb0808',
    borderRadius: '50%',
    boxShadow: '0 0 400px #8e4dff',
    animation: 'heartbeat 1s infinite',
    transformOrigin: 'center',
    zIndex: 10,
  };

  const handBaseStyle: HandBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: 'rotate(0deg)',
  };

  const hourStyle: HourStyle = {
    ...handBaseStyle,
    width: '7px',
    height: '70px',
    background: 'transparent',
    borderRadius: '10px',
    boxShadow: '0 0 3px #F80D3CFF',
    zIndex: 3,
  };

  const minuteStyle: MinuteStyle = {
    ...handBaseStyle,
    width: '6px',
    height: '140px',
    background: 'transparent',
    borderRadius: '6px',
    boxShadow: '0 0 3px #F80D3CFF',
    zIndex: 2,
  };

  const secondStyle: SecondStyle = {
    ...handBaseStyle,
    width: '4px',
    height: '150px',
    background: '#588944FF',
    borderRadius: '4px',
    zIndex: 1,
  };

  const centerDotStyle: CenterDotStyle = {
    width: '30px',
    height: '30px',
    background: '#ff333f',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
    boxShadow: '0 0 5px #fff',
  };

  return (
    <>
      <style>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.2);
          }
          40% {
            transform: scale(0.95);
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(1.03);
          }
        }
      `}</style>
      <div style={bodyStyle}>
        <div style={backgroundStyle} />
        <div style={clockStyle}>
          <div ref={clockRefs.hour} style={hourStyle} />
          <div ref={clockRefs.minute} style={minuteStyle} />
          <div ref={clockRefs.second} style={secondStyle} />
          <div style={centerDotStyle} />
        </div>
      </div>
    </>
  );
};

export default HeartbeatClock;
