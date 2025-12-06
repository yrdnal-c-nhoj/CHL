import React, { useEffect, useState } from "react";

// Import assets
import bgImage from "./giraffe.webp";
import hourHandImg from "./hand3.gif";
import minuteHandImg from "./hand1.gif";
import secondHandImg from "./hand2.gif";
import customFont_2025_1206 from "./gir.otf";
import { color } from "three/tsl";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont_2025_1206}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 / 16);
    return () => clearInterval(timer);
  }, []);

  const now = time;
  const totalHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600 + now.getMilliseconds() / 3600000;
  const totalMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
  const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;

  const hourDeg = totalHours * 30;
  const minuteDeg = totalMinutes * 6;
  const secondDeg = totalSeconds * 6;

  const outerContainerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const clockContainerStyle = {
    width: "95vmin",
    height: "95vmin",
    borderRadius: "50%",
    position: "relative",
    margin: "0 auto",
    opacity: 1,
  };

  const handStyle = (img, deg, width, height) => ({
    position: "absolute",
    width: `${width}vmin`,
    height: `${height}vmin`,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: "50% 100%",
    top: "50%",
    left: "50%",
    imageRendering: "auto",
    transition: "transform 0.0625s linear",
    zIndex: 10,
    maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%)",
    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%)",
  });

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const numberStyle = (num) => {
    const angle = ((num - 3) * 30) * (Math.PI / 180);
    const radius = 45;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      position: "absolute",
      left: `calc(50% + ${x}vmin)`,
      top: `calc(50% + ${y}vmin)`,
      fontSize: "clamp(8rem, 9vh, 9.5rem)",
      fontFamily: "CustomClockFont",
      userSelect: "none",
      textAlign: "center",
      transform: "translate(-50%, -50%)",
      textShadow: "1px 1px 0 white",
    };
  };

  return (
    <div style={outerContainerStyle}>
      <div style={clockContainerStyle}>
        {numbers.map((num) => (
          <div key={num} style={numberStyle(num)}>
            {num}
          </div>
        ))}
        <img src={hourHandImg} alt="hour" style={handStyle(hourHandImg, hourDeg, 28, 44)} />
        <img src={minuteHandImg} alt="minute" style={handStyle(minuteHandImg, minuteDeg, 25, 52)} />
        <img src={secondHandImg} alt="second" style={handStyle(secondHandImg, secondDeg, 26, 58)} />
      </div>
    </div>
  );
}
