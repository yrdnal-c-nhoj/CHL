import React, { useState, useEffect } from "react";

// Import the OTF font file
import customFont1001 from "./str.ttf";

export default function StripedClock() {
  const [time, setTime] = useState([]);

  function getClockTime() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "pm" : "am";

    h = h % 12;
    if (h === 0) h = 12;
    const hh = h.toString().padStart(2, "0");

    return (hh + m + ampm).split("");
  }

  useEffect(() => {
    setTime(getClockTime());
    const id = setInterval(() => setTime(getClockTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const stripeGradient = `
    linear-gradient(
      0deg,
      #000 0%, #000 24.9%,
      #fff 25%, #fff 49.9%,
      #000 50%, #000 74.9%,
      #fff 75%, #fff 100%
    )
  `;

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'CustomFont1001';
          src: url(${customFont1001}) format('opentype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes slideStripes {
          from { background-position: 0 0; }
          to   { background-position: 4800px 4800px; }
        }

        @keyframes slideStripesReverse {
          from { background-position: 0 0; }
          to   { background-position: -4800px -4800px; }
        }

        .animated-bg {
          animation: slideStripesReverse 6040s linear infinite;
        }

        .animated-text {
          animation: slideStripes 6040s linear infinite;
          display: flex;
          font-family: 'CustomFont1001', sans-serif;
          font-size: 14vw;
          font-weight: bold;
          color: transparent;
          background: ${stripeGradient};
          background-size: 3rem 3rem;
          -webkit-background-clip: text;
          background-clip: text;
          line-height: 1;
          letter-spacing: -0.0rem; /* small negative space between chars */
        }
      `}</style>

      <div
        className="animated-bg"
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: stripeGradient,
          backgroundSize: "3rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div className="animated-text">{time.join("")}</div>
      </div>
    </>
  );
}
