import React, { useEffect, useState, useRef } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import circleFont from '../../../assets/fonts/25-05-28-circle.ttf';

const Clock: React.FC = () => {
  const fontConfigs = [{ fontFamily: 'circle-local', fontUrl: circleFont }];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  
  // Ref to hold the container to update CSS variables directly
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fontsLoaded) return;

    let animationFrameId: number;

    const updateAngles = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      if (containerRef.current) {
        // Set CSS variables on the parent container
        // This avoids querying the DOM for 12 different hand elements
        containerRef.current.style.setProperty('--hour-angle', `${h * 30}deg`);
        containerRef.current.style.setProperty('--min-angle', `${m * 6}deg`);
        containerRef.current.style.setProperty('--sec-angle', `${s * 6}deg`);
      }

      animationFrameId = requestAnimationFrame(updateAngles);
    };

    updateAngles();
    return () => cancelAnimationFrame(animationFrameId);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const clockSize = '82vh';

  // Helper for reused hand styles
  const getHandStyle = (angleVar: string, color: string, width: string, length: number) => ({
    stroke: color,
    strokeWidth: width,
    strokeLinecap: 'round' as const,
    transform: `rotate(var(${angleVar}))`,
    transformOrigin: '50px 50px',
    transition: 'none', // Critical: do not animate the transition, let RAF handle it
    willChange: 'transform', // Promotes to its own layer
  });

  const renderClock = (id: string, positionStyle: React.CSSProperties) => (
    <div key={id} style={{ ...positionStyle, position: 'absolute', width: clockSize, height: clockSize }}>
      <svg viewBox="0 0 100 100" style={{ overflow: 'visible', width: '100%', height: '100%' }}>
        <circle cx="50" cy="50" r="45" style={{ stroke: '#9de2ac', strokeWidth: '0.05', fill: 'transparent' }} />
        
        {/* Ticks and Numbers */}
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <line x1="50" y1="5" x2="50" y2="10" style={{ stroke: '#9de2ac', strokeWidth: '0.1' }} />
            <text x="50" y="15" style={{ fontSize: '2px', fill: '#9de2ac', textAnchor: 'middle', dominantBaseline: 'middle', transform: `rotate(-${i * 30} 50 15)` }}>
              {i === 0 ? 12 : i}
            </text>
          </g>
        ))}

        {/* Hands using CSS Variables */}
        <line x1="50" y1="50" x2="50" y2="22" style={getHandStyle('--hour-angle', '#f9d63a', '1.5', 28)} />
        <line x1="50" y1="50" x2="50" y2="9" style={getHandStyle('--min-angle', '#1147ea', '1', 41)} />
        <line x1="50" y1="50" x2="50" y2="5" style={getHandStyle('--sec-angle', '#f00', '0.2', 45)} />
        
        <circle cx="50" cy="50" r="2" fill="#333" />
      </svg>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{
        margin: 0,
        overflow: 'hidden',
        background: `linear-gradient(to bottom, #775011, #746c78)`,
        height: '100dvh',
        width: '100vw',
        position: 'relative',
        fontFamily: 'circle-local, sans-serif',
      }}
    >
      {/* Clock positioning logic simplified */}
      {[
        { top: '-41vh', left: '-41vh' },
        { top: '-41vh', right: '-41vh' },
        { bottom: '-41vh', left: '-41vh' },
        { bottom: '-41vh', right: '-41vh' },
      ].map((pos, i) => renderClock(`clock-${i}`, pos))}
    </div>
  );
};

export default Clock;