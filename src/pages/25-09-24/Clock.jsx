import React, { useState, useEffect } from "react";
import font20250924 from "./prop.otf"; // font variable includes date

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

  // Convert hours to 12-hour format
  let hours = time.getHours() % 12;
  if (hours === 0) hours = 12;

  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000; // fractional seconds

  const numbers = [
    { value: hours, max: 12, isHour: true },
    { value: Math.floor(minutes / 10), max: 9, isHour: false },
    { value: minutes % 10, max: 9, isHour: false },
    { value: Math.floor(seconds / 10), max: 9, isHour: false },
    { value: Math.floor(seconds % 10), max: 9, isHour: false },
  ];

  const scaleFactor = 16;
  const adder = 2;

  const scaleDigit = (num) => {
    const normalized = num.isHour
      ? (num.value - 1) / 11
      : num.value / 9;
    return normalized * scaleFactor + adder;
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    border: "2px solid blue",
    boxSizing: "border-box",
  };

  const getGray = (value, max) => {
    const gray = Math.round((value / max) * 255);
    return `rgb(${gray},${gray},${gray})`;
  };

  // Scoped font style
  const fontStyle = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${font20250924}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    .clock-digit {
      font-family: 'CustomFont', sans-serif;
      color: #19EE6EFF;
      text-shadow: 
        -3px 0px 0px black,
        3px 0px 0px white;
      transition: 
        flex 0.6s ease-in-out,
        font-size 0.6s ease-in-out,
        background-color 0.6s ease-in-out,
        color 0.6s ease-in-out;
    }
  `;

  return (
    <>
      <style>{fontStyle}</style>
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: bgColor,
                fontSize: `${size}vw`,
                borderRight: idx < numbers.length - 1 ? "2px solid blue" : "none",
              }}
            >
              {Math.floor(num.value)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HorizontalProportionalGradientClock;
