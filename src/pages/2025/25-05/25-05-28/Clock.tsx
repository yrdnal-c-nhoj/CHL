import React, { useEffect, useRef } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import circleFont from '../../../../assets/fonts/25-05-28-circle.ttf';

const Clock: React.FC = () => {
  const fontConfigs = [{ fontFamily: 'circle-local', fontUrl: circleFont }];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  
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

  const getHandStyle = (angleVar: string, color: string, width: string) => ({
    stroke: color,
    strokeWidth: width,
    strokeLinecap: 'round' as const,
    transform: `rotate(var(${angleVar}))`,
    transformOrigin: '50px 50px',
    transition: 'none',
    willChange: 'transform',
  });

  const renderClock = (id: string, positionStyle: React.CSSProperties) => (
    <div 
      key={id} 
      style={{ 
        ...positionStyle, 
        position: 'absolute', 
        width: '0px', 
        height: '0px', 
        overflow: 'visible',
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        style={{ 
          overflow: 'visible', 
          width: clockSize, 
          height: clockSize,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Clock Face Ring */}
        <circle cx="50" cy="50" r="45" style={{ stroke: '#9de2ac', strokeWidth: '0.1', fill: 'transparent', opacity: 0.2 }} />
        
        {/* Numbers and Ticks */}
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <line x1="50" y1="5" x2="50" y2="8" style={{ stroke: '#9de2ac', strokeWidth: '0.4' }} />
            <text 
              x="50" 
              y="14" 
              style={{ 
                fontSize: '5px', 
                fill: '#9de2ac', 
                textAnchor: 'middle', 
                dominantBaseline: 'middle', 
                transform: `rotate(-${i * 30} 50 14)`,
                fontFamily: 'circle-local, sans-serif'
              }}
            >
              {i === 0 ? 12 : i}
            </text>
          </g>
        ))}

        {/* HANDS */}
        
        {/* Hour Hand (Yellow) - Traditional length */}
        <line x1="50" y1="50" x2="50" y2="22" style={getHandStyle('--hour-angle', '#f9d63a', '1.8')} />
        
        {/* Minute Hand (Blue) - Traditional length */}
        <line x1="50" y1="50" x2="50" y2="10" style={getHandStyle('--min-angle', '#1147ea', '1.2')} />
        
        {/* Second Hand (Red) - Extended across viewport 
            The y2 value of -1000 ensures it clears the screen from any corner.
        */}
        <line x1="50" y1="50" x2="50" y2="-1000" style={getHandStyle('--sec-angle', '#f00', '0.4')} />
        
        {/* Center Pin */}
        <circle cx="50" cy="50" r="1.5" fill="#333" />
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
      }}
    >
      {/* 10% Inset corner clocks */}
      {renderClock('tl', { top: '10%', left: '10%' })}
      {renderClock('tr', { top: '10%', left: '90%' })}
      {renderClock('bl', { top: '90%', left: '10%' })}
      {renderClock('br', { top: '90%', left: '90%' })}
    </div>
  );
};

export default Clock;