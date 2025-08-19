import React, { useState, useEffect, useRef } from 'react';
import customFont from './box.ttf'; // Custom font file

const RectangularAnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const rafRef = useRef(null);

  // Animation loop for updating time
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
      rafRef.current = requestAnimationFrame(updateTime);
    };
    rafRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Inject custom font
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'rect-clock-custom-font';
    style.innerHTML = `
      @font-face {
        font-family: 'MyCustomFont';
        src: url(${customFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById('rect-clock-custom-font');
      if (el) el.remove();
    };
  }, []);

  // Calculate hand angles
  const calculateHandAngles = () => {
    const ms = time.getMilliseconds();
    const rawSeconds = time.getSeconds() + ms / 1000;
    const rawMinutes = time.getMinutes() + rawSeconds / 60;
    const rawHours = (time.getHours() % 12) + rawMinutes / 60;
    return {
      hour: rawHours * 30 - 90,
      minute: rawMinutes * 6 - 90,
      second: rawSeconds * 6 - 90,
    };
  };

  // Render multi-angle clock hand
  const renderMultiAngleHand = (
    angleDeg,
    radialTotal,
    perpStep,
    segments,
    stroke,
    strokeWidth,
    keyPrefix,
    startPerpRight = true
  ) => {
    const segmentsAdjusted = Math.max(3, segments % 2 === 0 ? segments + 1 : segments);
    const cx = 50;
    const cy = 50;
    const rad = (angleDeg * Math.PI) / 180;
    const radialCount = Math.ceil(segmentsAdjusted / 2);
    const radialStep = radialTotal / radialCount;
    let perpSign = startPerpRight ? 1 : -1;

    const points = [[cx, cy]];
    let curX = cx;
    let curY = cy;

    for (let i = 0; i < segmentsAdjusted; i++) {
      if (i % 2 === 0) {
        curX += Math.cos(rad) * radialStep;
        curY += Math.sin(rad) * radialStep;
      } else {
        const perpDir = rad + (Math.PI / 2) * perpSign;
        curX += Math.cos(perpDir) * perpStep;
        curY += Math.sin(perpDir) * perpStep;
        perpSign = -perpSign;
      }
      points.push([curX, curY]);
    }

    return (
      <g key={keyPrefix}>
        {points.slice(0, -1).map(([x1, y1], i) => (
          <line
            key={`${keyPrefix}-seg-${i}`}
            x1={x1.toFixed(4)}
            y1={y1.toFixed(4)}
            x2={points[i + 1][0].toFixed(4)}
            y2={points[i + 1][1].toFixed(4)}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  };

  // Compute tick positions for grid lines
  const computeTickPositions = () => {
    const topXs = Array.from({ length: 15 }, (_, i) => 10 + (i * 80) / 14);
    const leftYs = Array.from({ length: 13 }, (_, i) => 95 - ((i + 1) * 90) / 14);
    return { topXs, leftYs };
  };

  // Render grid lines
  const renderGridLines = () => {
    const { topXs, leftYs } = computeTickPositions();
    return [
      ...topXs.map((x, idx) => (
        <line
          key={`v-${idx}`}
          x1={x.toFixed(4)}
          y1={5}
          x2={x.toFixed(4)}
          y2={95}
          stroke="#F3F4F7FF"
          strokeWidth={0.4}
        />
      )),
      ...leftYs.map((y, idx) => (
        <line
          key={`h-${idx}`}
          x1={5}
          y1={y.toFixed(4)}
          x2={95}
          y2={y.toFixed(4)}
          stroke="#F3F4F7FF"
          strokeWidth={0.4}
          opacity={0.9}
        />
      )),
    ];
  };

  // Generate hour markers
  const generateHourMarkers = () => {
    const positions = [
      { num: 12, x: 50, y: 15 },
      { num: 1, x: 75, y: 20 },
      { num: 2, x: 85, y: 35 },
      { num: 3, x: 85, y: 50 },
      { num: 4, x: 85, y: 65 },
      { num: 5, x: 75, y: 80 },
      { num: 6, x: 50, y: 85 },
      { num: 7, x: 25, y: 80 },
      { num: 8, x: 15, y: 65 },
      { num: 9, x: 15, y: 50 },
      { num: 10, x: 15, y: 35 },
      { num: 11, x: 25, y: 20 },
    ];

    return positions.map((pos) => (
      <text
        key={pos.num}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F3F4F7FF"
        filter="url(#multiShadow)"
        style={{
          fontFamily: 'MyCustomFont, system-ui, sans-serif',
          fontSize: '0.8rem',
          userSelect: 'none',
        }}
      >
        {pos.num}
      </text>
    ));
  };

  const { hour, minute, second } = calculateHandAngles();
  const handColor = '#F3F4F7FF';
  const handStroke = 0.4;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <svg
        width="100vw"
        height="100vh"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          backgroundColor: '#460260FF',
          backgroundImage:
            'linear-gradient(#592dc1 1px, transparent 1px), linear-gradient(to right, #592dc1 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      >
        <defs>
          <filter id="multiShadow">
            <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.53" floodColor="#540579FF" />
            <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.65" floodColor="#480462FF" />
          </filter>
        </defs>

        <rect width="100" height="100" fill="transparent" />
        {renderGridLines()}
        {generateHourMarkers()}
        {renderMultiAngleHand(hour, 18, 6, 11, handColor, handStroke, 'hour', true)}
        {renderMultiAngleHand(minute, 28, 8, 15, handColor, handStroke, 'minute', false)}
        {renderMultiAngleHand(second, 36, 10, 19, handColor, handStroke, 'second', true)}
        <circle cx="50" cy="50" r="0.4" fill={handColor} />
      </svg>
    </div>
  );
};

export default RectangularAnalogClock;
