import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import type { CSSProperties } from 'react';

// Import assets at top level for bundler optimization
import scorpImage from '../../../assets/images/25-05/25-05-02/sand.webp?url';
import hourHandImage from '../../../assets/images/25-05/25-05-02/giphy1-ezgif.com-rotate(1).gif?url';
import minuteHandImage from '../../../assets/images/25-05/25-05-02/giphy1-ezgif.com-rotate(2).gif?url';
import secondHandImage from '../../../assets/images/25-05/25-05-02/giphy1-ezgif.com-rotate(3).gif?url';
import fontFile from '../../../assets/fonts/25-05-02-scorp.ttf?url';

// Component Props interface
interface ClockProps {
  // No props required for this component
}

// Clock number interface
interface ClockNumber {
  value: number;
  rotation: number;
}

// Hand position interface
interface HandPosition {
  degrees: number;
  scale: number;
}

const Clock: React.FC<ClockProps> = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'Scorpion',
      fontUrl: fontFile,
    }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const clockRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Calculate hand positions
  const calculateHandPositions = useCallback((): {
    hour: HandPosition;
    minute: HandPosition;
    second: HandPosition;
  } => {
    const now = currentTime || new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Add subtle jitter for realistic movement
    const jitter = () => Math.random() * 2 - 1;
    
    const secondDegrees = seconds * 6 + jitter() * 0.3;
    const minuteDegrees = minutes * 6 + seconds / 10 + jitter() * 0.02;
    const hourDegrees = hours * 30 + minutes / 2 + jitter() * 0.005;

    // Calculate scaling effects
    const secondScale = 1 + Math.sin((seconds * Math.PI) / 30) * 0.05;
    const minuteScale = 1 + Math.sin((minutes * Math.PI) / 30) * 0.03;
    const hourScale = 1 + Math.sin((hours * Math.PI) / 6) * 0.02;

    return {
      hour: { degrees: hourDegrees, scale: hourScale },
      minute: { degrees: minuteDegrees, scale: minuteScale },
      second: { degrees: secondDegrees, scale: secondScale },
    };
  }, [currentTime]);

  // Update clock hands using requestAnimationFrame
  const updateClockHands = useCallback(() => {
    const positions = calculateHandPositions();
    
    const secondHand = document.querySelector('.second-hand') as HTMLElement;
    const minuteHand = document.querySelector('.minute-hand') as HTMLElement;
    const hourHand = document.querySelector('.hour-hand') as HTMLElement;

    if (secondHand) {
      secondHand.style.transform = `translate(-50%, -100%) rotate(${positions.second.degrees}deg) scaleY(${positions.second.scale})`;
    }
    if (minuteHand) {
      minuteHand.style.transform = `translate(-50%, -100%) rotate(${positions.minute.degrees}deg) scaleY(${positions.minute.scale})`;
    }
    if (hourHand) {
      hourHand.style.transform = `translate(-50%, -100%) rotate(${positions.hour.degrees}deg) scaleY(${positions.hour.scale})`;
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateClockHands);
  }, [calculateHandPositions]);

  // Start animation loop
  useEffect(() => {
    updateClockHands();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateClockHands]);

  // Generate clock numbers
  const numbers = useMemo<ClockNumber[]>(() => 
    Array.from({ length: 12 }, (_, index): ClockNumber => ({
      value: index + 1,
      rotation: index * 30,
    }))
  , []);

  // Styles
  const containerStyle: CSSProperties = {
    margin: 0,
    background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)',
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const clockContainerStyle: CSSProperties = {
    position: 'relative',
    width: '90vmin',
    height: '90vmin',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  };

  const backgroundStyle: CSSProperties = {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    opacity: 0.7,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
  };

  const numberStyle = (rotation: number): CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-40vmin) rotate(-${rotation}deg)`,
    fontSize: '5vmin',
    fontFamily: 'Scorpion, serif',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    fontWeight: 'bold',
  });

  const hourHandStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '8vmin',
    height: '25vmin',
    transformOrigin: '50% 100%',
    zIndex: 4,
  };

  const minuteHandStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '6vmin',
    height: '35vmin',
    transformOrigin: '50% 100%',
    zIndex: 5,
  };

  const secondHandStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '4vmin',
    height: '40vmin',
    transformOrigin: '50% 100%',
    zIndex: 6,
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  return (
    <div style={containerStyle}>
      <img
        decoding="async"
        loading="lazy"
        src={scorpImage}
        alt="Background"
        style={backgroundStyle}
      />

      <div style={clockContainerStyle} ref={clockRef}>
        {/* Clock numbers */}
        {numbers.map((num) => (
          <div
            key={num.value}
            style={numberStyle(num.rotation)}
          >
            {num.value}
          </div>
        ))}

        {/* Hour Hand */}
        <div
          className="hour-hand"
          style={hourHandStyle}
        >
          <img
            decoding="async"
            loading="lazy"
            src={hourHandImage}
            alt="Hour Hand"
            style={imageStyle}
          />
        </div>

        {/* Minute Hand */}
        <div
          className="minute-hand"
          style={minuteHandStyle}
        >
          <img
            decoding="async"
            loading="lazy"
            src={minuteHandImage}
            alt="Minute Hand"
            style={imageStyle}
          />
        </div>

        {/* Second Hand */}
        <div
          className="second-hand"
          style={secondHandStyle}
        >
          <img
            decoding="async"
            loading="lazy"
            src={secondHandImage}
            alt="Second Hand"
            style={imageStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Clock;
