import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import mobyFont from '../../../../assets/fonts/2025/25-04-03-moby.ttf?url';
import waves from '../../../../assets/images/2025/25-04/25-04-03/waves.gif';

// Component Props interface
interface MobyDickClockProps {
  // No props required for this component
}

// Center avoid size interface
interface CenterAvoidSize {
  width: number;
  height: number;
}

// Clock position interface
interface ClockPosition {
  x: number;
  y: number;
  fontSize: number;
  opacity: number;
}

const MobyDickClock = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'MobyClockFont',
      fontUrl: mobyFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  const clockRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(`moby-clock-${Date.now()}`);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  // Returns a random coordinate avoiding center rectangle
  const getRandomPosAvoidCenter = useCallback((max: number, avoidStart: number, avoidEnd: number): number => {
    let pos: number;
    do {
      pos = Math.random() * max;
    } while (pos > avoidStart && pos < avoidEnd);
    return pos;
  }, []);

  // Calculate new clock position
  const calculateNewPosition = useCallback((): ClockPosition => {
    const centerAvoidSize: CenterAvoidSize = { width: 300, height: 200 };

    const x = getRandomPosAvoidCenter(
      window.innerWidth,
      (window.innerWidth - centerAvoidSize.width) / 2,
      (window.innerWidth + centerAvoidSize.width) / 2,
    );
    const y = getRandomPosAvoidCenter(
      window.innerHeight,
      (window.innerHeight - centerAvoidSize.height) / 2,
      (window.innerHeight + centerAvoidSize.height) / 2,
    );

    const fontSize = 2 + Math.random() * 6; // rem
    const opacity = Math.random() * 0.7 + 0.3;

    return { x, y, fontSize, opacity };
  }, [getRandomPosAvoidCenter]);

  // Update clock display
  const updateClockDisplay = useCallback((position: ClockPosition): void => {
    const clock = clockRef.current;
    if (!clock) return;

    // Update time
    clock.textContent = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });

    // Apply styles with smooth transition
    clock.style.transition =
      'transform 2s ease-in-out, font-size 2s ease-in-out, opacity 2s ease-in-out';
    clock.style.transform = `translate(${position.x}px, ${position.y}px)`;
    clock.style.fontSize = `${position.fontSize}rem`;
    clock.style.opacity = position.opacity.toString();
  }, [currentTime]);

  useEffect(() => {
    // Create scoped CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-0.5rem); }
      }
    `;
    document.head.appendChild(style);

    let animationFrameId: number;
    let lastMoveTime: number = 0;
    let nextMoveDelay: number = 2000 + Math.random() * 2000;
    let isInitialized: boolean = false;

    // Initial position: place clock off-screen so first move slides it in
    const clock = clockRef.current;
    if (clock) {
      clock.style.position = 'absolute';
      clock.style.top = '0';
      clock.style.left = '0';
      clock.style.opacity = '0';
      clock.style.transform = 'translate(-500px, -500px)';
    }

    const animate = (timestamp: number): void => {
      if (!isInitialized) {
        // Initialize with first move
        updateClockDisplay(calculateNewPosition());
        isInitialized = true;
        lastMoveTime = timestamp;
      } else if (timestamp - lastMoveTime >= nextMoveDelay) {
        // Move clock
        updateClockDisplay(calculateNewPosition());
        lastMoveTime = timestamp;
        nextMoveDelay = 2000 + Math.random() * 2000;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, [calculateNewPosition, updateClockDisplay]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#727B7BFF',
        filter: 'brightness(300%) contrast(40%)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <div
        ref={clockRef}
        style={{
          fontFamily: 'MobyClockFont, cursive',
          color: '#a1b4b4',
          textShadow:
            '#ced4d4 0.1rem 0.1rem 0.2rem, #000404 -0.1rem -0.1rem 0.9rem',
          position: 'absolute',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
      <img
        decoding="async"
        loading="lazy"
        src={waves}
        alt="waves"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 6,
          opacity: 0.6,
          filter: 'brightness(180%) contrast(110%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default MobyDickClock;
