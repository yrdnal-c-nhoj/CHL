import React, { useState, useEffect, useRef } from "react";
import bgImage from "./bones.webp";
import FontOne_2025_09_25 from "./unix.otf"; // code font
import FontTwo_2025_09_25 from "./uni.otf"; // different font for timestamp
import FontThree_2025_09_25 from "./disco.ttf"; // different font for timestamp


const today = new Date().toISOString().slice(0, 10).replace(/-/g, "_");

const UnixEpochClock = () => {
  const [ready, setReady] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const intervalRef = useRef(null);

  const fontOneName = `FontOne-${today}`;
  const fontTwoName = `FontTwo-${today}`;
  const fontThreeName = `FontThree-${today}`;

  // Preload helpers
  const preloadFont = (url, family) =>
    new FontFace(family, `url(${url}) format('truetype')`).load().then(f => document.fonts.add(f)).catch(() => {});
  const preloadImage = (src) =>
    new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = resolve;
    });

  // Load fonts and background
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: '${fontOneName}';
        src: url(${FontOne_2025_09_25}) format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: '${fontTwoName}';
        src: url(${FontTwo_2025_09_25}) format('truetype');
        font-display: block;
      }
         @font-face {
        font-family: '${fontThreeName}';
        src: url(${FontThree_2025_09_25}) format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    Promise.all([
      preloadFont(FontOne_2025_09_25, fontOneName),
      preloadFont(FontTwo_2025_09_25, fontTwoName),
      preloadFont(FontThree_2025_09_25, fontThreeName),
      preloadImage(bgImage)
    ]).then(() => setReady(true));

    return () => document.head.removeChild(style);
  }, []);

  // Update timestamp every second
  useEffect(() => {
    if (!ready) return;

    const updateTime = () => setTimestamp(Math.floor(Date.now() / 1000).toString());
    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, [ready]);

  if (!ready) {
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  const currentYear = ((Date.now() - new Date("1970-01-01T00:00:00Z").getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: fontOneName, // all text defaults to code font
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: "0.2rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Gray + Red text */}
      <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontSize: "1rem",
            color: "#7E7979FF",
            maxWidth: "25rem",
            marginBottom: "0.5rem",
            lineHeight: "1.2",
          }}
        >
          On January 1st, 1970, at precisely 00:00:00 UTC, the digital universe began counting. That moment became the foundation of time itself in computing. The UNIX Epoch began.
        </div>

        {/* Timestamp in different font */}
        <div style={{ fontFamily: fontTwoName, fontSize: "2.7rem", color: "#9F0606FF", letterSpacing: "-0.4rem" }}>
          {timestamp}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#7B7575FF" }}>
          seconds since the dawn of digital time.
        </div>
      </div>

      {/* Bottom Green text */}
      {/* Bottom Green text */}
<div
  style={{
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: fontThreeName, 
    backgroundColor: "rgba(255, 255, 255, 0.5)", // semi-transparent whitish background
    padding: "0.5rem 1rem", // some padding around the text
    borderRadius: "0.5rem", // optional: rounded corners
    marginBottom: "1.5rem", // move it up slightly
  }}
>
  <div style={{ fontSize: "1.0rem", color: "#011410FF" }}>
    {currentYear} YEARS OF DIGITAL HISTORY
  </div>
</div>

    </div>
  );
};

export default UnixEpochClock;
