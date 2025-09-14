import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => String(num).padStart(2, "0").split("");

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  const DigitBox = ({ value }) => (
    <div
      style={{
        minWidth: "8vw",
        minHeight: "14dvh",
        margin: "0 0.8vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "6rem",
        fontWeight: "700",
        borderRadius: "2rem",
        color: "#ffffff",
        background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
        boxShadow:
          "0 0 2rem rgba(255,255,255,0.5), inset 0 0 1.5rem rgba(255,255,255,0.15), 0 0 4rem rgba(0,150,255,0.4)",
        backdropFilter: "blur(1.5rem)",
        transition: "all 0.4s ease",
        animation: "shimmer 4s infinite linear",
      }}
    >
      {value}
    </div>
  );

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #1a0033 0%, #002060 50%, #004080 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {hours.map((d, i) => (
          <DigitBox key={`h-${i}`} value={d} />
        ))}
        <div
          style={{
            fontSize: "6rem",
            fontWeight: "300",
            color: "rgba(255,255,255,0.75)",
            margin: "0 1vw",
          }}
        >
          :
        </div>
        {minutes.map((d, i) => (
          <DigitBox key={`m-${i}`} value={d} />
        ))}
        <div
          style={{
            fontSize: "6rem",
            fontWeight: "300",
            color: "rgba(255,255,255,0.75)",
            margin: "0 1vw",
          }}
        >
          :
        </div>
        {seconds.map((d, i) => (
          <DigitBox key={`s-${i}`} value={d} />
        ))}
      </div>

      {/* inline keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { box-shadow: 0 0 2rem rgba(255,255,255,0.5), inset 0 0 1.5rem rgba(255,255,255,0.15), 0 0 4rem rgba(0,150,255,0.4); }
          50% { box-shadow: 0 0 3rem rgba(255,255,255,0.7), inset 0 0 2rem rgba(255,255,255,0.25), 0 0 5rem rgba(0,200,255,0.6); }
          100% { box-shadow: 0 0 2rem rgba(255,255,255,0.5), inset 0 0 1.5rem rgba(255,255,255,0.15), 0 0 4rem rgba(0,150,255,0.4); }
        }
      `}</style>
    </div>
  );
};

export default DigitalClock;
