import React, { useState, useEffect } from "react";
import sloanFont_2025_1204 from "./ichart.otf";

export default function EyeChart() {
  const fontFamilyName = "SloanOptotype_2025_1204";

  // Live clock state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format hours (12-hour clock with leading zero) and AM/PM
  const hours = ("0" + (time.getHours() % 12 || 12)).slice(-2);
  const minutes = ("0" + time.getMinutes()).slice(-2);
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  // Each line now includes: [letters, twentyFeet, meters, colorCode]
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
    const sizes = [12, 9.5, 7.5, 6.2, 5.2, 4.4, 3.8, 3.2];
    return `${sizes[i]}vh`;
  };

  const outer = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f5ef",
    padding: "4vh",
    boxSizing: "border-box",
    fontFamily:
      fontFamilyName +
      ", system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
    WebkitFontSmoothing: "antialiased",
  };

  const card = {
    width: "60vh",
    maxWidth: "90vw",
    padding: "5vh 4vh",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "1.2vh",
    boxShadow: "0 0.8vh 2vh rgba(0,0,0,0.06)",
    position: "relative",
    boxSizing: "border-box",
  };


  const lineBase = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    margin: "1.6vh 0",
    justifyContent: "center",
    position: "relative",
  };

  // NEW: Function to create colored bar styles
  const colorBar = (color) => ({
    position: "absolute",
    left: "3vh",
    width: "0.6vh",
    height: "80%",
    backgroundColor: color,
    borderRadius: "0.3vh",
  });

  const letterStyle = {
    fontFamily: fontFamilyName,
    textTransform: "uppercase",
    lineHeight: 1,
    letterSpacing: "0.25vh",
    margin: 0,
    padding: 0,
  };

  const leftLabel = {
    position: "absolute",
    left: "5vh",  // CHANGED: moved right to make room for color bar
    fontSize: "1.6vh",
    opacity: 0.55,
    letterSpacing: "0.15vh",
  };

  const rightLabel = {
    position: "absolute",
    right: "0",
    textAlign: "right",
    fontSize: "1.6vh",
    opacity: 0.55,
    letterSpacing: "0.15vh",
    lineHeight: 1.4,
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
        

          {lines.map(([letters, twenty, six, color], i) => {
            const size = fontSizeForIndex(i);
            return (
              <div key={i} style={{ ...lineBase, fontSize: size }}>
                {/* NEW: Colored bar on the left */}
                <div style={colorBar(color)} />
                
                <div style={leftLabel}>{twenty}</div>
                <p style={{ ...letterStyle, fontSize: "inherit" }}>{letters}</p>
                <div style={rightLabel}>
                  {twenty}
                  <br />
                  {six}
                </div>
              </div>
            );
          })}

         
        </div>
      </div>
    </>
  );
}