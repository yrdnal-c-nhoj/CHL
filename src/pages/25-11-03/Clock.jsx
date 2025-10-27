import React, { useEffect, useState } from "react";
// -- Font import with today's date in the variable name (2025_10_27)
import romanFont2025_10_27 from "./roman.otf";



export default function AnalogClock() {
  // time state drives hand rotations
  const [now, setNow] = useState(() => new Date());

  // update every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // clock sizing (use vh units). You can adjust clockDiameterVh.
  const clockDiameterVh = 56; // 56vh total diameter
  const clockRadiusVh = clockDiameterVh / 2; // 28vh
  const numeralOffsetVh = 4.2; // how far outside the clock numerals sit (in vh)
  const numeralRadiusVh = clockRadiusVh + numeralOffsetVh; // e.g., 32.2vh

  // compute hand angles
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 + minutes / 60 + seconds / 3600;

  const secAngle = seconds * 6; // 360/60
  const minAngle = minutes * 6 + seconds * 0.1; // minute plus fraction
  const hourAngle = hours * 30; // 360/12

  // roman numerals starting at 12 o'clock and proceeding clockwise
  const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

  // Unique font-family name so it doesn't collide globally
  const fontFamilyName = "RomanClockFont_2025_10_27";

  // inline injected @font-face (safe unique name)
  const fontFaceStyle = `
    @font-face {
      font-family: '${fontFamilyName}';
      src: url('${romanFont2025_10_27}') format('truetype');
      font-display: swap;
    }
  `;

  // base styles (inline)
  const wrapperStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, hsl(2 30% 72%) 0%, hsl(90 20% 88%) 100%)",
    // background only for demo; you can change or remove it
  };

  const clockShellStyle = {
    width: `${clockDiameterVh}vh`,
    height: `${clockDiameterVh}vh`,
    borderRadius: "50%",
    position: "relative",
    display: "grid",
    placeItems: "center",
    // boxShadow: "0 0 2vh rgba(0,0,0,0.6), inset 0 0 1.2vh rgba(255,255,255,0.02)",
    // background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03), transparent 10%, rgba(0,0,0,0.4))",
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

  // hand common style
  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 90%", // pivot near the bottom of the element so rotation looks natural
    borderRadius: "0.6vh",
    pointerEvents: "none",
  };

  const hourHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.55}vh`, // length relative to radius
    width: "1.4vh",
    background: "linear-gradient(180deg, hsl(0 0% 98%), hsl(220 10% 75%))",
    transform: `translate(-50%,-100%) rotate(${hourAngle}deg)`,
    zIndex: 6,
  };

  const minuteHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.72}vh`,
    width: "1.0vh",
    background: "linear-gradient(180deg, hsl(0 0% 98%), hsl(220 10% 85%))",
    transform: `translate(-50%,-100%) rotate(${minAngle}deg)`,
    zIndex: 8,
  };

  const secondHandStyle = {
    ...handCommon,
    height: `${clockRadiusVh * 0.86}vh`,
    width: "0.5vh",
    background: "linear-gradient(180deg, hsl(2 80% 60%), hsl(2 80% 45%))",
    transform: `translate(-50%,-100%) rotate(${secAngle}deg)`,
    zIndex: 9,
    // give a little tail effect by using a pseudo tail element (we can't with inline styles),
    // so we'll render an extra small element for tail below.
  };

  

  const numeralBaseStyle = {
    position: "absolute",
    fontFamily: fontFamilyName + ", system-ui, -apple-system, 'Segoe UI', Roboto",
    fontSize: "9.2vh",
    fontWeight: 600,
    userSelect: "none",
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    letterSpacing: "0.15rem",
  };


  return (
    <div style={wrapperStyle}>
      {/* Inject font-face (unique) */}
      <style>{fontFaceStyle}</style>

      <div aria-hidden style={clockShellStyle}>
        <div style={dialFaceStyle}>
      

          {/* roman numerals */}
          {romanNumerals.map((num, i) => {
            // angle: 0 deg at 3 o'clock; we want 0 at top, so subtract 90deg
            const angleFromTop = i * 30 - 90;
            const angleRad = (angleFromTop * Math.PI) / 180;
            // x,y offsets in vh (positive to right, positive to down)
            const xOffset = Math.cos(angleRad) * numeralRadiusVh; // cos because angle measured from x-axis rotated; we've used angleFromTop so cos/sin work
            const yOffset = Math.sin(angleRad) * numeralRadiusVh;
            // left/top using calc mixing percent + vh so it's responsive and always relative to center
            const leftCalc = `calc(50% + ${xOffset}vh)`;
            const topCalc = `calc(50% + ${yOffset}vh)`;

            // rotate text tangentially to the circle: angleFromTop + 90deg
            const tangentialRotation = angleFromTop + 90;

            const numeralStyle = {
              ...numeralBaseStyle,
              left: leftCalc,
              top: topCalc,
              transform: `translate(-50%,-50%) rotate(${tangentialRotation}deg)`,
              zIndex: 5,
              whiteSpace: "nowrap",
            };

            return (
              <div key={`num-${i}`} style={numeralStyle} aria-hidden>
                {num}
              </div>
            );
          })}

          {/* hour hand */}
          <div style={hourHandStyle} />

          {/* minute hand */}
          <div style={minuteHandStyle} />

          {/* second hand */}
          <div style={secondHandStyle} />

        </div>
      </div>
    </div>
  );
}
