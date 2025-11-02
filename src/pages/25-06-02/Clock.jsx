import React, { useEffect, useState } from "react";

// Images
import bg1Img from "./bg1.png";
import bg2Img from "./bg2.gif";
import bg3Img from "./bg3.webp";
import bg4Img from "./bg4.webp";

import number1Img from "./num1.webp";
import number2Img from "./num2.webp";
import number3Img from "./num3.webp";
import number4Img from "./num4.webp";
import number5Img from "./num5.webp";
import number6Img from "./num6.webp";
import number7Img from "./num7.webp";
import number8Img from "./num8.webp";
import number9Img from "./num9.webp";
import number10Img from "./num10.webp";
import number11Img from "./num11.webp";
import number12Img from "./num12.webp";

import hourHandImg from "./min.png";
import minuteHandImg from "./min.png";
import secondHandImg from "./min.png";

export default function AnalogImageClock() {
  const [time, setTime] = useState(new Date());
  const [gradientShift, setGradientShift] = useState(0); // for gradient animation

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Gradient animation
  useEffect(() => {
    const anim = setInterval(() => {
      setGradientShift(prev => (prev + 0.5) % 360);
    }, 50); // adjust speed here
    return () => clearInterval(anim);
  }, []);

  const numberImages = [
    number12Img,
    number1Img,
    number2Img,
    number3Img,
    number4Img,
    number5Img,
    number6Img,
    number7Img,
    number8Img,
    number9Img,
    number10Img,
    number11Img,
  ];

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  const renderNumbers = () =>
    numberImages.map((img, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180); // start from top
      const radius = 40; // percent radius
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      return (
        <img
          key={i}
          src={img}
          alt={`number-${i}`}
          style={{
            position: "absolute",
            width: "18%",
            height: "18%",
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      );
    });

  const handStyle = (deg, widthPercent, heightPercent) => ({
    position: "absolute",
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    top: "50%",
    left: "50%",
    transform: `rotate(${deg}deg) translate(-50%, -50%)`,
    transformOrigin: "50% 50%",
  });

  // Fully customizable backgrounds
  const backgrounds = [
    {
      src: bg1Img,
      opacity: 0.91,
      width: "100%",
      height: "100%",
      top: "50%",
      left: "50%",
      objectFit: "cover",
      zIndex: 1,
    },
    {
      src: bg2Img,
      opacity: 0.91,
    //   width: "90%",
    //   height: "90%",
       top: "52%",
      left: "48%",
      objectFit: "contain",
      zIndex: 2,
    },
    {
      src: bg3Img,
      opacity: 0.8,
     width: "70%",
      height: "70%",
      top: "56%",
      left: "50%",
      objectFit: "cover",
      zIndex: 3,
    },
    {
      src: bg4Img,
    //    opacity: 0.7,
      width: "70%",
    //   height: "70%",
      top: "40%",
      left: "50%",
      objectFit: "cover",
      zIndex: 4,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(${gradientShift}deg, #1a1a1a, #3a3a3a, #5a5a5a)`,
        transition: "background 0.05s linear",
        overflow: "hidden",
      }}
    >
      {/* Render backgrounds */}
      {backgrounds.map((bg, idx) => (
        <img
          key={idx}
          src={bg.src}
          alt={`background-${idx}`}
          style={{
            position: "absolute",
            width: bg.width,
            height: bg.height,
            top: bg.top,
            left: bg.left,
            transform: "translate(-50%, -50%)",
            zIndex: bg.zIndex,
            opacity: bg.opacity,
            objectFit: bg.objectFit,
          }}
        />
      ))}

      {/* Clock face */}
      <div
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vw",
          maxWidth: "100vh",
          maxHeight: "100vh",
          borderRadius: "50%",
          overflow: "hidden",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        {renderNumbers()}
        <img src={hourHandImg} alt="hour-hand" style={handStyle(hourDeg, 6, 25)} />
        <img src={minuteHandImg} alt="minute-hand" style={handStyle(minuteDeg, 3, 35)} />
        <img src={secondHandImg} alt="second-hand" style={handStyle(secondDeg, 2, 40)} />
      </div>
    </div>
  );
}
