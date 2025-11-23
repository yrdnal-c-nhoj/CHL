// DonutClock.jsx
import { useState, useEffect } from "react";

export default function DonutClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12; // 12-hour format for hand movement

  // Angles (clockwise from 12 o'clock)
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;

  // 24-hour progress (full circle = 24h)
  const totalSecondsInDay = 24 * 60 * 60;
  const secondsSoFar =
    time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
  const dayProgress = (secondsSoFar / totalSecondsInDay) * 360;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80vmin",
          height: "80vmin",
          borderRadius: "50%",
          backgroundColor: "#1e293b",
          boxShadow: "0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {/* 24-hour Donut Progress Ring */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)",
          }}
          viewBox="0 0 100 100"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="10"
            strokeDasharray={`${dayProgress} ${360 - dayProgress}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1s linear",
            }}
          />
        </svg>

        {/* Clock Face */}
        <div
          style={{
            position: "absolute",
            inset: "8vmin",
            borderRadius: "50%",
            backgroundColor: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Hour Marks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 50 + 38 * Math.cos(angle);
            const y = 50 + 38 * Math.sin(angle);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  color: i === 0 ? "#ec4899" : "#94a3b8",
                  fontSize: "4vmin",
                  fontWeight: i === 0 ? "bold" : "normal",
                }}
              >
                {i === 0 ? 12 : i}
              </div>
            );
          })}

          {/* Center Dot */}
          <div
            style={{
              position: "absolute",
              width: "4vmin",
              height: "4vmin",
              backgroundColor: "#ec4899",
              borderRadius: "50%",
              zIndex: 10,
            }}
          />

          {/* Hour Hand */}
          <div
            style={{
              position: "absolute",
              width: "2vmin",
              height: "20vmin",
              backgroundColor: "#e2e8f0",
              borderRadius: "1vmin",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              left: "50%",
              bottom: "50%",
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 3,
            }}
          />

          {/* Minute Hand */}
          <div
            style={{
              position: "absolute",
              width: "1.5vmin",
              height: "30vmin",
              backgroundColor: "#94a3b8",
              borderRadius: "1vmin",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              left: "50%",
              bottom: "50%",
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 4,
            }}
          />

          {/* Second Hand */}
          <div
            style={{
              position: "absolute",
              width: "0.5vmin",
              height: "35vmin",
              backgroundColor: "#ec4899",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              left: "50%",
              bottom: "50%",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 5,
            }}
          />

          {/* Digital Time (optional) */}
          <div
            style={{
              position: "absolute",
              bottom: "10vmin",
              color: "#e2e8f0",
              fontSize: "4vmin",
              letterSpacing: "0.2ch",
              fontWeight: "300",
            }}
          >
            {time.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}