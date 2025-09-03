import React, { useState, useEffect } from "react";

// Digit images (imported as modules)
import digit0 from "./0.gif";
import digit1 from "./1.gif";
import digit2 from "./2.gif";
import digit3 from "./3.gif";
import digit4 from "./4.gif";
import digit5 from "./5.gif";
import digit6 from "./6.gif";
import digit7 from "./7.gif";
import digit8 from "./8.gif";
import digit9 from "./9.gif";

// Background and overlay images
import backgroundImage from "./g.webp";
import overlayImage from "./fog.gif";

// Custom font (imported as module)
import customFont from "./fog.ttf";

// Map digits to their respective images
const digitImages = {
  "0": digit0,
  "1": digit1,
  "2": digit2,
  "3": digit3,
  "4": digit4,
  "5": digit5,
  "6": digit6,
  "7": digit7,
  "8": digit8,
  "9": digit9,
};

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  // Style constants
  const fontSize = "2rem";
  const textOffset = "-1.5rem";
  const imageWidth = "19vw";
  const floatDistance = "-7rem";

  // Update time every second
  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick); // Cleanup interval on unmount
  }, []);

  // Format time as HH:MM:SS
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  const digits = `${hours}${minutes}${seconds}`.split("");

  // Scoped CSS for font and animation
  const scopedCSS = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${customFont}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(${floatDistance}); }
    }
  `;

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate", // Ensures styles don't leak
      }}
    >
      {/* Scoped styles */}
      <style>{scopedCSS}</style>

      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7) contrast(0.8) saturate(0.9)",
          zIndex: 0,
        }}
      />

      {/* Digits container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {digits.map((digit, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: imageWidth,
              marginLeft: i === 0 ? 0 : "-12vw", // Overlap digits
              textAlign: "center",
            }}
          >
            {/* Floating text overlay */}
            <span
              style={{
                position: "absolute",
                top: textOffset,
                width: "100%",
                color: "white",
                fontSize,
                fontFamily: "'CustomFont', sans-serif", // Fallback to sans-serif
                textShadow: "0.2rem 0.2rem 0.4rem white",
                animation: `float 2s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              {digit}
            </span>

            {/* Digit image */}
            <img
              src={digitImages[digit]}
              alt={`Digit ${digit}`}
              style={{
                width: imageWidth,
                height: "auto",
                transform: "rotate(90deg)",
                filter:
                  "drop-shadow(0.4rem 0.2rem 0.3rem grey) drop-shadow(-0.4rem -0.4rem 0.3rem grey)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${overlayImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
          transform: "rotate(180deg)",
          zIndex: 4,
          filter: "brightness(1.7) contrast(1.8) saturate(1.9)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}