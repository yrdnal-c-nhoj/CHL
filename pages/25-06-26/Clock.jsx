import React, { useEffect } from "react";
import bg1 from "./co.png";
import bg2 from "./cos.png";
import wheFont from "./whe.ttf";

const CosmicWheelClock = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'whe';
        src: url(${wheFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      hours = hours % 12 || 12;

      const pad = (num, digits) => String(num).padStart(digits, "0");
      const hoursStr = pad(hours, 2);
      const minutesStr = pad(minutes, 2);
      const secondsStr = pad(seconds, 2);

      updateSection("hours", hoursStr);
      updateSection("minutes", minutesStr);
      updateSection("seconds", secondsStr);
    };

    const updateSection = (id, value) => {
      const section = document.getElementById(id);
      if (!section) return;
      const boxes = section.getElementsByClassName("digit-box");
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].textContent = value[i];
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#dbd7ca",
    fontFamily: "monospace",
    overflow: "hidden",
    position: "relative",
  };

  const imageStyle1 = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    filter: "contrast(0.9) invert()",
    zIndex: 1,
    opacity: 0.9,
    animation: "slow-rotate 120s linear infinite",
    transformOrigin: "center center",
  };

  const imageStyle2 = {
    ...imageStyle1,
    zIndex: 2,
    opacity: 0.5,
    animation: "slowrotate 120s linear infinite",
  };

  const clockContainerStyle = {
    zIndex: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const timeSectionStyle = {
    display: "flex",
  };

  const digitBoxBase = {
    fontFamily: "whe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "1 / 1",
    fontSize: "10rem",
    width: "8rem",
    height: "8rem",
    background: "transparent",
    WebkitTextFillColor: "transparent",
    backgroundImage: `url(${require('./cosm.webp')})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
  };

  const spinStyles = (index) => ({
    ...digitBoxBase,
    animation: `${
      index % 2 === 0 ? "spin-clockwise" : "spin-counterclockwise"
    } 30s linear infinite`,
  });

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes slow-rotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(-360deg) scale(1.5); }
        }
        @keyframes slowrotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
      `}</style>


      <div style={dateContainer}>
        <a href="../bone/" style={{ color: "inherit", textDecoration: "none" }}>
          06/25/25
        </a>
        <a href="../index.html" style={clockName}>
          Cosmic Wheels
        </a>
        <a href="../morse/" style={{ color: "inherit", textDecoration: "none" }}>
          06/27/25
        </a>
      </div>

      <img src={bg1} alt="bg1" style={imageStyle1} />
      <img src={bg2} alt="bg2" style={imageStyle2} />

      <div style={clockContainerStyle}>
        {["hours", "minutes", "seconds"].map((unit) => (
          <div style={timeSectionStyle} id={unit} key={unit}>
            {[0, 1].map((i) => (
              <div className="digit-box" key={i} style={spinStyles(i)}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CosmicWheelClock;
