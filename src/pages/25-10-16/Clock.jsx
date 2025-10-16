import React, { useState, useEffect } from "react";
import font20251016 from "./brahmi.ttf";
import image1 from "./br.gif"; // first grid image
import image2 from "./brahmi.webp"; // second grid image

const brahmiDigits = ["𑁦","𑁧","𑁨","𑁩","𑁪","𑁫","𑁬","𑁭","𑁮","𑁯"];

function toBrahmi(num) {
  return num.toString().split("").map(d => brahmiDigits[parseInt(d)]);
}

export default function BrahmiClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load font
  useEffect(() => {
    const font = new FontFace("BrahmiFont", `url(${font20251016})`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    });
  }, []);

  // Update time every second
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
        fontSize: "6rem",
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
    width: "7vh",
    height: "4rem",
    margin: "0 0.02rem"
  };

  const colonStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "0.5rem"
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

  // Gradient background behind images
  const gradientStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, #3366E5FF, #9A9C9FFF, #351E03FF)", // you can change colors
    zIndex: 1
  };

  // First tiled grid
  const gridStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${image1})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center center",
    backgroundSize: "2rem 2rem",
    filter: "contrast(0.2) brightness(1.1) hue-rotate(120deg) saturate(0.3)",
    transform: "scaleX(-1)",
    zIndex: 2
  };

  // Second tiled grid (semi-transparent)
  const holeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${image2})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center center",
    backgroundSize: "5rem 5rem",
    opacity: "0.4",
    filter: "contrast(1.5) brightness(1.2) hue-rotate(-10deg) saturate(0.1) opacity(0.4)",
    zIndex: 1
  };

  const clockStyle = {
    position: "relative",
    display: "flex",
    zIndex: 2
  };

  return (
    <div style={containerStyle}>
      <div style={gradientStyle}></div>
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
