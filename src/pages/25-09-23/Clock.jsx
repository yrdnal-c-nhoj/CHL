import React, { useEffect, useState } from "react";

// digits
import digit1 from "./z.gif";
import digit2 from "./z2.gif";
import digit10 from "./z3.gif";
import digit12 from "./z4.gif";
import digit5 from "./z5.gif";
import digit6 from "./z6.gif";
import digit7 from "./z7.gif";
import digit8 from "./z8.webp";
import digit9 from "./z9.webp";
import digit11 from "./z10.gif";
import digit3 from "./z11.gif";
import digit4 from "./z12.gif";

// hands
import hourHandImg from "./stteth.gif";
import minuteHandImg from "./sss.webp";
import secondHandImg from "./ste.gif";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const digits = [
    digit12, digit1, digit2, digit3, digit4, digit5,
    digit6, digit7, digit8, digit9, digit10, digit11
  ];

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const handStyle = (angle, width, height) => ({
    position: "absolute",
    bottom: "50%",
    left: "50%",
    width: width,
    height: height,
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: "bottom center",
  });

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle, rgba(223, 221, 20, 0.5) 0%, rgba(159, 126, 20, 0.4) 80%)",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "80vmin",
          width: "80vmin",
          borderRadius: "50%",
        }}
      >
        {/* digits */}
        {digits.map((src, i) => {
          const angle = (i / 12) * 2 * Math.PI;
          const radius = 35;
          const x = 50 + radius * Math.sin(angle);
          const y = 50 - radius * Math.cos(angle);
          return (
            <img
              key={i}
              src={src}
              alt={`digit-${i}`}
              style={{
                position: "absolute",
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
                height: "6rem",
                width: "auto",
              }}
            />
          );
        })}
{/* hour hand */}
<img
  src={hourHandImg}
  alt="hour-hand"
  style={{
    ...handStyle(hourAngle, "6vmin", "17vmin"),
    opacity: 0.8, // hour hand semi-transparent
  }}
/>

{/* minute hand */}
<img
  src={minuteHandImg}
  alt="minute-hand"
  style={{
    ...handStyle(minuteAngle, "12.5vmin", "28vmin"),
    opacity: 0.7, // fully opaque
  }}
/>

{/* second hand */}
<img
  src={secondHandImg}
  alt="second-hand"
  style={{
    ...handStyle(secondAngle, "32vmin", "38vmin"),
    transition: "transform 0.05s cubic-bezier(0.1, 2, 0.25, 1.5)",
    opacity: 0.9, // fully opaque
  }}
/>

       
      </div>
    </div>
  );
}
