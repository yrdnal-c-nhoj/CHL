import React, { useState, useEffect, useRef } from "react";

export default function NestedDiscsClock() {
  const [time, setTime] = useState(new Date());
  const animationRef = useRef();

  useEffect(() => {
    const animate = () => {
      setTime(new Date());
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Continuous rotation degrees (counterclockwise)
  const hourDeg = -((hours % 12) * 30 + minutes * 0.5 + (seconds / 60) * 0.5);
  const minuteDeg = -(minutes * 6 + seconds * 0.1 + (milliseconds / 1000) * 0.1);
  const secondDeg = -(seconds * 6 + (milliseconds / 1000) * 6);

  // Disc style with gradient and subtle inner shadow
  const discStyle = (sizeVh, deg, colorStart, colorEnd) => ({
    width: `${sizeVh}vh`,
    height: `${sizeVh}vh`,
    borderRadius: "50%",
    border: `0.3vh solid ${colorEnd}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: `rotate(${deg}deg)`,
    position: "absolute",
    background: `radial-gradient(circle at center, ${colorStart}, ${colorEnd})`,
    boxShadow: "inset -0.5vh -0.5vh 1vh rgba(0,0,0,0.2)",
  });

  const containerStyle = {
    position: "relative",
    width: "50vh",
    height: "50vh",
    margin: "auto",
    top: "10vh",
  };

  const digitalClockStyle = {
    position: "absolute",
    right: "5vh",
    top: "10vh",
    fontSize: "4vh",
    fontFamily: "monospace",
    color: "#000",
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div style={containerStyle}>
        {/* Outer disc: seconds */}
        <div style={discStyle(50, secondDeg, "#FFA07A", "#FF6347")} />
        {/* Middle disc: minutes */}
        <div style={discStyle(35, minuteDeg, "#87CEFA", "#4682B4")} />
        {/* Inner disc: hours */}
        <div style={discStyle(20, hourDeg, "#90EE90", "#32CD32")} />
      </div>

      {/* Digital clock on the right */}
      <div style={digitalClockStyle}>
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}
