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
        hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'CustomFont', sans-serif",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'CustomFont';
          src: url(${customLavaFont}) format('opentype');
        }
      `}</style>

      {/* Perfectly centered clock */}
      <div
        style={{
          position: "relative",
          width: "80vw",
          height: "80vw",
          maxWidth: "80dvh",
          maxHeight: "80dvh",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >



{/* Numbers 1–12 */}
{[...Array(12)].map((_, i) => {
  const angle = (i + 1) * 30;
  const x = 50 + 40 * Math.sin((angle * Math.PI) / 180);
  const y = 50 - 40 * Math.cos((angle * Math.PI) / 180);
  return (
    <div
      key={i}
      style={{
        position: "absolute",
        top: `${y}%`,
        left: `${x}%`,
        transform: "translate(-50%, -50%)",
        fontSize: "5rem",
        color: "#EA81E0FF", // base color
        textShadow: `
          7px 0 0.9rem red,   /* red shadow to right */
          -0.3rem 0 0.3rem yellow /* yellow shadow to left */
        `,
      }}
    >
      {i + 1}
    </div>
  );
})}






        {/* Hour Hand */}
        <img
          ref={hourRef}
          src={hourHand}
          alt="hour hand"
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "9vw",
            height: "25%",
            transformOrigin: "50% 100%",
          }}
        />

        {/* Minute Hand */}
        <img
          ref={minuteRef}
          src={minuteHand}
          alt="minute hand"
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "vw",
            height: "35%",
            transformOrigin: "50% 100%",
          }}
        />

        {/* Second Hand */}
        <img
          ref={secondRef}
          src={secondHand}
          alt="second hand"
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "5vw",
            height: "40%",
            transformOrigin: "50% 100%",
          }}
        />
      </div>
    </div>
  );
};

export default Clock;
