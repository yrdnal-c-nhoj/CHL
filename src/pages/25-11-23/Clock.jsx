// File: DigitalStackClock.jsx
import React, { useEffect, useState } from "react";
import bgImg from "./gs.png";           // your background
import font2025_11_24 from "./gal.ttf"; // your custom font

export default function DigitalStackClock() {
  const [now, setNow] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Update time every 250 ms
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  // Wait for custom font → eliminates FOUC completely
  useEffect(() => {
    document.fonts.ready.then(() => {
      document.fonts
        .load('100 1em CustomClock') // load at least one weight
        .then(() => setFontReady(true));
    });
  }, []);

  // Format time
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  // Styles
  const containerStyle = {
    minHeight: "100dvh",           // fixes mobile Chrome centering
    width: "100vw",
    margin: 0,
    padding: "4dvh 2vw",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `url(${bgImg}) center/cover no-repeat`,
    fontFamily: '"CustomClock", system-ui, monospace',
  };

  const panelStyle = {
    display: "flex",
    flexDirection: "column",       // mobile = stacked
    alignItems: "center",
    justifyContent: "center",
    gap: "3vh",
    width: "min(92vw, 70vh)",
    padding: "3vh 2.5vw",
  };

  const digitRow = {
    display: "flex",
    gap: "1vh",
  };

  const digitStyle = {
    width: "14vh",
    height: "18vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24vh",
    fontVariantNumeric: "tabular-nums",
    color: "#07487DFF",

    borderRadius: "1vh",
    userSelect: "none",

  };

  return (
    <>
      {/* Preload font instantly */}
      <link
        rel="preload"
        href={font2025_11_24}
        as="font"
        type="font/ttf"
        crossOrigin=""
      />

      <div style={containerStyle}>
        {/* Global styles + font-face */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: "CustomClock";
                src: url("${font2025_11_24}") format("truetype");
                font-weight: 100 900;
                font-display: swap;
              }
              /* Hide until font is ready → zero flash */
              .clock-root { opacity: 0; transition: opacity 300ms ease; }
              .clock-root.font-ready { opacity: 1; }

              /* Desktop → horizontal */
              @media (min-width: 800px) {
                .clock-layout { flex-direction: row !important; }
              }

              /* Tiny screens / landscape phones */
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

        {/* Clock becomes visible only when font is loaded */}
        <div className={`clock-root ${fontReady ? "font-ready" : ""}`}>
          <div className="clock-layout" style={panelStyle}>
            {/* HOURS */}
            <div style={digitRow}>
              {[...hh].map((d, i) => (
                <div key={`h${i}`} className="digit-box" style={digitStyle}>
                  {d}
                </div>
              ))}
            </div>

            {/* MINUTES */}
            <div style={digitRow}>
              {[...mm].map((d, i) => (
                <div key={`m${i}`} className="digit-box" style={digitStyle}>
                  {d}
                </div>
              ))}
            </div>

            {/* SECONDS */}
            <div style={digitRow}>
              {[...ss].map((d, i) => (
                <div key={`s${i}`} className="digit-box" style={digitStyle}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}