import React, { useState, useEffect } from "react";
import font20251016 from "./brahmi.ttf";
import image1 from "./br.gif"; // first grid image
import image2 from "./brahmi.webp"; // second grid image

const brahmiDigits = ["𑁦", "𑁧", "𑁨", "𑁩", "𑁪", "𑁫", "𑁬", "𑁭", "𑁮", "𑁯"];

function toBrahmi(num) {
  return num.toString().split("").map(d => brahmiDigits[parseInt(d)]);
}

export default function BrahmiClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());

  // Preload font and images
  useEffect(() => {
    const loadFont = () => {
      const font = new FontFace("BrahmiFont", `url(${font20251016})`);
      return font.load().then(f => {
        document.fonts.add(f);
      });
    };

    const loadImage = src =>
      new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });

    Promise.all([loadFont(), loadImage(image1), loadImage(image2)]).then(() => {
      setReady(true);
    });
  }, []);

  // Clock tick
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(180deg, #3366E5FF, #9A9C9FFF, #351E03FF)",
          fontSize: "6vh",
          color: "#ffd700",
          fontFamily: "serif",
        }}
      >
        Loading…
      </div>
    );
  }

  const hours = toBrahmi(time.getHours().toString().padStart(2, "0"));
  const minutes = toBrahmi(time.getMinutes().toString().padStart(2, "0"));
  const seconds = toBrahmi(time.getSeconds().toString().padStart(2, "0"));

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
    overflow: "hidden",
    userSelect: "none",
  };

  const gradientStyle = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #3366E5FF, #9A9C9FFF, #351E03FF)",
    zIndex: 1,
  };

  const gridStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${image1})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    backgroundSize: "2rem 2rem",
    filter: "contrast(0.2) brightness(1.1) hue-rotate(120deg) saturate(0.3)",
    transform: "scaleX(-1)",
    zIndex: 2,
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${image2})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    backgroundSize: "5rem 5rem",
    opacity: 0.4,
    filter:
      "contrast(1.5) brightness(1.2) hue-rotate(-10deg) saturate(0.1) opacity(0.4)",
    zIndex: 3,
  };

  const clockStyle = {
    position: "relative",
    display: "flex",
    zIndex: 4,
  };

  const digitBoxStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "7vh",
    height: "4rem",
    margin: "0 0.02rem",
  };

  const colonStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "0.5rem",
  };

  return (
    <div style={containerStyle}>
      <div style={gradientStyle}></div>
      <div style={gridStyle}></div>
      <div style={overlayStyle}></div>
      <div style={clockStyle}>
        {hours.map((h, i) => (
          <div key={`h${i}`} style={digitBoxStyle}>
            {h}
          </div>
        ))}
        <div style={colonStyle}>:</div>
        {minutes.map((m, i) => (
          <div key={`m${i}`} style={digitBoxStyle}>
            {m}
          </div>
        ))}
        <div style={colonStyle}>:</div>
        {seconds.map((s, i) => (
          <div key={`s${i}`} style={digitBoxStyle}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
