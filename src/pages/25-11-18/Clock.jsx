import React, { useState, useEffect } from "react";
import customFont2025_11_20 from "./cat.ttf";
import bgImg2025_11_20 from "./eyes.webp";   // ← background image import

export default function DigitalClockGrid() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [rotations, setRotations] = useState({});

  const seconds = time.getSeconds();
  const secondsOnes = seconds % 10;
  const fiveSecBucket = Math.floor(seconds / 5);

  // LOAD FONT
  useEffect(() => {
    const font = new FontFace(
      "ClockFont2025_11_20",
      `url(${customFont2025_11_20})`
    );
    font.load().then((f) => {
      document.fonts.add(f);
      setFontLoaded(true);
    });
  }, []);

  // CLOCK TICK (every second)
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ROTATION GRID (update only every 5 sec)
  useEffect(() => {
    const newRot = {};
    const rows = 60;
    const cols = 52;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (let d = 0; d < 6; d++) {
          newRot[`${r}-${c}-${d}`] = Math.random() * 90 - 45;
        }
      }
    }
    setRotations(newRot);
  }, [fiveSecBucket]);

  if (!fontLoaded) return null;

  // DIGIT LOGIC
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");

  const digitH0 = hh[0];
  const digitH1 = hh[1];
  const digitM0 = mm[0];
  const digitM1 = mm[1];
  const digitS0 = String(Math.floor(seconds / 10));
  const digitS1 = String(secondsOnes);

  const base = [digitH0, digitH1, digitM0, digitM1, digitS0, digitS1];

  const pattern0 = base;
  const pattern3 = [...base.slice(3), ...base.slice(0, 3)];

  const digitStyle = (r, c, d) => ({
    display: "inline-block",
    width: "11vh",
    height: "14vh",
    lineHeight: "14vh",
    textAlign: "center",
    fontFamily: "ClockFont2025_11_20, monospace",
    fontSize: "13vh",
    color: "#851BE7FF",
    textShadow: "0.5vh 0.2vh 0.8vh #000000, -0.5px -0.5px 0 #F6F4DDFF",
    userSelect: "none",
    margin: "-0.2vh -1.8vw",
    letterSpacing: "-1vw",
    transform: `rotate(${rotations[`${r}-${c}-${d}`] || 0}deg)`,
    transformOrigin: "center center",
    transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)",
    willChange: "transform",
  });

  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
    margin: "-4vh 0",
  };

  const gridWrapperStyle = {
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    transform: "rotate(17deg) scale(1.8)",
    transformOrigin: "center center",
    pointerEvents: "none",
  };

  const Row = React.memo(({ rowIndex }) => (
    <div style={rowStyle}>
      {Array.from({ length: 52 }, (_, colIndex) => {
        const pattern =
          (colIndex + rowIndex) % 2 === 0 ? pattern0 : pattern3;
        return (
          <div key={colIndex}>
            {pattern.map((digit, digitIdx) => (
              <span
                key={digitIdx}
                style={digitStyle(rowIndex, colIndex, digitIdx)}
              >
                {digit}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  ));

  return (
    <>
      {/* Background image using imported file */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgImg2025_11_20})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "saturate(0.2) brightness(1.4) contrast(0.5)",
        }}
      />

      <div style={gridWrapperStyle}>
        {Array.from({ length: 60 }, (_, idx) => (
          <Row key={idx} rowIndex={idx} />
        ))}
      </div>
    </>
  );
}
