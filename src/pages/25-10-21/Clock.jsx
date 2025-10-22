// Clock.jsx
import React, { useEffect, useState } from "react";
import backgroundImg from "./bg.jpg";
import hourHandImg from "./hour.gif";
import minuteHandImg from "./min.gif";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();

  const hourAngle = (360 / 12) * hours + (360 / (12 * 60)) * minutes;
  const minuteAngle = (360 / 60) * minutes;

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100dvh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  };

  // The largest possible size for center clock
  const centerClockSize = Math.min(window.innerWidth, window.innerHeight);

  // Helper to render a clock at offset
  const ClockInstance = ({ offsetX = 0, offsetY = 0, size = centerClockSize }) => {
    const wrapperStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: `${size}px`,
      height: `${size}px`,
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
    };

    const handStyle = (img, angle, lengthScale = 0.5, slideFactor = 0) => ({
      position: "absolute",
      top: "50%",
      left: "50%",
      width: `${lengthScale * 100}%`,
      height: `${lengthScale * 100}%`,
      transformOrigin: "center center",
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${slideFactor}%)`,
      pointerEvents: "none",
      userSelect: "none",
      zIndex: img === minuteHandImg ? 10 : 5,
    });

    const handImage = ({ contrast = 50, brightness = 30 }) => ({
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

    return (
      <div style={wrapperStyle}>
        <img src={backgroundImg} alt="Clock Background" style={backgroundStyle} />
        <div style={handStyle(hourHandImg, hourAngle, 0.33, -22)}>
          <img src={hourHandImg} alt="Hour Hand" style={handImage({ contrast: 80, brightness: 200 })} />
        </div>
        <div style={handStyle(minuteHandImg, minuteAngle, 0.56, -31)}>
          <img src={minuteHandImg} alt="Minute Hand" style={handImage({ contrast: 80, brightness: 190 })} />
        </div>
      </div>
    );
  };

  // Determine offset for duplicates
  const offset = centerClockSize; // same as center clock size

  const clocks = [
    <ClockInstance key="center" />,
    ...(isWide
      ? [<ClockInstance key="left" offsetX={-offset} />, <ClockInstance key="right" offsetX={offset} />]
      : [<ClockInstance key="top" offsetY={-offset} />, <ClockInstance key="bottom" offsetY={offset} />]),
  ];

  return <div style={containerStyle}>{clocks}</div>;
}
