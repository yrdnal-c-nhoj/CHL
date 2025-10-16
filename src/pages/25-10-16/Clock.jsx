import React, { useState, useEffect } from "react";
import font20251016 from "./brahmi.ttf";
import image1 from "./br.gif"; // grid image
import image2 from "./brm.gif"; // hole image

const brahmiDigits = ["𑁦","𑁧","𑁨","𑁩","𑁪","𑁫","𑁬","𑁭","𑁮","𑁯"];

function toBrahmi(num) {
  return num.toString().split("").map(d => brahmiDigits[parseInt(d)]);
}

export default function BrahmiClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace("BrahmiFont", `url(${font20251016})`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [fontLoaded]);

  if (!fontLoaded) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "4rem",
        color: "#ffd700"
      }}>
        Loading...
      </div>
    );
  }

  const hours = toBrahmi(time.getHours().toString().padStart(2, "0"));
  const minutes = toBrahmi(time.getMinutes().toString().padStart(2, "0"));
  const seconds = toBrahmi(time.getSeconds().toString().padStart(2, "0"));

  const digitBoxStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "4rem",
    height: "4rem",
    margin: "0 0.2rem"
  };

  const colonStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2rem"
  };

  const containerStyle = {
    position: "relative",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "BrahmiFont, serif",
    fontSize: "8vh",
    color: "#ffd700",
    textShadow: "0 0 1vh #ffd700, 0 0 2vh #ffdd55, 0 0 3vh #ffaa00",
    userSelect: "none",
    overflow: "hidden"
  };

  // Flipped and smaller grid
  const gridStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${image1})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center center",
    backgroundSize: "4rem 4rem", // smaller tiles
    filter: "contrast(1.2) brightness(1.1) hue-rotate(20deg) saturate(1.3)",
    transform: "scaleX(-1)", // flip horizontally
    zIndex: 0
  };

  const holeStyle = {
    position: "absolute",
    top: "10%", // adjust as needed
    right: "10%", // adjust as needed
    width: "20vw", // adjust size
    height: "20vh",
    backgroundImage: `url(${image2})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center center",
    filter: "contrast(1.5) brightness(1.2) hue-rotate(-10deg) saturate(1.1)",
    zIndex: 1
  };

  const clockStyle = {
    position: "relative",
    display: "flex",
    zIndex: 2
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}></div>
      <div style={holeStyle}></div>
      <div style={clockStyle}>
        {hours.map((h, i) => <div key={`h${i}`} style={digitBoxStyle}>{h}</div>)}
        <div style={colonStyle}>:</div>
        {minutes.map((m, i) => <div key={`m${i}`} style={digitBoxStyle}>{m}</div>)}
        <div style={colonStyle}>:</div>
        {seconds.map((s, i) => <div key={`s${i}`} style={digitBoxStyle}>{s}</div>)}
      </div>
    </div>
  );
}
