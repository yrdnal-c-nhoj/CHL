// ClockNumbers.jsx
import { useState, useEffect } from "react";

export default function ClockNumbers() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const updateHour = () => {
      setCurrentHour(new Date().getHours());
    };

    updateHour(); // initial set
    const interval = setInterval(updateHour, 1000); // update every second (for smooth transition at midnight)

    return () => clearInterval(interval);
  }, []);

  const numbers = Array.from({ length: 25 }, (_, i) => i); // 0 to 24

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",        // default: vertical (mobile)
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: "clamp(2rem, 8vw, 10vh)",
        fontWeight: "bold",
        overflow: "hidden",
        padding: "2vh 0",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        gap: "1vh",
      }}
    >
      {numbers.map((num) => {
        const isCurrent = num === currentHour;
        return (
          <div
            key={num}
            style={{
              width: "100%",
              textAlign: "center",
              padding: "1vh 0",
              backgroundColor: isCurrent ? "#0f0" : "transparent",
              color: isCurrent ? "#000" : "#0f0",
              border: isCurrent ? "none" : "2px solid #0f0",
              borderRadius: isCurrent ? "8px" : "0",
              transition: "all 0.6s ease",
              opacity: isCurrent ? 1 : 0.3,
              transform: isCurrent ? "scale(1.1)" : "scale(1)",
            }}
          >
            {num.toString().padStart(2, "0")}
          </div>
        );
      })}

      {/* Media query alternative using container query-like behavior via window size */}
      <style jsx>{`
        @media (min-width: 768px) {
          div[style*="flexDirection: column"] {
            flex-direction: row !important;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 2vw;
            padding: 2vw;
          }
          div[style*="flexDirection: column"] > div {
            width: auto !important;
            padding: 2vh 3vw !important;
            font-size: clamp(3rem, 6vw, 8vh) !important;
          }
        }
      `}</style>
    </div>
  );
}