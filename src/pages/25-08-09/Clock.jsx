import React, { useState, useEffect, useRef } from 'react';
import customFont from './box.ttf'; // ← your font file here

const RectangularAnalogClock = () => {
  // We'll store a Date object so digital time still displays in local time.
  const [now, setNow] = useState(new Date());
  const rafRef = useRef(null);
  const mountedRef = useRef(true);

  // Replace the interval with a requestAnimationFrame loop for smooth motion
  useEffect(() => {
    mountedRef.current = true;
    const loop = () => {
      if (!mountedRef.current) return;
      setNow(new Date());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Inject @font-face for the locally imported font and clean up on unmount
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

  // Compute continuous time fractions (includes milliseconds) for smooth angles
  const ms = now.getMilliseconds();
  const rawSeconds = now.getSeconds() + ms / 1000;
  const rawMinutes = now.getMinutes() + rawSeconds / 60;
  const rawHours = (now.getHours() % 12) + rawMinutes / 60;

  // Hand angles (degrees). Subtract 90 so 0 points up.
  const hourAngle = rawHours * 30 - 90;
  const minuteAngle = rawMinutes * 6 - 90;
  const secondAngle = rawSeconds * 6 - 90;

  // single shared color and stroke width for all hands
  const handColor = '#F3F4F7FF';
  const handStroke = 0.1;

  /**
   * Render a multi-angle (zig-zag / many bends) hand as a series of <line> segments.
   * This uses the provided continuous angle, so the hand moves smoothly.
   */
  const renderMultiAngleHand = (angleDeg, radialTotal, perpStep, segments, stroke, strokeWidth, keyPrefix, startPerpRight = true) => {
    if (segments < 3) segments = 3;
    if (segments % 2 === 0) segments += 1;

    const cx = 50;
    const cy = 50;
    const rad = angleDeg * Math.PI / 180;

    const radialCount = Math.ceil(segments / 2);
    const radialStep = radialTotal / radialCount;

    let perpSign = startPerpRight ? 1 : -1;

    const points = [];
    let curX = cx;
    let curY = cy;
    points.push([curX, curY]);

    for (let i = 0; i < segments; i++) {
      if (i % 2 === 0) {
        // radial step outward along base angle
        curX = curX + Math.cos(rad) * radialStep;
        curY = curY + Math.sin(rad) * radialStep;
      } else {
        // perpendicular step (alternate left/right each perp to zig-zag)
        const perpDir = rad + (Math.PI / 2) * perpSign;
        curX = curX + Math.cos(perpDir) * perpStep;
        curY = curY + Math.sin(perpDir) * perpStep;
        perpSign = -perpSign;
      }
      points.push([curX, curY]);
    }

    // Build <line> segments between consecutive points
    const lines = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      lines.push(
        <line
          key={`${keyPrefix}-seg-${i}`}
          x1={+x1.toFixed(4)}
          y1={+y1.toFixed(4)}
          x2={+x2.toFixed(4)}
          y2={+y2.toFixed(4)}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    }

    return <g key={keyPrefix}>{lines}</g>;
  };

  // Helper: compute tick edge positions so we can draw connecting lines
  const computeTickPositions = () => {
    const topXs = [];
    for (let i = 0; i < 15; i++) {
      topXs.push(10 + (i * 80 / 14));
    }

    const rightYs = [];
    for (let i = 1; i < 15; i++) {
      rightYs.push(5 + (i * 90 / 14));
    }

    const bottomXs = [];
    for (let i = 1; i < 15; i++) {
      bottomXs.push(90 - (i * 80 / 14));
    }

    const leftYs = [];
    for (let i = 1; i < 14; i++) {
      leftYs.push(95 - (i * 90 / 14));
    }

    return { topXs, rightYs, bottomXs, leftYs };
  };

  // Hour numbers placements
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
      { num: 11, x: 25, y: 20 }
    ];

    return positions.map(pos => (
      <text
        key={pos.num}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F0F2F5FF"
        style={{
          fontFamily: 'MyCustomFont, system-ui, sans-serif',
          fontSize: '0.6rem',
          userSelect: 'none',
        }}
      >
        {pos.num}
      </text>
    ));
  };

  // Tick marks around the square face (kept visible)
  const generateTicks = () => {
    const ticks = [];

    // Top edge ticks (0..14)
    for (let i = 0; i < 15; i++) {
      const x = 10 + (i * 80 / 14);
      ticks.push(
        <line
          key={`top-${i}`}
          x1={x}
          y1="5"
          x2={x}
          y2={i === 0 || i === 7 || i === 14 ? "12" : "8"}
          stroke="#F2F3F6FF"
          strokeWidth={0.2}
        />
      );
    }

    // Right edge ticks (1..14)
    for (let i = 1; i < 15; i++) {
      const y = 5 + (i * 90 / 14);
      ticks.push(
        <line
          key={`right-${i}`}
          x1="95"
          y1={y}
          x2={i === 7 ? "88" : "92"}
          y2={y}
          stroke="#EEEFF1FF"
          strokeWidth={0.2}
        />
      );
    }

    // Bottom edge ticks (1..14)
    for (let i = 1; i < 15; i++) {
      const x = 90 - (i * 80 / 14);
      ticks.push(
        <line
          key={`bottom-${i}`}
          x1={x}
          y1="95"
          x2={x}
          y2={i === 7 ? "88" : "92"}
          stroke="#F6F7FAFF"
          strokeWidth={0.2}
        />
      );
    }

    // Left edge ticks (1..13)
    for (let i = 1; i < 14; i++) {
      const y = 95 - (i * 90 / 14);
      ticks.push(
        <line
          key={`left-${i}`}
          x1="5"
          y1={y}
          x2={i === 7 ? "12" : "8"}
          y2={y}
          stroke="#F5F7FAFF"
          strokeWidth={0.2}
        />
      );
    }

    return ticks;
  };

  // Build connecting lines (verticals for top ticks, horizontals for left ticks)
  const renderConnectingTickLines = () => {
    const { topXs, leftYs } = computeTickPositions();
    const connects = [];

    // Vertical lines for each top tick x (top to bottom)
    // Slightly lighter and thin so it's subtle behind hands
    topXs.forEach((x, idx) => {
      connects.push(
        <line
          key={`v-${idx}`}
          x1={+x.toFixed(4)}
          y1={5}
          x2={+x.toFixed(4)}
          y2={95}
          stroke="#E8EBEFFF"
          strokeWidth={0.2}
          opacity={0.9}
        />
      );
    });

    // Horizontal lines for each left tick y (left to right)
    leftYs.forEach((y, idx) => {
      connects.push(
        <line
          key={`h-${idx}`}
          x1={5}
          y1={+y.toFixed(4)}
          x2={95}
          y2={+y.toFixed(4)}
          stroke="#E8EBEFFF"
          strokeWidth={0.2}
          opacity={0.9}
        />
      );
    });

    return connects;
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#052149',
        userSelect: 'none',
      }}
    >
      <svg
        width="100vw"
        height="100vh"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ backgroundColor: '#052149' }}
      >
        {/* Clock face background */}
        <rect width="100" height="100" fill="#052149" />

        {/* Tick marks */}
        {generateTicks()}

        {/* Connecting lines across the viewport (vertical + horizontal grid from ticks) */}
        {renderConnectingTickLines()}

        {/* Hour numbers */}
        {generateHourMarkers()}

        {/* CRAZY bigger hands - all the same color (handColor) and smooth motion */}
        {renderMultiAngleHand(hourAngle, 18 /* radialTotal */, 6 /* perpStep */, 11 /* segments */, handColor, handStroke, 'hour', true)}
        {renderMultiAngleHand(minuteAngle, 28 /* radialTotal */, 8 /* perpStep */, 15 /* segments */, handColor, handStroke, 'minute', false)}
        {renderMultiAngleHand(secondAngle, 36 /* radialTotal */, 10 /* perpStep */, 19 /* segments */, handColor, handStroke, 'second', true)}

        {/* Center dot (match hand color, slightly larger) */}
        <circle cx="50" cy="50" r="1.9" fill={handColor} />
      </svg>

      {/* Digital time display */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          borderRadius: 8,
          padding: '4px 8px',
          fontFamily: 'MyCustomFont, monospace',
          color: '#F4F6F8FF',
          fontSize: '1rem',
          userSelect: 'none',
        }}
      >
        {now.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default RectangularAnalogClock;
