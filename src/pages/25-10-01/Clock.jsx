import React, { useState, useEffect } from "react";

export default function StripedClock() {
  const [time, setTime] = useState("");

  function getClockTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  useEffect(() => {
    setTime(getClockTime());
    const id = setInterval(() => setTime(getClockTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const stripeGradient = `
    linear-gradient(
      136deg,
      #000 0%, #000 24.9%,
      #fff 25%, #fff 49.9%,
      #000 50%, #000 74.9%,
      #fff 75%, #fff 100%
    )
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideStripes {
          from {
            background-position: 0px 0px;
          }
          to {
            background-position: 4800px 4800px;
          }
        }
        .animated-bg {
          animation: slideStripes 240s linear infinite;
        }
        .animated-text {
          animation: slideStripes 240s linear infinite;
        }
      `}</style>
      <div className="animated-bg" style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `
          linear-gradient(
            135deg,
            #000 0%, #000 24.9%,
            #fff 25%, #fff 49.9%,
            #000 50%, #000 74.9%,
            #fff 75%, #fff 100%
          )
        `,
        backgroundSize: "3rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        <div className="animated-text" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "12rem",
          fontWeight: "bold",
          color: "transparent",
          background: stripeGradient,
          backgroundSize: "3rem 3rem",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          lineHeight: "1",
          textAlign: "center",
        }}>
          {time}
        </div>
      </div>
    </>
  );
}