// src/components/CustomFontMirroredClock.jsx
import React, { useState, useEffect } from "react";
import todayFont251125 from "./digi.ttf";
import bgFront from "./bg.webp"; // top layer
import bgBack from "./bg1.jpg";  // back layer

export default function CustomFontMirroredClock() {
  const [time, setTime] = useState(getCurrentTime());
  const [fontLoaded, setFontLoaded] = useState(false);

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'TodayFont';
      src: url(${todayFont251125}) format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;

  // Load font programmatically to avoid flash-of-unstyled-text (FOUT)
  useEffect(() => {
    let mounted = true;
    try {
      const f = new FontFace("TodayFont", `url(${todayFont251125})`);
      f.load()
        .then((loaded) => {
          if (!mounted) return;
          document.fonts.add(loaded);
          setFontLoaded(true);
        })
        .catch(() => {
          if (!mounted) return;
          setFontLoaded(true);
        });
    } catch (e) {
      setFontLoaded(true);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const topImageSize = "90% auto";   // front image size
  const backImageSize = "380% auto"; // back image size

  const containerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    backgroundImage: `url(${bgFront}), url(${bgBack})`,
    backgroundRepeat: "no-repeat, no-repeat",
    // front (center), back (10vw left)
    backgroundPosition: "center center, calc(50% - 4vw) center",
    backgroundSize: `${topImageSize}, ${backImageSize}`,
    backgroundColor: "#000",
  };

  const mirroredClockStyle = {
    fontFamily: "TodayFont, monospace",
    fontSize: "13vw",
    color: "#F70E12E5",
    textShadow: "1px 1px 0px #F1EAEBA0, -1px -1px 0px #0E0D0DFF",
    transform: "scaleX(-1) translateX(-1vw)",
    textAlign: "center",
    zIndex: 2,
    // prevent flash: hide until the custom font is ready
    opacity: fontLoaded ? 1 : 0,
    transition: "opacity 160ms linear",
    pointerEvents: fontLoaded ? "auto" : "none",
  };

  return (
    <div style={containerStyle}>
      <style>{fontFace}</style>
      <div style={mirroredClockStyle}>{time}</div>
    </div>
  );
}


