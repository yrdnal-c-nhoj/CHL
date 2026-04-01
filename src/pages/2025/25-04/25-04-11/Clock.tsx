import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import hand1 from '../../../../assets/images/2025/25-04/25-04-11/hand1.webp';
import hand2 from '../../../../assets/images/2025/25-04/25-04-11/hand2.webp';
import hand3 from '../../../../assets/images/2025/25-04/25-04-11/hand3.webp';
import inst from '../../../../assets/images/2025/25-04/25-04-11/inst.webp';

// Component Props interface
interface BoringClockProps {
  // No props required for this component
}

// Clock refs interface
interface ClockRefs {
  second: React.RefObject<HTMLImageElement | null>;
  minute: React.RefObject<HTMLImageElement | null>;
  hour: React.RefObject<HTMLImageElement | null>;
}

// Style interfaces - simplified to avoid CSSProperties conflicts
type BodyStyle = React.CSSProperties;
type ImageStyle = React.CSSProperties;
type ClockStyle = React.CSSProperties;
type HandStyle = React.CSSProperties;
type HourHandStyle = React.CSSProperties;
type MinuteHandStyle = React.CSSProperties;
type SecondHandStyle = React.CSSProperties;

const BoringClock = () => {
  const clockRefs: ClockRefs = {
    second: useRef<HTMLImageElement>(null),
    minute: useRef<HTMLImageElement>(null),
    hour: useRef<HTMLImageElement>(null),
  };

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();

  const updateClock = useCallback((): void => {
    const milliseconds = currentTime.getMilliseconds();
    const seconds = currentTime.getSeconds() + milliseconds / 1000;
    const minutes = currentTime.getMinutes() + seconds / 60;
    const hours = currentTime.getHours() + minutes / 60;

    const secondDegrees = (seconds / 60) * 360 + 90;
    const minuteDegrees = (minutes / 60) * 360 + 90;
    const hourDegrees = (hours / 12) * 360 + 90;

    if (clockRefs.second.current)
      clockRefs.second.current.style.transform = `rotate(${secondDegrees}deg)`;
    if (clockRefs.minute.current)
      clockRefs.minute.current.style.transform = `rotate(${minuteDegrees}deg)`;
    if (clockRefs.hour.current)
      clockRefs.hour.current.style.transform = `rotate(${hourDegrees}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  return (
    <div style={styles.body}>
      <img
        decoding="async"
        loading="lazy"
        src={inst}
        alt="border"
        style={styles.borer2}
      />

      <div style={styles.clock}>
        <img
          decoding="async"
          loading="lazy"
          src={hand2}
          alt="second hand"
          ref={clockRefs.second}
          style={{ ...styles.hand, ...styles.secondHand }}
        />
        <img
          decoding="async"
          loading="lazy"
          src={hand1}
          alt="hour hand"
          ref={clockRefs.hour}
          style={{ ...styles.hand, ...styles.hourHand }}
        />
        <img
          decoding="async"
          loading="lazy"
          src={hand3}
          alt="minute hand"
          ref={clockRefs.minute}
          style={{ ...styles.hand, ...styles.minHand }}
        />
      </div>
    </div>
  );
};

export default BoringClock;

const styles = {
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    width: '100vw',
    backgroundColor: 'rgb(154, 110, 53)',
    position: 'relative',
    overflow: 'hidden',
  },

  borer2: {
    position: 'absolute',
    opacity: 0.5,
    filter: 'contrast(130%) brightness(200%)',
    width: '180vw',
    height: '140vh',
    zIndex: 1,
    pointerEvents: 'none',
  },
  clock: {
    width: '80vw',
    height: '80vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  hand: {
    position: 'absolute',
    top: '40%',
    right: '50%',
    transformOrigin: '100%',
    transform: 'rotate(90deg)',
    zIndex: 9,
    opacity: 0.5,
    transition: 'transform 0s linear',
  },
  hourHand: {
    zIndex: 8,
    width: '6rem',
    height: '5rem',
    filter: 'contrast(170%) brightness(200%)',
  },
  minHand: {
    zIndex: 6,
    width: '10rem',
    height: '4rem',
    filter: 'contrast(170%) brightness(200%)',
    transform: 'scaleX(-1)',
  },
  secondHand: {
    zIndex: 7,
    width: '14rem',
    height: '5rem',
    filter: 'contrast(170%) brightness(200%)',
  },
};
