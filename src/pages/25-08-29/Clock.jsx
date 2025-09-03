import React, { useEffect, useState } from "react";
import bgImage from "./sun.jpg";      // background image
import digitImage from "./sun.gif";  // image for all 12 numbers + center

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  // Container
  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
  };

  // Clock face
  const clockFaceStyle = {
    position: "relative",
    width: "50vw",
    height: "50vw",
    maxWidth: "40rem",
    maxHeight: "40rem",
    borderRadius: "50%",
    boxShadow: "0 0 2rem rgba(0,0,0,0.3)",
  };

  // Hands
  const handStyle = (deg, widthVw, color, zIndex = 5, length = "45%") => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: widthVw,
    height: length,
    backgroundColor: color,
    transformOrigin: "50% 100%",
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    borderRadius: "0.3vw",
    zIndex,
  });

  // Digit image style
  const numberStyle = (deg) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "5vw",
    height: "5vw",
    transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-22vw) rotate(${-deg}deg)`,
    zIndex: 5,
  });

  // Center image (using digitImage, smaller)
  const centerImageStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "5vw",
    height: "5vw",
    maxWidth: "1rem",
    maxHeight: "1rem",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
  };

  // Hollow counterweight for second hand
  const counterweightStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "1vw",
    height: "1vw",
    maxWidth: "2rem",
    maxHeight: "2rem",
    border: "0.3vw solid #AEAD9FFF",
    borderRadius: "50%",
    backgroundColor: "transparent",
    transform: `translate(-50%, -50%) rotate(${secondDeg}deg) translateY(4vw)`,
    zIndex: 7,
  };

  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
        {/* Number images */}
        {[...Array(12)].map((_, i) => {
          const deg = (i / 12) * 360;
          return <img key={i} src={digitImage} alt="digit" style={numberStyle(deg)} />;
        })}

        {/* Hour hand */}
        <div style={handStyle(hourDeg, "1vw", "#D5CAA8FF", 6, "35%")} />

        {/* Minute hand */}
        <div style={handStyle(minuteDeg, "0.7vw", "#EADCB3FF", 7, "50%")} />

        {/* Second hand */}
        <div style={handStyle(secondDeg, "0.3vw", "#EDE4C7FF", 8, "70%")} />
        <div style={counterweightStyle} />

        {/* Center image */}
        <img src={digitImage} alt="center" style={centerImageStyle} />
      </div>
    </div>
  );
}
