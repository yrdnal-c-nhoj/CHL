import React, { useState, useEffect, useCallback } from 'react';
import { useClockTime } from '@/hooks/useClockTime';
import { BackgroundGrid } from './BackgroundGrid'; // Import the extracted component

/**
 * TicTacToeClock component
 * This component displays a clock in a Tic-Tac-Toe grid style.
 */
export default function TicTacToeClock() {
  // Add viewport meta tag for mobile responsiveness
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content =
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no';
        document.head.appendChild(meta);
      }
    }
  }, []);

  const time = useClockTime();

  // Font is loaded by useSuspenseFontLoader in BackgroundGrid component

  const fontFamily = 'CustomClockFont, monospace';
  // This formatTime is specific to this clock and differs from the one in clockUtils.ts.
  // It's fine to keep it local if it's not reusable elsewhere, or move to a specific utility.
  const formatTime = useCallback((date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return {
      h1: Math.floor(displayHours / 10),
      h2: displayHours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
      ms1: 0, // Milliseconds not available with useClockTime
      ampm,
    };
  }, []);

  // Update display time when time changes
  const displayTime = formatTime(time);

  const clockContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    transition: 'opacity 0.3s ease-in-out',
    fontFamily: fontFamily,
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '1px',
    width: '90vmin',
    height: '90vmin',
    maxWidth: '500px',
    maxHeight: '500px',
    padding:
      'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
  };

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(24px, 25vmin, 120px)',
    color: '#00ff88',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    textAlign: 'center',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  // Memoize time values array to prevent unnecessary re-renders
  const timeValues = React.useMemo(
    () => [
      displayTime.h1,
      displayTime.h2,
      displayTime.m1,
      displayTime.m2,
      displayTime.s1,
      displayTime.s2,
      displayTime.ms1,
      displayTime.ampm.charAt(0),
      displayTime.ampm.charAt(1),
    ],
    [displayTime],
  );

  return (
    <BackgroundGrid>
      <div style={clockContainerStyle}>
        <div style={gridStyle}>
          {timeValues.map((value, index) => {
            const isEven = index % 2 === 0;
            const color = isEven ? '#ff4444' : '#4444ff';
            const shadowColor = isEven ? '255, 68, 68' : '68, 68, 255';

            return (
              <div
                key={index}
                style={{
                  ...cellStyle,
                  color,
                  textShadow: `0 0 10px rgba(${shadowColor}, 0.5)`,
                  willChange: 'transform',
                  transform: 'translateZ(0)', // Promote to own layer for better performance
                }}
                aria-hidden="true"
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
    </BackgroundGrid>
  );
}
