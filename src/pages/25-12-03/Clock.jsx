import React, { useEffect, useState } from "react";
import backgroundImg from "./rococo.webp";
import fontUrl_20251128 from "./rococo.ttf";

export default function RococoDigitalClock() {
  const [now, setNow] = useState(new Date());
  const [morph, setMorph] = useState(0);

  useEffect(() => {
    const timeInterval = setInterval(() => setNow(new Date()), 1000);

    const morphInterval = setInterval(() => {
      setMorph((m) => m + 1);
      setNow(new Date()); // snap seconds exactly on morph
    }, 5000);

    setMorph(1); // kickstart morph immediately

    return () => {
      clearInterval(timeInterval);
      clearInterval(morphInterval);
    };
  }, []);

  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}:${seconds}`;

  const rand = (seed) => {
    let x = Math.sin(seed) * 12345;
    return x - Math.floor(x);
  };

  const distortLetter = (char, i) => {
    const s = (morph + i + char.charCodeAt(0)) * 13.37;
    return {
      transform: `
        rotate(${-50 + rand(s) * 100}deg)
        skewX(${-65 + rand(s + 1) * 130}deg)
        skewY(${-50 + rand(s + 2) * 100}deg)
        scale(${0.5 + rand(s + 3) * 1.3}, ${0.7 + rand(s + 4) * 0.9})
        translateY(${-4 + rand(s + 5) * 8}vh)
        translateX(${-2 + rand(s + 6) * 4}vh)
      `,
      transition: "transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)",
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(1.2) contrast(1.4)",
        fontFamily: "'RococoBlob', serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'RococoBlob';
          src: url(${fontUrl_20251128}) format('truetype');
          font-weight: 800;
          font-display: swap;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          position: "relative",
        }}
      >
        {timeStr.split("").map((char, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: char === ":" ? "6vh" : "10vh",
              height: "18vh",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: char === ":" ? "10vh" : "12vh",
                lineHeight: "0.88",
                opacity: 0.6, 
                color: "#352904FF",
                userSelect: "none",
                ...distortLetter(char, i),
              }}
            >
              {char}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
