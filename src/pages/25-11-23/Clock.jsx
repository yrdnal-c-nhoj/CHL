// File: DigitalStackClock.jsx
import React, { useEffect, useState } from "react";
import bgImg from "./gs.png";          // background image in same folder
import font2025_11_24 from "./gal.ttf";  // today's font (TTF)

export default function DigitalStackClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  // Format numbers
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  // Outer container
  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fmluFamslymClCustomClook
  };

  // Panel (mobile = stacked / desktop = horizontal)
  const panelStyle = {
    display: "flex",
    flexDirection: "column", // overridden to row on desktop by media query
    alignItems: "center",
    justifyContent: "center",
    gap: "3vh",
    width: "min(92vw, 70vh)",
    padding: "3vh 2.5vw",
    borderRadius: "2vh",
    // background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  };

  // Each row of digits
  const digitRow = {
    display: "flex",
    flexDirection: "row",
    gap: "1vh",
  };

  // Each individual digit (fixed box → no jumping)
  const digitStyle = {
    width: "14vh",
    height: "18vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24vh",
    fontFamily: "CustomClock",
    fontVariantNumeric: "tabular-nums",
    color: "# #00457C",
    borderRadius: "1vh",
    textShadow: "0.2vh 0.2vh 0.8vh rgba(0,0,0,0.6)",
    userSelect: "none",
  };

  return (
    <div style={containerStyle}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: "CustomClock";
              src: url("${font2025_11_24}") format("truetype");
              font-weight: 100 900;
              font-style: normal;
              font-display: block;
            }

            /* Desktop: horizontal layout */
            @media (min-width: 800px) {
              .clock-layout {
                flex-direction: row !important;
              }
            }

            /* Very short screens */
            @media (max-height: 420px) {
              .digit-box {
                width: 6vh !important;
                height: 9vh !important;
                font-size: 7vh !important;
              }
            }
          `,
        }}
      />

      <div className="clock-layout" style={panelStyle}>
        {/* HOURS */}
        <div style={digitRow}>
          {[...hh].map((d, i) => (
            <div key={i} className="digit-box" style={digitStyle}>
              {d}
            </div>
          ))}
        </div>

        {/* MINUTES */}
        <div style={digitRow}>
          {[...mm].map((d, i) => (
            <div key={i} className="digit-box" style={digitStyle}>
              {d}
            </div>
          ))}
        </div>

        {/* SECONDS */}
        <div style={digitRow}>
          {[...ss].map((d, i) => (
            <div key={i} className="digit-box" style={digitStyle}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
