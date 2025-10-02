import React, { useState, useEffect } from "react";
import customFont1001 from "./stt.ttf";

export default function StripedClock() {
  const [time, setTime] = useState([]);

  function getClockTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    return (h + m).split("");
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
          src: url(${customFont1001}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes slideStripes {
          from { background-position: 0 0; }
          to   { background-position: 200rem 200rem; }
        }

        @keyframes slideStripesReverse {
          from { background-position: 0 0; }
          to   { background-position: -200rem -200rem; }
        }

        .animated-bg {
          animation: slideStripesReverse 6040s linear infinite;
        }

        .animated-text {
          animation: slideStripes 6040s linear infinite;
          display: flex;
          font-family: 'CustomFont1001', sans-serif;
          font-size: 33vw;
          color: transparent;
          background: ${stripeGradient};
          background-size: 0.8rem 0.8rem;
          -webkit-background-clip: text;
          background-clip: text;
          line-height: 1;
        }

        .digit-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: -0.9rem;       /* fixed width for each digit */
          height: 32rem;      /* fixed height for equal boxing */
          overflow: hidden; /* ensures no clipping outside the box */
        }
      `}</style>

      <div
        className="animated-bg"
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: stripeGradient,
          backgroundSize: "0.8rem 0.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="animated-text">
          {time.map((digit, i) => (
            <span key={i} className="digit-box">
              {digit}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
