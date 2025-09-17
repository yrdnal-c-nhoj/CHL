import React, { useEffect, useState } from "react";
import bgImage from "./bg.jpg";
import dateFont from "./baud.ttf";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload font and image
  useEffect(() => {
    // Inject font-face
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'MyDateFont';
        src: url(${dateFont}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    // Font preload
    const fontPromise = document.fonts.load("10rem MyDateFont");

    // Background image preload
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = bgImage;
      img.onload = resolve;
      img.onerror = reject;
    });

    // Wait for both
    Promise.all([fontPromise, imagePromise])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error("Asset loading error:", err);
        setIsLoaded(true); // fallback
      });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Format time
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
      0 0 45px #ff0000,
      0 0 50px #ff9900,
      0 0 55px #ffff00,
      0 0 60px #00ff00,
      0 0 65px #00ffff,
      0 0 70px #0000ff,
      0 0 75px #ff00ff,
      0 0 80px #ffffff,
      0 0 90px #ffffff,
      0 0 99px #ffffff
    `
  };

  const containerStyle = {
    height: "100dvh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // fallback black until loaded
    backgroundImage: isLoaded ? `url(${bgImage})` : "none",
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

  // Show black screen until everything is ready
  if (!isLoaded) {
    return <div style={{ height: "100dvh", width: "100vw", backgroundColor: "black" }} />;
  }

  return (
    <div style={containerStyle}>
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
