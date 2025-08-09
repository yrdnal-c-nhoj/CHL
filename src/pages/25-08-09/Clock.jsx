import React, { useEffect, useRef, useState } from "react";
import myFont from "./box.ttf"; // Ensure this path is correct

export default function RectangularAnalogClock({
  showSeconds = true,
  faceGradient = "linear-gradient(135deg, #080C04FF, #0E1812FF)",
  accentColor = "#EEE7E9FF",
  fontFamilyName = "CustomFont",
}) {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(null);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

    const degToRad = (deg) => (deg - 90) * (Math.PI / 180);

    const radH = degToRad((h / 12) * 360);
    const hourX = cx + Math.cos(radH) * minHalf * 0.35;
    const hourY = cy + Math.sin(radH) * minHalf * 0.35;

    const radM = degToRad((m / 60) * 360);
    const minuteX = cx + Math.cos(radM) * minHalf * 0.6;
    const minuteY = cy + Math.sin(radM) * minHalf * 0.6;

    const radS = degToRad((s / 60) * 360);
    const vxS = Math.cos(radS);
    const vyS = Math.sin(radS);
    const safeDiv = (num, denom) =>
      Math.abs(denom) < 1e-9 ? Infinity : num / Math.abs(denom);
    const distToVertical = safeDiv(halfW, vxS);
    const distToHorizontal = safeDiv(halfH, vyS);
    const lenSecond = Math.min(distToVertical, distToHorizontal);
    const secondX = cx + vxS * lenSecond;
    const secondY = cy + vyS * lenSecond;

    if (hourRef.current) {
      hourRef.current.setAttribute("x1", cx);
      hourRef.current.setAttribute("y1", cy);
      hourRef.current.setAttribute("x2", hourX);
      hourRef.current.setAttribute("y2", hourY);
    }
    if (minuteRef.current) {
      minuteRef.current.setAttribute("x1", cx);
      minuteRef.current.setAttribute("y1", cy);
      minuteRef.current.setAttribute("x2", minuteX);
      minuteRef.current.setAttribute("y2", minuteY);
    }
    if (secondRef.current && showSeconds) {
      secondRef.current.setAttribute("x1", cx);
      secondRef.current.setAttribute("y1", cy);
      secondRef.current.setAttribute("x2", secondX);
      secondRef.current.setAttribute("y2", secondY);
    }
  };

  useEffect(() => {
    const loop = () => {
      updateHands();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, showSeconds]);

  const getNumberPositions = () => {
    const numberFontSize = Math.round(Math.min(size.width, size.height) * 0.2);

    const halfW = size.width / 2;
    const halfH = size.height / 2;

    const hourTickLength = Math.min(
      25,
      Math.max(8, Math.min(size.width, size.height) * 0.04)
    );

    const textGap = 15; // distance from tick tip to number edge

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

  // Calculate rectangle width/height for 15x15 grid
  const rectWidth = size.width / 4;
  const rectHeight = size.height / 4;

  // Generate array for 15x15 grid cells
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
        {/* Background: 15x15 grid of black/white rectangles */}
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

        {/* Overlay the gradient with partial opacity */}
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

        <line
          ref={hourRef}
          stroke={accentColor}
          strokeWidth={Math.max(
            4,
            Math.round(Math.min(size.width, size.height) * 0.01)
          )}
          strokeLinecap="round"
        />
        <line
          ref={minuteRef}
          stroke="#fff"
          strokeWidth={Math.max(
            2,
            Math.round(Math.min(size.width, size.height) * 0.007)
          )}
          strokeLinecap="round"
        />
        {showSeconds && (
          <line
            ref={secondRef}
            stroke="#F5EEEFFF"
            strokeWidth={Math.max(
              1,
              Math.round(Math.min(size.width, size.height) * 0.003)
            )}
            strokeLinecap="round"
          />
        )}

        <circle
          cx={size.width / 2}
          cy={size.height / 2}
          r={Math.max(
            4,
            Math.round(Math.min(size.width, size.height) * 0.001)
          )}
          fill="#080708FF"
        />
      </svg>
    </div>
  );
}
