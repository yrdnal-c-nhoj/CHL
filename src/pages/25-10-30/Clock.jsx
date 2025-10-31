/** @jsxImportSource react */
import { useEffect, useState } from "react";
import bgImage from "./turq.webp";
import customFont2025_10_31 from "./turqs.ttf";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const radius = "min(40vh, 40vw)";
  const clockSize = `calc(2 * ${radius})`;

  // Metallic base
  const METALLIC = {
    background:
      "linear-gradient(135deg, #8E8B8B 0%, #C9C6C6 25%, #ffffff 50%, #C8C8C8 75%, #868484FF 100%)",
    boxShadow:
      "0 0.2vh 0.8vh rgba(0,0,0,0.3), inset -0.1vh 0 0.9vh rgba(255,255,255,0.9), inset 0.1vh 0 0.3vh rgba(0,0,0,0.9)",
  };

  const FILIGREE = {
    ...METALLIC,
    filter: "hue-rotate(190deg) saturate(0.5) brightness(1.1)",
  };

  const pageStyle = {
    width: "100vw",
    height: "100dvh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'CustomFont2025_10_31', sans-serif",
    overflow: "hidden",
  };

  const bgStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "hue-rotate(-10deg) saturate(1.5) brightness(0.9) contrast(0.9)",
    zIndex: 0,
  };

  const wrapperStyle = {
    position: "relative",
    width: clockSize,
    height: clockSize,
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: 1,
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(64,224,227,0.6)",
    borderRadius: "50%",
    zIndex: 1,
  };

  // CORRECTED: Hands pivot from **center**, not top
  const handBase = (widthFrac, lengthFrac, deg, clipPath) => ({
    ...FILIGREE,
    position: "absolute",
    width: `calc(${widthFrac} * ${radius})`,
    height: `calc(${lengthFrac} * ${radius})`,
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: "center bottom", // Pivot from **bottom center** of hand
    clipPath,
    zIndex: 3,
  });

  const hourHand = handBase(
    0.1,
    0.28,
    hourDeg,
    "polygon(50% 0%, 75% 15%, 70% 50%, 90% 80%, 75% 100%, 25% 100%, 10% 80%, 30% 50%, 25% 15%)"
  );

  const minuteHand = handBase(
    0.06,
    0.4,
    minuteDeg,
    "polygon(50% 0%, 70% 5%, 60% 40%, 80% 70%, 60% 100%, 40% 100%, 20% 70%, 40% 40%, 30% 5%)"
  );

  const secondHand = {
    ...FILIGREE,
    position: "absolute",
    width: `calc(0.01 * ${radius})`,
    height: `calc(0.4375 * ${radius})`,
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
    transformOrigin: "center bottom",
    borderRadius: "0 0 0.2vh 0.2vh",
    zIndex: 3,
  };

  const centerCap = {
    ...FILIGREE,
    position: "absolute",
    width: `calc(0.12 * ${radius})`,
    height: `calc(0.12 * ${radius})`,
    borderRadius: "50%",
    top: `calc(50% - 0.06 * ${radius})`,
    left: `calc(50% - 0.06 * ${radius})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  };

  const centerJewel = {
    position: "absolute",
    width: `calc(0.004 * ${radius})`,
    height: `calc(0.004 * ${radius})`,
    borderRadius: "50%",
    background: "radial-gradient(circle, #40E0D0 0%, #008B8B 70%)",
    boxShadow: "0 0 0.5vh rgba(0,255,255,0.4), inset 0 0 0.1vh rgba(255,255,255,0.9)",
    zIndex: 6,
  };

  // SVG Numbers – Firefox-safe
  const svgNumbers = (
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="numGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6BA4A0" />
          <stop offset="25%" stopColor="#A8D5D1" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#A8D5D1" />
          <stop offset="100%" stopColor="#6BA4A0" />
        </linearGradient>
        <filter id="numShadow">
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30 * (Math.PI / 180);
        const x = 50 + 38 * Math.sin(angle);
        const y = 50 - 38 * Math.cos(angle);
        const label = i === 0 ? "12" : i.toString();

        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontFamily="'CustomFont2025_10_31', serif"
            fill="url(#numGrad)"
            filter="url(#numShadow)"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );

  return (
    <>
      <style jsx>{`
        @font-face {
          font-family: 'CustomFont2025_10_31';
          src: url(${customFont2025_10_31}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div style={pageStyle}>
        <div style={bgStyle} />

        <div style={wrapperStyle}>
          <div style={overlayStyle} />
          {svgNumbers}

          {/* Hands – now rotate from center */}
          <div style={hourHand} />
          <div style={minuteHand} />
          <div style={secondHand} />

          {/* Center */}
          <div style={centerCap}>
            <div style={centerJewel} />
          </div>
        </div>
      </div>
    </>
  );
}