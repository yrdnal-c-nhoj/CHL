import React, { useState, useEffect } from "react";

// === Local assets ===
import backgroundVideo from "./big.mp4";
import fallbackGif from "./big.webp";
import OctFont from "./str.ttf";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Preload font
  useEffect(() => {
    const font = new FontFace("Oct022025Font", `url(${OctFont})`);
    font
      .load()
      .then(() => {
        document.fonts.add(font);
        setTimeout(() => setReady(true), 200);
      })
      .catch(() => {
        console.error("Font failed to load");
        setReady(true);
      });
  }, []);

  // Force autoplay (iOS sometimes ignores initial play call)
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    // Attempt several times in case of delayed video load
    tryPlay();
    const t1 = setTimeout(tryPlay, 500);
    const t2 = setTimeout(tryPlay, 1500);
    const t3 = setTimeout(tryPlay, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [ready]);

  const clockSize = "80%";
  const center = { x: 50, y: 50 };
  const radius = 45;

  const numbers = [
    { digit: "twelve", angle: 0 },
    { digit: "one", angle: 30 },
    { digit: "two", angle: 60 },
    { digit: "three", angle: 90 },
    { digit: "four", angle: 120 },
    { digit: "five", angle: 150 },
    { digit: "six", angle: 180 },
    { digit: "seven", angle: 210 },
    { digit: "eight", angle: 240 },
    { digit: "nine", angle: 270 },
    { digit: "ten", angle: 300 },
    { digit: "eleven", angle: 330 },
  ];

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const handStyle = (width, length, color, angle) => ({
    position: "absolute",
    width,
    height: length,
    backgroundColor: color,
    top: "50%",
    left: "50%",
    transformOrigin: "50% 100%",
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    pointerEvents: "none",
  });

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundColor: "black",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        isolation: "isolate",
        backgroundColor: "#111",
      }}
    >
      {/* Inject font-face */}
      <style>
        {`
          @font-face {
            font-family: "Oct022025Font";
            src: url(${OctFont}) format("woff2");
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Background video with autoplay + fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        onLoadedData={(e) => e.target.play().catch(() => {})}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100dvh",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        <img
          src={fallbackGif}
          alt="Fallback background"
          style={{
            width: "100vw",
            height: "100dvh",
            objectFit: "cover",
          }}
        />
      </video>

      {/* Clock face */}
      <div
        style={{
          position: "relative",
          width: clockSize,
          height: clockSize,
          borderRadius: "50%",
          isolation: "isolate",
        }}
      >
        {/* Hands */}
        <div style={handStyle("0.05rem", "18dvh", "white", hourAngle)} />
        <div style={handStyle("0.05rem", "28dvh", "white", minuteAngle)} />
        <div style={handStyle("0.15rem", "32dvh", "red", secondAngle)} />

        {/* Numbers */}
        {numbers.map((num, idx) => {
          const angleRad = (num.angle - 90) * (Math.PI / 180);
          const x = center.x + radius * 0.9 * Math.cos(angleRad);
          const y = center.y + radius * 0.9 * Math.sin(angleRad);
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                fontFamily: "Oct022025Font, sans-serif",
                fontSize: "12vw",
                color: "white",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              {num.digit}
            </div>
          );
        })}
      </div>
    </div>
  );
}
