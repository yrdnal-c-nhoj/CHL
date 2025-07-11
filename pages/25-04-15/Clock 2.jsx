import React, { useEffect, useState } from "react";
import img1 from "./images/4c558c5dbff1828f2b87582dc49526e8.gif";
import img2 from "./images/sdfwef.gif";
import img3 from "./images/ewfsdfsd.gif";
import horiFont from "./hori.otf";

const HorizonClock = () => {
  const [time, setTime] = useState("000000");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12;
      hours = hours === 0 ? 12 : hours; // Convert 0 to 12
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}${minutes}${seconds}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const font = new FontFace("HoriFont", `url(${horiFont})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  const containerStyle1 = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    overflow: "hidden",
    position: "fixed",
    bottom: 0,
    left: 0,
    zIndex: 2,
  };

  const imgStyle1 = {
    opacity: 0.5,
    width: "100%",
    height: "60%",
    objectFit: "cover",
  };

  const containerStyle2 = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    overflow: "hidden",
    position: "fixed",
    bottom: 0,
    left: 0,
    zIndex: 1,
  };

  const imgStyle2 = {
    width: "100%",
    height: "70%",
    objectFit: "cover",
  };

  const containerStyle3 = {
    position: "fixed",
    width: "100vw",
    height: "50vh",
    overflow: "hidden",
    zIndex: 5,
  };

  const imgStyle3 = {
    width: "100%",
    height: "150%",
  };

  const clockStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "6rem",
    background:
      "linear-gradient(to bottom, rgb(136, 145, 95) 50%, rgb(78, 136, 183) 50%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    zIndex: 8,
    fontFamily: "HoriFont, sans-serif",
    userSelect: "none",
    whiteSpace: "nowrap",
    textAlign: "center",
    display: "flex",
    gap: "0.2rem",
  };

  const charStyle = {
    display: "inline-block",
    width: "1ch",
    textAlign: "center",
  };

  return (
    <>
      <div style={containerStyle1}>
        <img src={img1} alt="Background 1" style={imgStyle1} />
      </div>
      <div style={containerStyle2}>
        <img src={img2} alt="Background 2" style={imgStyle2} />
      </div>
      <div style={containerStyle3}>
        <img src={img3} alt="Background 3" style={imgStyle3} />
      </div>

      <div style={clockStyle}>
        {time.split("").map((char, index) => (
          <span key={index} style={charStyle}>
            {char}
          </span>
        ))}
      </div>
    </>
  );
};

export default HorizonClock;
