import React, { useEffect, useState } from "react";
import backgroundImg from "./fr.jpg";
import hourHandImg from "./fre.webp";
import minuteHandImg from "./fren.webp";
import secondHandImg from "./fren.png";

export default function DecimalAnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate angles
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30; // 360 / 12 = 30
  const minuteDeg = (minutes + seconds / 60) * 6; // 360 / 60 = 6
  const secondDeg = seconds * 6;

  const handBaseStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "bottom center",
  };

  // Outline layer for hour and minute hands
  const outlineStyle = (handImg, width, height, deg) => ({
    ...handBaseStyle,
    width,
    height,
    zIndex: 6,
    backgroundColor: "black",
    transform: `translateX(-50%) rotate(${deg}deg) scale(1.05)`, // slightly bigger for outline
    WebkitMaskImage: `url(${handImg})`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "100% 100%",
    maskImage: `url(${handImg})`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "100% 100%",
  });

  const hourHandStyle = {
    ...handBaseStyle,
    width: "10vh",
    height: "20vh",
    zIndex: 7,
    backgroundImage: `url(${hourHandImg})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    width: "7.5vh",
    height: "25vh",
    zIndex: 7,
    backgroundImage: `url(${minuteHandImg})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
  };

  const secondHandStyle = {
    ...handBaseStyle,
    width: "5vh",
    height: "28vh",
    zIndex: 8,
    backgroundImage: `url(${secondHandImg})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: `translateX(-50%) rotate(${secondDeg}deg)`,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Outline layers */}
      <div style={outlineStyle(hourHandImg, "10vh", "20vh", hourDeg)} />
      <div style={outlineStyle(minuteHandImg, "7.5vh", "25vh", minuteDeg)} />

      {/* Hands */}
      <div style={hourHandStyle} />
      <div style={minuteHandStyle} />
      <div style={secondHandStyle} />
    </div>
  );
}
