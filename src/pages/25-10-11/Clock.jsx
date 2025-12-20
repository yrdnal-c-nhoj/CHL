import React, { useEffect, useState } from "react";
import bottomBackgroundImg from "./ch.jpg"; // New bottom background image
import backgroundImg from "./ches.jpg";          // Original background image
import customFont20251011 from "./ch.ttf";
import alphabetFont20251011 from "./chess.ttf";

export default function FancyClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [alphabetFontLoaded, setAlphabetFontLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Load fonts
  useEffect(() => {
    const font = new FontFace("CustomFont20251011", `url(${customFont20251011})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    });
    const alphaFont = new FontFace("AlphabetFont20251011", `url(${alphabetFont20251011})`);
    alphaFont.load().then((loaded) => {
      document.fonts.add(loaded);
      setAlphabetFontLoaded(true);
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "pm" : "am";

  const formatClock = (h, m, s, ampm) =>
    `${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}${String(s).padStart(2, "0")}${ampm}`;

  const clockStr = formatClock(hours, minutes, seconds, ampm);

  const gridSize = 8;
  const gridScale = 0.89;

  const alphabetRows = [
    ["R", "H", "B", "Q", "K", "B", "H", "R"], // top row 0
    ["P", "P", "P", "P", "P", "P", "P", "P"], // top row 1
    ["O", "O", "O", "O", "O", "O", "O", "O"], // bottom row 6
    ["T", "J", "N", "W", "L", "N", "J", "T"], // bottom row 7
  ];

  const renderAlphabetRow = (chars, rowIndex) =>
    chars.map((letter, i) => (
      <div
        key={`alpha-${rowIndex}-${i}`}
        style={{
          position: "absolute",
          top: `${(rowIndex / gridSize) * 100}%`,
          left: `${(i / gridSize) * 100}%`,
          width: `${100 / gridSize}%`,
          height: `${100 / gridSize}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "10vw" : "10vh",
          fontFamily: "AlphabetFont20251011",
          color: "#F4DDF7FF",
          zIndex: 2,
          pointerEvents: "none",
          textShadow: `
            -0.15em -0.15em 0 #000,
            -0.15em 0 0 #000,
            -0.15em 0.15em 0 #000,
            0 -0.15em 0 #000,
            0 0.15em 0 #000,
            0.15em -0.15em 0 #000,
            0.15em 0 0 #000,
            0.15em 0.15em 0 #000
          `,
        }}
      >
        {letter}
      </div>
    ));

  const renderColumnLabels = (clockStr) =>
    clockStr.slice(0, gridSize).split("").map((char, i) => (
      <div
        key={`col-${i}`}
        style={{
          position: "absolute",
          top: `0%`,
          left: `${(i + 0.5) / gridSize * 100}%`,
          transform: "translateX(-50%) translateY(-100%)",
          fontSize: isMobile ? "3vw" : "3vh",
          fontFamily: "CustomFont20251011",
          color: "#686464FF",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {char}
      </div>
    ));

  const renderRowLabels = (clockStr) =>
    clockStr.slice(0, gridSize).split("").map((char, i) => (
      <div
        key={`row-${i}`}
        style={{
          position: "absolute",
          top: `${(i + 0.5) / gridSize * 100}%`,
          left: `0%`,
          transform: "translateX(-120%) translateY(-50%)",
          fontSize: isMobile ? "3vw" : "3vh",
          fontFamily: "CustomFont20251011",
          color: "#686464FF",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {char}
      </div>
    ));

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        fontFamily: "CustomFont20251011",
        overflow: "hidden",
      }}
    >
      {/* Bottom background image */}
      <img
        src={bottomBackgroundImg}
        alt="Bottom Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          objectFit: "fill",
          zIndex: 0,
        }}
      />

      {/* Original background image */}
      <img
        src={backgroundImg}
        alt="Background"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          opacity: "0.8",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "100vw" : "100vh",
          height: isMobile ? "100vw" : "100vh",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      Grid overlay
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${gridScale})`,
          width: isMobile ? "100vw" : "100vh",
          height: isMobile ? "100vw" : "100vh",
          zIndex: 2,
        }}
      >
        {renderColumnLabels(clockStr)}
        {renderRowLabels(clockStr)}
        {renderAlphabetRow(alphabetRows[0], 0)}
        {renderAlphabetRow(alphabetRows[1], 1)}
        {renderAlphabetRow(alphabetRows[2], 6)}
        {renderAlphabetRow(alphabetRows[3], 7)}
      </div>
    </div>
  );
}
