import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import cakeGif from '../../../assets/images/25-04/25-04-16/cake.gif';
import minuteImg from '../../../assets/images/25-04/25-04-16/200w.webp';
import hourImg from '../../../assets/images/25-04/25-04-16/2hhj.webp';
import secondImg from '../../../assets/images/25-04/25-04-16/20.webp';
import confGif from '../../../assets/images/25-04/25-04-16/conf.gif';
import confJpg from '../../../assets/images/25-04/25-04-16/conf.jpg';

// Component Props interface
interface BirthdayCakeClockProps {
  // No props required for this component
}

// Clock refs interface
interface ClockRefs {
  hourHand: React.RefObject<HTMLDivElement | null>;
  minuteHand: React.RefObject<HTMLDivElement | null>;
  secondHand: React.RefObject<HTMLDivElement | null>;
}

const BirthdayCakeClock = () => {
  const clockRefs: ClockRefs = {
    hourHand: useRef<HTMLDivElement>(null),
    minuteHand: useRef<HTMLDivElement>(null),
    secondHand: useRef<HTMLDivElement>(null),
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

    if (clockRefs.hourHand.current)
      clockRefs.hourHand.current.style.transform = `rotate(${hourDeg}deg)`;
    if (clockRefs.minuteHand.current)
      clockRefs.minuteHand.current.style.transform = `rotate(${minuteDeg}deg)`;
    if (clockRefs.secondHand.current)
      clockRefs.secondHand.current.style.transform = `rotate(${secondDeg}deg)`;
  }, [currentTime]);

  useEffect(() => {
    updateClockSmooth();
  }, [updateClockSmooth]);

  const bodyStyle = {
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    // Removed overflow: hidden to prevent clipping
  };

  const clockWrapperStyle = {
    position: 'relative',
    width: '88vmin', // Increased size to accommodate 110% circle
    aspectRatio: '1 / 1',
  };

  const clockStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'saturate(1.6)',
    zIndex: 6,
  };

  const circleStyle = {
    position: 'absolute',
    top: '-5%', // Adjusted to center the 110% circle
    left: '-5%',
    width: '110%',
    height: '110%',
    borderRadius: '50%',
    animation: 'rotateCounterClockwise 30s linear infinite',
    zIndex: 2,
  };

  const circleImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    filter: 'saturate(300%)',
  };

  const handBaseStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
    pointerEvents: 'none',
    zIndex: 9,
  };

  const handImgStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -100%)',
  };

  const hourImgStyle = {
    ...handImgStyle,
    height: '34vh',
    filter: 'contrast(120%) brightness(100%)',
    zIndex: 9,
  };

  const minuteImgStyle = {
    ...handImgStyle,
    height: '44vh',
    zIndex: 6,
  };

  const secondImgStyle = {
    ...handImgStyle,
    height: '40vh',
  };

  const fullPageImageStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 6,
    filter: 'saturate(300%)',
  };

  const fullPageImage2Style = {
    ...fullPageImageStyle,
    zIndex: 2,
    filter: 'saturate(200%)',
  };

  return (
    <>
      <style>
        {`
          @keyframes rotateCounterClockwise {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
        `}
      </style>

      <div style={bodyStyle}>
        <div style={clockWrapperStyle}>
          <div style={clockStyle}>
            <div style={circleStyle}>
              <img
                decoding="async"
                loading="lazy"
                src={cakeGif}
                alt="Rotating Image"
                style={circleImgStyle}
              />
            </div>

            <div
              ref={clockRefs.minuteHand}
              style={{ ...handBaseStyle, zIndex: 9 }}
              className="minute"
            >
              <img
                decoding="async"
                loading="lazy"
                src={minuteImg}
                alt="Minute hand"
                style={minuteImgStyle}
              />
            </div>

            <div
              ref={clockRefs.hourHand}
              style={{ ...handBaseStyle, zIndex: 9 }}
              className="hour"
            >
              <img
                decoding="async"
                loading="lazy"
                src={hourImg}
                alt="Hour hand"
                style={hourImgStyle}
              />
            </div>

            <div ref={clockRefs.secondHand} style={handBaseStyle} className="second">
              <img
                decoding="async"
                loading="lazy"
                src={secondImg}
                alt="Second hand"
                style={secondImgStyle}
              />
            </div>
          </div>
        </div>

        <img
          decoding="async"
          loading="lazy"
          src={confGif}
          alt="Confetti gif"
          style={fullPageImageStyle}
        />
        <img
          decoding="async"
          loading="lazy"
          src={confJpg}
          alt="Confetti background"
          style={fullPageImage2Style}
        />
      </div>
    </>
  );
};

export default BirthdayCakeClock;
