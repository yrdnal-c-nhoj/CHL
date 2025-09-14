import React, { useEffect, useState } from "react";
import bgImage from "./bg.jpg";
import dateFont from "./baud.ttf";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");

  const digitBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'MyDateFont', sans-serif",
    fontSize: "8rem",
    color: "#ffffff",
    margin: "0 0.5vw",
    minWidth: "8vw",
    textShadow: `
      0 0 5px #ff0000,
      0 0 10px #ff9900,
      0 0 15px #ffff00,
      0 0 20px #00ff00,
      0 0 25px #00ffff,
      0 0 30px #0000ff,
      0 0 35px #ff00ff,
      0 0 40px #ffffff,
      0 0 50px #ffffff,
      0 0 75px #ffffff
    `
  };

  const containerStyle = {
    height: "100dvh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const faceStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };

  const renderDigits = (value) =>
    value.split("").map((d, i) => (
      <div key={i} style={digitBox}>
        {d}
      </div>
    ));

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'MyDateFont';
            src: url(${dateFont}) format('truetype');
            font-display: swap;
          }
        `}
      </style>
      <div style={faceStyle}>
        {renderDigits(hours)}
        <div style={digitBox}>:</div>
        {renderDigits(minutes)}
        <div style={digitBox}>:</div>
        {renderDigits(seconds)}
      </div>
    </div>
  );
};

export default Clock;
