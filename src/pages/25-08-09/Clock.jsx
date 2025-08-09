import React, { useEffect, useRef, useState } from "react";
import myFont from "./box.ttf";

export default function RectangularAnalogClock({
  showSeconds = true,
  faceGradient = "linear-gradient(135deg, #080C04FF, #0E1812FF)",
  accentColor = "#EEE7E9FF",
  fontFamilyName = "CustomFont",
}) {
  const hourPathRef = useRef(null);
  const minutePathRef = useRef(null);
  const secondPathRef = useRef(null);
  const extraSecondRefs = useRef([]);
  const rafRef = useRef(null);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Config for 25 jagged hands, each with unique smooth phase shifts
  const [extraSecondsConfig] = useState(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      segmentCount: 10,
      maxSegmentLength: 0.3, // 30% of minHalf for big size
      strokeWidth: 2,
      baseColor: accentColor,
      phaseShift: (i / 25) * Math.PI * 2, // evenly spaced phases for smooth non-sync motion
    }))
  );

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url(${myFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [fontFamilyName]);

  const degToRad = (deg) => (deg - 90) * (Math.PI / 180);

  // Generates a smooth right-angle path for a hand,
  // where each segment length oscillates smoothly with sine waves.
  const generateSmoothJaggedPath = (cx, cy, baseAngleRad, minHalf, config, time) => {
    const { segmentCount, maxSegmentLength, phaseShift } = config;

    let points = [[cx, cy]];
    let currentX = cx;
    let currentY = cy;

    for (let i = 0; i < segmentCount; i++) {
      // Each segment length oscillates smoothly between 0.5 and 1 times maxSegmentLength,
      // phased differently so all segments move independently but smoothly.
      const segmentPhase = time + phaseShift + i;
      const lengthFrac = 0.5 + 0.5 * Math.sin(segmentPhase);
      const segmentLength = lengthFrac * maxSegmentLength * minHalf;

      // Alternate direction: even index = horizontal segment, odd = vertical segment
      if (i % 2 === 0) {
        // Move horizontally: direction depends on sign of cos(baseAngle)
        const dir = Math.sign(Math.cos(baseAngleRad)) || 1;
        currentX += dir * segmentLength;
      } else {
        // Move vertically: direction depends on sign of sin(baseAngle)
        const dir = Math.sign(Math.sin(baseAngleRad)) || 1;
        currentY += dir * segmentLength;
      }
      points.push([currentX, currentY]);
    }

    // Build SVG path string with only right angles (H and V commands)
    let pathD = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [px, py] = points[i];
      const [ppx, ppy] = points[i - 1];
      if (px === ppx) {
        pathD += ` V ${py.toFixed(2)}`;
      } else if (py === ppy) {
        pathD += ` H ${px.toFixed(2)}`;
      } else {
        pathD += ` L ${px.toFixed(2)} ${py.toFixed(2)}`;
      }
    }
    return pathD;
  };

  // Simple straight hand path with 2 right angles (horizontal then vertical)
  const makeSimpleRightAnglePath = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return `M ${x1} ${y1} H ${x1 + dx} V ${y1 + dy}`;
  };

  const updateHands = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    const { width, height } = size;
    const cx = width / 2;
    const cy = height / 2;
    const halfW = width / 2;
    const halfH = height / 2;
    const minHalf = Math.min(halfW, halfH);

    // Calculate main hour, minute, and second hand positions
    const radH = degToRad((h / 12) * 360);
    const hourX = cx + Math.cos(radH) * minHalf * 0.35;
    const hourY = cy + Math.sin(radH) * minHalf * 0.35;

    const radM = degToRad((m / 60) * 360);
    const minuteX = cx + Math.cos(radM) * minHalf * 0.6;
    const minuteY = cy + Math.sin(radM) * minHalf * 0.6;

    const radS = degToRad((s / 60) * 360);
    const vxS = Math.cos(radS);
    const vyS = Math.sin(radS);

    // Distance to edge for main second hand
    const safeDiv = (num, denom) =>
      Math.abs(denom) < 1e-9 ? Infinity : num / Math.abs(denom);
    const distToVertical = safeDiv(halfW, vxS);
    const distToHorizontal = safeDiv(halfH, vyS);
    const lenSecond = Math.min(distToVertical, distToHorizontal);
    const secondX = cx + vxS * lenSecond;
    const secondY = cy + vyS * lenSecond;

    // Update hour, minute, and main second hand paths (simple right angle lines)
    if (hourPathRef.current) {
      hourPathRef.current.setAttribute(
        "d",
        makeSimpleRightAnglePath(cx, cy, hourX, hourY)
      );
    }
    if (minutePathRef.current) {
      minutePathRef.current.setAttribute(
        "d",
        makeSimpleRightAnglePath(cx, cy, minuteX, minuteY)
      );
    }
    if (secondPathRef.current && showSeconds) {
      secondPathRef.current.setAttribute(
        "d",
        makeSimpleRightAnglePath(cx, cy, secondX, secondY)
      );
    }

    // Slow time factor for smooth, slow movement of jagged hands
    const time = now.getTime() / 2000; // 0.5 Hz approx

    // Update all 25 jagged hands smoothly
    extraSecondsConfig.forEach((config, i) => {
      const pathEl = extraSecondRefs.current[i];
      if (!pathEl) return;

      // Base angle slightly offset per hand for independent direction
      // Offset ±20° from main second hand angle for variety
      const offsetAngle =
        radS + ((i / 25 - 0.5) * (20 * Math.PI) / 180);

      const pathD = generateSmoothJaggedPath(cx, cy, offsetAngle, minHalf, config, time);

      pathEl.setAttribute("d", pathD);
      pathEl.setAttribute("stroke", config.baseColor);
      pathEl.setAttribute("stroke-width", config.strokeWidth.toString());
      pathEl.setAttribute("stroke-linecap", "square");
      pathEl.setAttribute("fill", "none");
      pathEl.style.opacity = "0.8";
    });
  };

  useEffect(() => {
    const loop = () => {
      updateHands();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, showSeconds, extraSecondsConfig]);

  // Number positions omitted for brevity (use your existing getNumberPositions function)

  const getNumberPositions = () => {
    const numberFontSize = Math.round(Math.min(size.width, size.height) * 0.15);

    const halfW = size.width / 2;
    const halfH = size.height / 2;

    const hourTickLength = Math.min(
      25,
      Math.max(8, Math.min(size.width, size.height) * 0.04)
    );

    const textGap = 15;

    return Array.from({ length: 12 }, (_, i) => {
      const num = i === 0 ? 12 : i;
      const angleDeg = i * 30;
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const vx = Math.cos(rad);
      const vy = Math.sin(rad);

      const safe = (num, denom) =>
        Math.abs(denom) < 1e-9 ? Infinity : num / Math.abs(denom);
      const scaleX = safe(halfW, vx);
      const scaleY = safe(halfH, vy);
      const edgeDist = Math.min(scaleX, scaleY);

      const tickTipDist = edgeDist;

      const halfTextHeight = numberFontSize / 2;
      const halfTextWidth = (num.toString().length * numberFontSize) / 3.2;

      const marginFromEdge =
        Math.max(halfTextHeight, halfTextWidth) + textGap + hourTickLength;

      const labelDist = tickTipDist - marginFromEdge;

      const x = halfW + vx * labelDist;
      const y = halfH + vy * labelDist;

      return { num, x, y, fontSize: numberFontSize };
    });
  };

  const numbers = getNumberPositions();

  const wrapperStyle = {
    position: "fixed",
    inset: 0,
  };

  const rectWidth = size.width / 15;
  const rectHeight = size.height / 15;

  const gridCells = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      gridCells.push({ row, col });
    }
  }

  return (
    <div style={wrapperStyle}>
      <svg
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        preserveAspectRatio="none"
      >
        {/* Background grid */}
        {gridCells.map(({ row, col }) => {
          const isBlack = (row + col) % 2 === 0;
          return (
            <rect
              key={`${row}-${col}`}
              x={col * rectWidth}
              y={row * rectHeight}
              width={rectWidth}
              height={rectHeight}
              fill={isBlack ? "#2DE411FF" : "#505F53FF"}
            />
          );
        })}

        {/* Gradient overlay */}
        <rect
          x="0"
          y="0"
          width={size.width}
          height={size.height}
          fill={faceGradient}
          opacity="0.8"
        />

        <rect
          x="0"
          y="0"
          width={size.width}
          height={size.height}
          fill="transparent"
          stroke={accentColor}
          strokeWidth="2"
        />

        {/* Clock ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const angleDeg = i * 6;
          const rad = (angleDeg - 90) * (Math.PI / 180);
          const vx = Math.cos(rad);
          const vy = Math.sin(rad);
          const safe = (num, denom) =>
            Math.abs(denom) < 1e-9 ? Infinity : num / Math.abs(denom);
          const dx = safe(size.width / 2, vx);
          const dy = safe(size.height / 2, vy);
          const distToEdge = Math.min(dx, dy);
          const innerDist =
            distToEdge -
            (isHour
              ? Math.min(
                  25,
                  Math.max(8, Math.min(size.width, size.height) * 0.04)
                )
              : Math.min(
                  12,
                  Math.max(4, Math.min(size.width, size.height) * 0.02)
                ));
          const x1 = size.width / 2 + vx * innerDist;
          const y1 = size.height / 2 + vy * innerDist;
          const x2 = size.width / 2 + vx * distToEdge;
          const y2 = size.height / 2 + vy * distToEdge;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHour ? accentColor : "#ccc"}
              strokeWidth={isHour ? 2 : 1}
            />
          );
        })}

        {/* Clock numbers */}
        {numbers.map((n, idx) => (
          <text
            key={idx}
            x={n.x}
            y={n.y}
            fill="#FFFBFBFF"
            fontSize={n.fontSize}
            fontFamily={`${fontFamilyName}, sans-serif`}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {n.num}
          </text>
        ))}

        {/* Hour and minute hands */}
        <path
          ref={hourPathRef}
          stroke={accentColor}
          strokeWidth={Math.max(4, Math.round(Math.min(size.width, size.height) * 0.01))}
          strokeLinecap="square"
          fill="none"
        />
        <path
          ref={minutePathRef}
          stroke="#fff"
          strokeWidth={Math.max(2, Math.round(Math.min(size.width, size.height) * 0.007))}
          strokeLinecap="square"
          fill="none"
        />

        {/* Main second hand */}
        {showSeconds && (
          <path
            ref={secondPathRef}
            stroke="#F5EEEFFF"
            strokeWidth={Math.max(1, Math.round(Math.min(size.width, size.height) * 0.003))}
            strokeLinecap="square"
            fill="none"
          />
        )}

        {/* 25 smooth jagged second hands */}
        {extraSecondsConfig.map((_, i) => (
          <path
            key={`extra-second-${i}`}
            ref={(el) => (extraSecondRefs.current[i] = el)}
          />
        ))}

        {/* Center circle */}
        <circle
          cx={size.width / 2}
          cy={size.height / 2}
          r={Math.max(4, Math.round(Math.min(size.width, size.height) * 0.001))}
          fill="#080708FF"
        />
      </svg>
    </div>
  );
}
