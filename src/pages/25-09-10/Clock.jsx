import React, { useEffect, useRef, useState } from "react";

// Local images
import bgImage from "./bg.webp";
import hourHand from "./hour.gif";
import minuteHand from "./min.gif";
import secondHand from "./sec.gif";

// Local font
import customLavaFont from "./lava.otf";

const Clock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  // Clock ticking
  useEffect(() => {
    if (!isReady) return;

    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360;
      const hourDeg = (hours / 12) * 360;

      if (hourRef.current)
        hourRef.current.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
    };

    const interval = setInterval(updateClock, 20);
    updateClock();
    return () => clearInterval(interval);
  }, [isReady]);

  // Preload font and background
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    const checkReady = () => {
      if (fontLoaded && imageLoaded) setIsReady(true);
    };

    // Load font
    const font = new FontFace("CustomLavaFont_25_09_18", `url(${customLavaFont})`);
    font.load().then(() => {
      fontLoaded = true;
      checkReady();
    });

    // Load background image
    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
  }, []);

  if (!isReady) {
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'CustomLavaFont_25_09_18', sans-serif",
      }}
    >
      {/* Scoped font injection */}
      <style>{`
        @font-face {
          font-family: 'CustomLavaFont_25_09_18';
          src: url(${customLavaFont}) format('opentype');
        }
      `}</style>

      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Clock face container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95vmin",
          height: "95vmin",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          zIndex: 2,
        }}
      >
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const radius = 40;
          const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const y = 50 - radius * Math.cos((angle * Math.PI) / 180);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                fontSize: "4rem",
                color: "#EA81E0FF",
                textShadow: `
                  0.7rem 0 0.9rem red,
                  -0.3rem 0 0.3rem yellow
                `,
                textAlign: "center",
                zIndex: 3,
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Clock hands */}
      <img
        ref={hourRef}
        src={hourHand}
        alt="hour hand"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "17vmin",
          height: "29vmin",
          transformOrigin: "50% 100%",
          zIndex: 4,
        }}
      />
      <img
        ref={minuteRef}
        src={minuteHand}
        alt="minute hand"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "16vmin",
          height: "45vmin",
          transformOrigin: "50% 100%",
          zIndex: 5,
        }}
      />
      <img
        ref={secondRef}
        src={secondHand}
        alt="second hand"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "12vmin",
          height: "48vmin",
          transformOrigin: "50% 100%",
          zIndex: 6,
        }}
      />
    </div>
  );
};

export default Clock;
