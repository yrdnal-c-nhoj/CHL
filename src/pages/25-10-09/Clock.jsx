import React, { useEffect, useState } from "react";
import cinzel20251010 from "./d1.ttf"; // Hours font
import roboto20251010 from "./d2.otf"; // Minutes font
import orbitron20251010 from "./d3.otf"; // Seconds font

export default function SpinningAnalogClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutesSeconds = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Black screen first, then mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Smooth animation
  useEffect(() => {
    if (!mounted) return;
    let frame;
    const update = () => {
      setTime(new Date());
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();

  // Smooth continuous angles
  const hourAngle = (h + m / 60 + s / 3600) * 30;
  const minuteAngle = (m + s / 60 + ms / 60000) * 6;
  const secondAngle = (s + ms / 1000) * 6;

  const renderNumbers = (numbers, radius, type, fontFamily, fontSize) => {
    let current;
    if (type === "hours") current = (h % 12) || 12;
    if (type === "minutes") current = m;
    if (type === "seconds") current = s;

    return numbers.map((num, i) => {
      const angle = (i / numbers.length) * 360;
      const isCurrent = parseInt(num) === current;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}dvh)`,
            color: isCurrent ? "#ffff00" : "#ffffff",
            textAlign: "center",
            fontFamily: fontFamily,
            fontSize: fontSize,
            margin: 0,
            padding: 0,
          }}
        >
          {num}
        </div>
      );
    });
  };

  if (!mounted) {
    return (
      <div
        style={{
          height: "100dvh",
          width: "100dvw",
          background: "#625D5DFF",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Cinzel20251010';
            src: url(${cinzel20251010}) format('truetype');
          }
          @font-face {
            font-family: 'Roboto20251010';
            src: url(${roboto20251010}) format('opentype');
          }
          @font-face {
            font-family: 'Orbitron20251010';
            src: url(${orbitron20251010}) format('opentype');
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>
      <div
        style={{
          height: "100dvh",
          width: "100dvw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, #111111 40%, #000000 100%)",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "80dvh",
            width: "80dvh",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Hour Disc */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "30dvh",
              height: "30dvh",
              borderRadius: "50%",
              border: "0.5dvh solid #ffd700",
              background: "rgba(255,215,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(-50%, -50%) rotate(${hourAngle}deg)`,
              transition: "transform 0.05s linear",
              margin: 0,
              padding: 0,
            }}
          >
            {renderNumbers(hours, 11, "hours", "Cinzel20251010", "4dvh")}
          </div>

          {/* Minute Disc */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "45dvh",
              height: "45dvh",
              borderRadius: "50%",
              border: "0.5dvh solid #00ffff",
              background: "rgba(0,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(-50%, -50%) rotate(${minuteAngle}deg)`,
              transition: "transform 0.05s linear",
              margin: 0,
              padding: 0,
            }}
          >
            {renderNumbers(minutesSeconds, 18, "minutes", "Roboto20251010", "2.5dvh")}
          </div>

          {/* Second Disc */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "60dvh",
              height: "60dvh",
              borderRadius: "50%",
              border: "0.5dvh solid #ff00ff",
              background: "rgba(255,0,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(-50%, -50%) rotate(${secondAngle}deg)`,
              transition: "transform 0.05s linear",
              margin: 0,
              padding: 0,
            }}
          >
            {renderNumbers(minutesSeconds, 26, "seconds", "Orbitron20251010", "2dvh")}
          </div>
        </div>
      </div>
    </>
  );
}