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
    const interval = setInterval(() => setTime(new Date()), 30); // smooth animation
    return () => clearInterval(interval);
  }, []);

  const digits = [
    digit12, digit1, digit2, digit3, digit4, digit5,
    digit6, digit7, digit8, digit9, digit10, digit11
  ];

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const milliseconds = time.getMilliseconds();

  const secondAngleBase = (seconds / 60) * 360;

  // Less exaggerated ticking: smooth small overshoot
  const crazySecondAngle = (() => {
    const progress = milliseconds / 1000; // 0 → 1
    if (progress < 0.5) {
      // First half: subtle overshoot
      return secondAngleBase + Math.sin(progress * Math.PI) * 6; // ±6° overshoot
    } else {
      // Second half: hold at final position
      return secondAngleBase;
    }
  })();

  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const handStyle = (angle, width, height, extraShadow = "") => ({
    position: "absolute",
    bottom: "50%",
    left: "50%",
    width: width,
    height: height,
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: "bottom center",
    filter: `
      drop-shadow(0.4rem 0.4rem 1.2rem rgba(0,0,0,0.55)) 
      drop-shadow(-0.1rem -0.1rem 0.1rem rgba(220,230,25,0.9))
      drop-shadow(0.05rem 0.05rem 0.05rem white)
      ${extraShadow}
    `,
  });

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle, rgba(223, 221, 220, 0.2) 0%, rgba(159, 126, 120, 0.4) 80%)",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "80vmin",
          width: "80vmin",
          borderRadius: "50%",
          boxShadow:
            "inset -1.2rem -1.2rem 2.4rem rgba(0,0,0,0.35), inset 1.2rem 1.2rem 2.4rem rgba(220,235,255,0.3), 0 1.5rem 3rem rgba(0,0,0,0.35)",
          background: "radial-gradient(circle at center, rgba(210,210,210,0.2) 10%, rgba(60,60,60,0.2) 90%)",
        }}
      >{digits.map((src, i) => {
  const angle = (i / 12) * 2 * Math.PI;
  const radius = 35;
  const x = 50 + radius * Math.sin(angle);
  const y = 50 - radius * Math.cos(angle);

  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);

  const offset = 0.09;
  const outwardX = dx * offset;
  const outwardY = dy * offset;
  const inwardX = -dx * offset;
  const inwardY = -dy * offset;

  // base shadow (white inward + black outward for everything except 7)
  let shadowFilter = `
    drop-shadow(${inwardX}rem ${inwardY}rem 0 white)
    drop-shadow(0.6rem 0.6rem 1.4rem rgba(0,0,0,0.25))
    drop-shadow(-0.4rem -0.4rem 0.9rem rgba(200,220,255,0.4))
  `;

  if (i !== 6) {
    shadowFilter = `
      drop-shadow(${outwardX}rem ${outwardY}rem 0 black)
      ${shadowFilter}
    `;
  }

  // Add bluish blower behind all digits
  shadowFilter = `
    drop-shadow(0 0 0.9rem rgba(100,150,255,0.8))
    ${shadowFilter}
  `;

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
        filter: shadowFilter,
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
            opacity: 0.75,
          }}
        />

        {/* minute hand */}
        <img
          src={minuteHandImg}
          alt="minute-hand"
          style={{
            ...handStyle(minuteAngle, "12.5vmin", "28vmin"),
            opacity: 0.7,
          }}
        />

        {/* subtle ticking second hand */}
        <img
          src={secondHandImg}
          alt="second-hand"
          style={{
            ...handStyle(crazySecondAngle, "32vmin", "38vmin"),
            transition: "transform 0.05s cubic-bezier(0.1, 2, 0.25, 1.5)",
          }}
        />
      </div>
    </div>
  );
}
