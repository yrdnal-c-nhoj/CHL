import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function ChaoticClock({ accentColor = '#ff6600' }) {
  const [time, setTime] = useState(0);

  // Static random positions memoized once
  const secondHandPositions = useMemo(() => 
    Array.from({ length: 125 }).map(() => ({
      offsetX: (Math.random() - 0.5) * 1.6,
      offsetY: (Math.random() - 0.5) * 1.6,
    })), []
  );

  const mainHandsPositions = useMemo(() =>
    Array.from({ length: 25 }).map(() => ({
      offsetX: (Math.random() - 0.5) * 1.6,
      offsetY: (Math.random() - 0.5) * 1.6,
    })), []
  );

  const extraSecondsConfig = useMemo(() =>
    Array.from({ length: 25 }).map(() => ({
      startX: (Math.random() - 0.5) * 1.6,
      startY: (Math.random() - 0.5) * 1.6,
      segmentCount: Math.floor(Math.random() * 10) + 8,
      maxSegmentLength: 0.05 + Math.random() * 0.15,
      strokeWidth: 0.5 + Math.random() * 1.5,
      baseColor: accentColor,
      phaseShift: Math.random() * Math.PI * 2,
      baseAngle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.5,
      fadeSpeed: 0.5 + Math.random() * 1.5,
      fadePhase: Math.random() * Math.PI * 2,
    })), [accentColor]
  );

  useEffect(() => {
    let rafId;
    const tick = () => {
      setTime(performance.now() / 1000);
      rafId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const now = new Date();
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = now.getHours() % 12 + min / 60;

  const radH = (Math.PI * 2 * (hr / 12)) - Math.PI / 2;
  const radM = (Math.PI * 2 * (min / 60)) - Math.PI / 2;
  const radS = (Math.PI * 2 * (sec / 60)) - Math.PI / 2;

  // Helper to build chaotic path d attribute on the fly
  const buildChaoticPath = (config) => {
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    let x = config.startX;
    let y = config.startY;
    const points = [];

    for (let j = 0; j < config.segmentCount; j++) {
      const segLength = config.maxSegmentLength * (0.5 + 0.5 * Math.sin(time * 2 + j + config.phaseShift));
      const angle = angles[Math.floor(Math.random() * 4)];
      x += Math.cos(angle) * segLength;
      y += Math.sin(angle) * segLength;
      points.push(`${x} ${y}`);
    }

    return `M ${config.startX} ${config.startY} L ${points.join(' L ')}`;
  };

  return (
    <svg
      viewBox="-2 -2 4 4"
      style={{ width: '400px', height: '400px', background: '#111', borderRadius: '50%' }}
    >
      {/* Clock face */}
      <circle cx="0" cy="0" r="1.98" stroke="#888" strokeWidth="0.02" fill="none" />

      {/* Chaotic hands */}
      {extraSecondsConfig.map((config, i) => {
        const d = buildChaoticPath(config);
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(time * config.fadeSpeed + config.fadePhase));
        const currentAngle = config.baseAngle + time * config.spinSpeed;
        return (
          <path
            key={`extra-${i}`}
            d={d}
            stroke={config.baseColor}
            strokeWidth={config.strokeWidth}
            opacity={opacity}
            fill="none"
            transform={`rotate(${(currentAngle * 180) / Math.PI})`}
          />
        );
      })}

      {/* Main hands */}
      {mainHandsPositions.map(({ offsetX, offsetY }, idx) => (
        <g key={`main-${idx}`} transform={`translate(${offsetX}, ${offsetY})`}>
          {/* Hour hand */}
          <path
            d="M 0 0 L 0.3 0 L 0.3 -0.15"
            stroke="#888fff"
            strokeWidth="0.05"
            fill="none"
            transform={`rotate(${(radH * 180) / Math.PI})`}
          />
          {/* Minute hand */}
          <path
            d="M 0 0 L 0.45 0 L 0.45 -0.1"
            stroke="#fff"
            strokeWidth="0.03"
            fill="none"
            transform={`rotate(${(radM * 180) / Math.PI})`}
          />
        </g>
      ))}

      {/* Second hands */}
      {secondHandPositions.map(({ offsetX, offsetY }, idx) => (
        <g
          key={`second-${idx}`}
          transform={`translate(${offsetX}, ${offsetY}) rotate(${(radS * 180) / Math.PI})`}
          opacity={0.6 + 0.4 * Math.sin((idx + time) * Math.PI)}
        >
          <path
            d="M 0 0 L 0.5 0 L 0.5 -0.05"
            stroke={accentColor}
            strokeWidth="0.015"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
}
