import React, { useState, useEffect } from "react";
import sloanFont_2025_1204 from "./ichart.otf";

export default function EyeChart() {
  const fontFamilyName = "SloanOptotype_2025_1204";

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = ("0" + (time.getHours() % 12 || 12)).slice(-2);
  const minutes = ("0" + time.getMinutes()).slice(-2);
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const lines = [
    ["O", "20/200", "6/60", "#e63946"],           // Red
    [ampm, "20/100", "6/30", "#f77f00"],          // Orange
    ["RSV", "20/70", "6/21", "#fcbf49"],          // Yellow
    [`${hours}HR`, "20/50", "6/15", "#06d6a0"],   // Teal
    ["KOVRS", "20/40", "6/12", "#118ab2"],        // Blue
    [`${minutes}MINS`, "20/30", "6/9", "#073b4c"], // Navy
    ["HOSRDN", "20/25", "6/7.5", "#6a4c93"],      // Purple
    ["CSVKORHZ", "20/20", "6/6", "#2a9d8f"],      // Green
  ];

  const fontSizeForIndex = (i) => {
    // Scale larger for tall chart look
    const sizes = [15, 12, 10, 8, 6.5, 5.5, 4.5, 3.5];
    return `${sizes[i]}vh`;
  };

  const outer = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    background: "#f7f5ef",
    padding: "1vh",
    fontFamily:
      fontFamilyName +
      ", system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
    WebkitFontSmoothing: "antialiased",
  };

  const card = {
    width: "40vh",       // narrow width like real eye chart
    maxWidth: "90vw",
    padding: "2vh 0",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "1vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    boxShadow: "0 0.8vh 2vh rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  };

  const lineBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    margin: "0.5vh 0", // closer together for realism
  };

  const letterStyle = {
    fontFamily: fontFamilyName,
    textTransform: "uppercase",
    lineHeight: 1,
    letterSpacing: "0.1vh",
    margin: 0,
    padding: 0,
  };

  const leftLabel = {
    position: "absolute",
    left: "-8vh",
    fontSize: "2vh",
    opacity: 0.55,
    letterSpacing: "0.15vh",
  };

  const rightLabel = {
    position: "absolute",
    right: "-8vh",
    textAlign: "right",
    fontSize: "2vh",
    opacity: 0.55,
    letterSpacing: "0.15vh",
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: '${fontFamilyName}';
              src: url('${sloanFont_2025_1204}') format('opentype');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            .eyechart-root * { box-sizing: border-box; }
          `,
        }}
      />

      <div style={outer} className="eyechart-root">
        <div style={card} role="img" aria-label="Snellen Sloan eye chart">
          {lines.map(([letters, twenty, six, color], i) => (
            <div key={i} style={{ ...lineBase, fontSize: fontSizeForIndex(i) }}>
              <div style={leftLabel}>{twenty}</div>
              <p style={{ ...letterStyle, fontSize: "inherit" }}>{letters}</p>
              <div style={rightLabel}>
                {twenty}
                <br />
                {six}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
