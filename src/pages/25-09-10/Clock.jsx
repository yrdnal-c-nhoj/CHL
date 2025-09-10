import React, { useEffect, useRef } from "react";

// Local images
import bgImage from "./bg.gif";
import hourHand from "./hour.gif";
import minuteHand from "./min.gif";
import secondHand from "./sec.gif";

// Local font
import customLavaFont from "./lava.otf";

const Clock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'CustomFont', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'CustomFont';
          src: url(${customLavaFont}) format('opentype');
        }
      `}</style>

      {/* Clock face container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vmin",
          height: "90vmin",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          zIndex: 1,
        }}
      >
        {/* Numbers 1–12 */}
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
                  7px 0 0.9rem red,
                  -0.3rem 0 0.3rem yellow
                `,
                textAlign: "center",
                zIndex: 1,
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Clock hands, centered in viewport */}
      <img
        ref={hourRef}
        src={hourHand}
        alt="hour hand"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "17vmin",
          height: "22vmin",
          transformOrigin: "50% 100%", // Rotate around bottom center
          zIndex: 3,
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
          width: "12vmin",
          height: "45vmin",
          transformOrigin: "50% 100%", // Rotate around bottom center
          zIndex: 2,
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
          width: "9vmin",
          height: "44vmin",
          transformOrigin: "50% 100%", // Rotate around bottom center
          zIndex: 4,
        }}
      />
    </div>
  );
};

export default Clock;