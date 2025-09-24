import React, { useState, useEffect } from "react";
import font20250924 from "./prop.otf"; // font variable includes date

const HorizontalProportionalGradientClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert hours to 12-hour format
  let hours = time.getHours() % 12;
  if (hours === 0) hours = 12;

  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const numbers = [
    { value: hours, max: 12, isHour: true },
    { value: Math.floor(minutes / 10), max: 9, isHour: false },
    { value: minutes % 10, max: 9, isHour: false },
    { value: Math.floor(seconds / 10), max: 9, isHour: false },
    { value: seconds % 10, max: 9, isHour: false },
  ];

  const scaleFactor = 16; // scaling for all digits
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
    border: "2px solid blue", // added border on all sides
    boxSizing: "border-box",   // ensures border doesn't overflow
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
        -3px 0px 0px black, /* strong left black shadow */
        3px 0px 0px white;  /* strong right white shadow */
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
                color: "#05about:blank#blockedEA61FF",
                fontSize: `${size}vw`,
                borderRight: idx < numbers.length - 1 ? "2px solid blue" : "none",
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
