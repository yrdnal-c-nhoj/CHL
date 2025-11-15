import React, { useEffect, useRef } from "react";

// Replace these with your real images in the same folder
import num1 from "./1.jpg";
import num2 from "./2.png";
import num3 from "./3.png";
import num4 from "./4.jpg";
import num5 from "./5.jpg";
import num6 from "./6.jpg";
import num7 from "./7.jpg";
import num8 from "./8.jpg";
import num9 from "./9.png";
import num10 from "./10.jpg";
import num11 from "./11.png";
import num12 from "./12.png";

const numberImages = [
  num12, num1, num2, num3, num4, num5,
  num6, num7, num8, num9, num10, num11
];

export default function ImageAnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    function update() {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const sDeg = s * 6;
      const mDeg = m * 6;
      const hDeg = h * 30;

      hourRef.current.style.transform = 
        `translate(-50%, -100%) rotate(${hDeg}deg)`;

      minuteRef.current.style.transform = 
        `translate(-50%, -100%) rotate(${mDeg}deg)`;

      secondRef.current.style.transform = 
        `translate(-50%, -100%) rotate(${sDeg}deg)`;

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ---- RESPONSIVE MAX SIZE ----
  const clockSize = "min(190vw, 190vh)";

  const wrapper = {
    width: clockSize,
    height: clockSize,
    borderRadius: "50%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    // FULLSCREEN CENTERING
    margin: "0",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    background: "#FFFFFFFF",
  };

  const numberStyle = (index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
    const radius = 0.42;

    const top = 50 + Math.sin(angle) * radius * 50;
    const left = 50 + Math.cos(angle) * radius * 50;

    return {
      position: "absolute",
      top: `${top}%`,
      left: `${left}%`,
      transform: "translate(-50%, -50%)",
      width: "15vh",
      height: "auto",
      userSelect: "none",
      pointerEvents: "none",
    };
  };

  const handCommon = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 100%",
    background: "#C8E0EFFF",
    borderRadius: "1vh",
  };

  const hourHand = {
    ...handCommon,
    width: "1vh",
    height: "15vh",
    zIndex: 10,
  };

  const minuteHand = {
    ...handCommon,
    width: "0.7vh",
    height: "22vh",
    zIndex: 11,
  };

  const secondHand = {
    ...handCommon,
    width: "0.35vh",
    height: "25vh",
    background: "#C8E0EFFF",
    zIndex: 12,
  };

  // const centerDot = {
  //   position: "absolute",
  //   width: "3vh",
  //   height: "3vh",
  //   borderRadius: "50%",
  //   background: "black",
  //   left: "50%",
  //   top: "50%",
  //   transform: "translate(-50%, -50%)",
  //   zIndex: 20,
  // };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={wrapper}>
        {numberImages.map((src, index) => (
          <img key={index} src={src} alt="" style={numberStyle(index)} />
        ))}

        <div ref={hourRef} style={hourHand}></div>
        <div ref={minuteRef} style={minuteHand}></div>
        <div ref={secondRef} style={secondHand}></div>

        {/* <div style={centerDot}></div> */}
      </div>
    </div>
  );
}
