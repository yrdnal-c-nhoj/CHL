/** @jsxImportSource react */
import React, { useEffect, useState } from "react";
import romanFont2025_10_27 from "./vp.otf";

export default function AnalogClock() {
  const [now, setNow] = useState(() => new Date());
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update time every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Update viewport on resize
  useEffect(() => {
    const handler = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const clockDiameterVh = 56;
  const clockRadiusVh = clockDiameterVh / 2;
  const numeralOffsetVh = 4.2;
  const numeralRadiusVh = clockRadiusVh + numeralOffsetVh;

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 + minutes / 60 + seconds / 3600;

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30;

  const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  const fontFamilyName = "RomanClockFont_2025_10_27";

  const fontFaceStyle = `
    @font-face {
      font-family: '${fontFamilyName}';
      src: url('${romanFont2025_10_27}') format('truetype');
      font-display: swap;
    }
  `;

  const wrapperStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, hsl(2 30% 72%) 0%, hsl(90 20% 88%) 100%)",
    overflow: "hidden",
  };

  const clockShellStyle = {
    width: `${clockDiameterVh}vh`,
    height: `${clockDiameterVh}vh`,
    borderRadius: "50%",
    position: "relative",
    display: "grid",
    placeItems: "center",
  };

  const dialFaceStyle = {
    width: "92%",
    height: "92%",
    borderRadius: "50%",
    background: "transparent",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    boxSizing: "border-box",
  };

  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%", // bottom pivot
    borderRadius: "0.6vh",
    pointerEvents: "none",
  };

  const hourHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.55}vh`,
    width: "1.4vh",
    background: "linear-gradient(180deg, hsl(0 0% 98%), hsl(220 10% 75%))",
    transform: `translate(-50%,0) rotate(${hourAngle}deg)`,
    zIndex: 6,
  };

  const minuteHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.72}vh`,
    width: "1.0vh",
    background: "linear-gradient(180deg, hsl(0 0% 98%), hsl(220 10% 85%))",
    transform: `translate(-50%,0) rotate(${minAngle}deg)`,
    zIndex: 8,
  };

  const secondHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.86}vh`,
    width: "0.5vh",
    background: "linear-gradient(180deg, hsl(2 80% 60%), hsl(2 80% 45%))",
    transform: `translate(-50%,0) rotate(${secAngle}deg)`,
    zIndex: 9,
  };

  const numeralBaseStyle = {
    position: "absolute",
    fontFamily: `${fontFamilyName}, system-ui, -apple-system, 'Segoe UI', Roboto`,
    fontSize: "9.2vh",
    fontWeight: 600,
    userSelect: "none",
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    letterSpacing: "0.15rem",
  };

  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const maxLineLength = Math.sqrt(centerX ** 2 + centerY ** 2);

  return (
    <div style={wrapperStyle}>
      <style>{fontFaceStyle}</style>

      <div aria-hidden style={clockShellStyle}>
        <div style={dialFaceStyle}>
          {/* jawlines to numerals */}
          {romanNumerals.map((num, i) => {
            const angleFromTop = i * 30 - 90;
            const lineLengthVh = numeralRadiusVh - 2;
            const lineStyle = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${lineLengthVh}vh`,
              height: "0.3vh",
              background: "rgba(0,0,0,0.4)",
              transformOrigin: "0% 50%",
              transform: `rotate(${angleFromTop}deg) translateX(0)`,
              zIndex: 2,
            };
            return <div key={`line-num-${i}`} style={lineStyle} aria-hidden />;
          })}

          {/* jawlines to viewport edges */}
          {romanNumerals.map((num, i) => {
            const angleFromTop = i * 30 - 90;
            const lineStyle = {
              position: "absolute",
              left: `${centerX}px`,
              top: `${centerY}px`,
              width: `${maxLineLength}px`,
              height: "2px",
              background: "rgba(0,0,0,0.3)",
              transformOrigin: "0% 50%",
              transform: `rotate(${angleFromTop}deg)`,
              zIndex: 1,
            };
            return <div key={`line-edge-${i}`} style={lineStyle} aria-hidden />;
          })}

          {/* clock hands */}
          <div style={hourHandStyle} />
          <div style={minuteHandStyle} />
          <div style={secondHandStyle} />

          {/* numerals */}
          {romanNumerals.map((num, i) => {
            const angleRad = ((i * 30 - 90) * Math.PI) / 180;
            const x = numeralRadiusVh * Math.cos(angleRad);
            const y = numeralRadiusVh * Math.sin(angleRad);
            const numeralStyle = {
              ...numeralBaseStyle,
              left: `50%`,
              top: `50%`,
              transform: `translate(${x}vh, ${y}vh) translate(-50%, -50%)`,
              zIndex: 3,
            };
            return (
              <div key={`numeral-${i}`} style={numeralStyle}>
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
