// Clock.jsx
import React, { useEffect, useState } from "react";
import backgroundImg from "./bg.jpg";
import hourHandImg from "./hour.gif";
import minuteHandImg from "./min.gif";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Track window resize
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clock angles
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const hourAngle = (360 / 12) * hours + (360 / (12 * 60)) * minutes;
  const minuteAngle = (360 / 60) * minutes;

  // Determine main clock size (80% of smaller viewport dimension)
  const clockSize = Math.min(windowSize.width, windowSize.height) * 0.8;
  const offset = clockSize * 1.1; // spacing for duplicates

  // Determine orientation
  const isWide = windowSize.width >= windowSize.height;

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  };

  const handStyle = (angle, lengthScale = 0.5, zIndex = 5) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: `${lengthScale * 100}%`,
    height: `${lengthScale * 100}%`,
    transformOrigin: "center center",
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    pointerEvents: "none",
    userSelect: "none",
    zIndex,
  });

  const handImageStyle = (contrast = 80, brightness = 200) => ({
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: `contrast(${contrast}%) brightness(${brightness}%)`,
  });

  const backgroundStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    top: 0,
    left: 0,
    zIndex: 1,
  };

  const ClockInstance = ({ offsetX = 0, offsetY = 0 }) => {
    const wrapperStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: `${clockSize}px`,
      height: `${clockSize}px`,
      transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
    };

    return (
      <div style={wrapperStyle}>
        <img src={backgroundImg} alt="Clock Background" style={backgroundStyle} />
        <div style={handStyle(hourAngle, 0.33, 5)}>
          <img src={hourHandImg} alt="Hour Hand" style={handImageStyle(80, 200)} />
        </div>
        <div style={handStyle(minuteAngle, 0.56, 10)}>
          <img src={minuteHandImg} alt="Minute Hand" style={handImageStyle(80, 190)} />
        </div>
      </div>
    );
  };

  // Duplicates
  const clocks = [
    <ClockInstance key="center" />,
    ...(isWide
      ? [<ClockInstance key="left" offsetX={-offset} />, <ClockInstance key="right" offsetX={offset} />]
      : [<ClockInstance key="top" offsetY={-offset} />, <ClockInstance key="bottom" offsetY={offset} />]),
  ];

  return <div style={containerStyle}>{clocks}</div>;
}
