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
  const seconds = ("0" + time.getSeconds()).slice(-2);

  // Removed unused colors
  const lines = [
    ["O", "20/200", "6/60"],
    [ampm, "20/100", "6/30"],
    ["RSV", "20/70", "6/21"],
    [`${hours}HR`, "20/50", "6/15"],
    ["KOVRS", "20/40", "6/12"],
    [`${minutes}MINS`, "20/30", "6/9"],
    ["HOSRDN", "20/25", "6/7.5"],
    [`${seconds}SCNDS`, "20/20", "6/6"],
  ];

  const fontSizeForIndex = (i) => {
    const sizes = [15, 12, 10, 8, 6.5, 5.5, 4.5, 3.5];
    return `${sizes[i]}vh`;
  };

  const outer = {
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    background: "#FDF5DDFF",
    fontFamily:
      fontFamilyName +
      ", system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
    WebkitFontSmoothing: "antialiased",
  };

  const card = {
    width: "40vh",
    maxWidth: "65vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  };

  const lineBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    margin: "0.5vh 0",
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
          {lines.map(([letters, twenty, six], i) => (
            <div key={i} style={{ ...lineBase, fontSize: fontSizeForIndex(i) }}>
              <div style={leftLabel}>{twenty}</div>
              <p style={{ ...letterStyle, fontSize: "inherit" }}>{letters}</p>
              <div style={rightLabel}>{six}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
