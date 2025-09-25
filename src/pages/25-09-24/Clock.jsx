import React, { useState, useEffect } from "react";
import font20250924 from "./cora.ttf";

const HorizontalProportionalGradientClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let frame;
    const tick = () => {
      setTime(new Date());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  let hours = time.getHours() % 12;
  if (hours === 0) hours = 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const numbers = [
    { value: hours, max: 12, isHour: true },
    { value: Math.floor(minutes / 10), max: 5, isHour: false },
    { value: minutes % 10, max: 9, isHour: false },
    { value: Math.floor(seconds / 10), max: 5, isHour: false },
    { value: seconds % 10, max: 9, isHour: false },
  ];

  const scaleFactor = 29;
  const adder = 2;

  const scaleDigit = (num) => {
    const normalized = num.isHour
      ? (num.value - 1) / 11
      : num.value / num.max;
    return normalized * scaleFactor + adder;
  };

  const getGray = (value, max) => {
    const gray = Math.floor((value / max) * 255);
    return `rgb(${gray}, ${gray}, ${gray})`;
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    boxSizing: "border-box",
  };

  const styles = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${font20250924}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    .clock-digit {
      font-family: 'CustomFont', sans-serif;
      text-shadow: -4px 0px 0px black, 2px 0px 0px white;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: flex 0.6s ease-in-out, font-size 0.6s ease-in-out,
                  background-color 0.6s ease-in-out, color 0.6s ease-in-out;
      border-right: 1px solid black;
      animation: borderFade 12s infinite linear;
        filter: saturate(300%); /* <-- increases saturation */

    }
    .clock-digit:last-child {
      border-right: none;
    }
    @keyframes borderFade {
      0% { border-color: black; }
      50% { border-color: white; }
      100% { border-color: black; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={containerStyle}>
        {numbers.map((num, idx) => {
          const size = scaleDigit(num);
          const bgColor = getGray(num.value, num.max);

          return (
            <div
              key={idx}
              className="clock-digit"
              style={{
                flex: `${size} 1 0`,
                fontSize: `${size}vw`,
                backgroundColor: bgColor,
              }}
            >
              {num.value}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HorizontalProportionalGradientClock;
