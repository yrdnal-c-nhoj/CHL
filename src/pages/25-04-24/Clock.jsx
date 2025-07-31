import React, { useEffect, useState } from "react";
import lava1 from "./lava.webp";
import lava2 from "./vp2OVr.gif";
import lava3 from "./lava.webp";
import lavaFont from "./lava.ttf";

const LavaClock = () => {
  const [time, setTime] = useState({ hours: "00", minutes: "00" });
  const [showGif, setShowGif] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const font = new FontFace("Rubik Burned", `url(${lavaFont})`);
    font.load().then(() => {
      document.fonts.add(font);
    });

    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime({ hours, minutes });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    setTimeout(() => {
      setShowGif(true);
    }, 100);

    setTimeout(() => {
      setFadeOut(true);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const screenStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgb(205, 15, 15)",
    opacity: fadeOut ? 0 : 0.5,
    transition: "opacity 1s ease",
    zIndex: 9999,
    pointerEvents: "none",
  };

  const bgImageStyle1 = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "170vw",
    height: "100vh",
    objectFit: "cover",
    opacity: "90%",
    zIndex: 4,
    display: showGif ? "block" : "none",
  };

  const bgImageStyle2 = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "160vh",
    objectFit: "cover",
    opacity: "60%",
    transform: "scaleX(-1)",
    zIndex: 3,
  };

  const bgImageStyle3 = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    filter: "saturate(150%)",
    opacity: "50%",
    zIndex: 1,
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  };

  const timePartStyle = {
    color: "rgb(250, 9, 58)",
    textShadow:
      "#9f3406 -0.1rem -0.1rem 0.5rem, #efc107 0.1rem 0.1rem 0.4rem, #ef0707 1.3rem 1.3rem 1.7rem, #ff1104 -1.1rem 1.3rem 1.8rem, #ef0707 1.3rem -1.3rem 1.8rem, #dc2b03 -1.3rem -1.1rem 1.9rem, #f7390f -0.1rem -0.1rem 0.8rem, #ef2906 0.3rem 3.3rem 2.3rem",
    fontFamily: "Rubik Burned, system-ui",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "7rem",
    lineHeight: "9rem",
  };

  return (
    <div style={{ backgroundColor: "#f70f07", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <div style={screenStyle}></div>

      <img src={lava2} style={bgImageStyle3} alt="Lava Layer 3" />
      <img src={lava1} style={bgImageStyle2} alt="Lava Layer 2" />
      <img src={lava3} style={bgImageStyle1} alt="Lava Layer 1" />

      <div style={containerStyle}>
        <div style={timePartStyle}>{time.hours}</div>
        <div style={timePartStyle}>{time.minutes}</div>
      </div>
    </div>
  );
};

export default LavaClock;
