import React, { useEffect, useState } from "react";
import customFont from "./ele.ttf?url";
import stripe1 from "./fire.gif?url";
import stripe2 from "./air.gif?url";
import stripe3 from "./h2o.gif?url";
import stripe4 from "./earth.webp?url";

export default function AnalogClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontVar] = useState(`font${new Date().getTime()}`);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: '${fontVar}';
        src: url(${customFont}) format('truetype');
        font-display: swap;
      }
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
    `;
    document.head.appendChild(styleEl);

    const font = new FontFace(fontVar, `url(${customFont})`);
    const images = [stripe1, stripe2, stripe3, stripe4];
    let loadedCount = 0;
    let fontLoaded = false;

    const checkReady = () => {
      if (fontLoaded && loadedCount === images.length) {
        setReady(true);
      }
    };

    font.load()
      .then(() => {
        document.fonts.add(font);
        fontLoaded = true;
        checkReady();
      })
      .catch(() => {
        fontLoaded = true;
        checkReady();
      });

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        checkReady();
      };
      img.onerror = () => {
        loadedCount++;
        checkReady();
      };
    });

    const timeout = setTimeout(() => {
      setReady(true);
    }, 5000);

    return () => {
      document.head.removeChild(styleEl);
      clearTimeout(timeout);
    };
  }, [fontVar]);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          backgroundColor: "black",
        }}
      />
    );
  }

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourDeg = (hour + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  const stripes = [stripe1, stripe2, stripe3, stripe4];

  // Styles for numbers
  const numberStyle = {
    position: "absolute",
    fontSize: "8rem",
    fontFamily: fontVar,
    color: "transparent",
    WebkitTextStroke: "1.7px rgba(255,255,255,0.9)",
    textStroke: "1.6px rgba(255,255,255,0.9)",
    zIndex: 100,
    opacity: 0.3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Hand style helper
  const handStyle = (width, height, top, rotateDeg) => ({
    position: "absolute",
    width: width,
    height: height,
    top: top,
    left: "50%",
    transformOrigin: "50% 100%",
    transform: `rotate(${rotateDeg}deg)`,
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: "0.25rem",
    zIndex: 20,
    opacity: 0.5,
    boxShadow: "0 0.1rem 0.2rem rgba(255, 255, 255,0.9)",
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#EFE9E9FF",
        fontFamily: fontVar,
      }}
    >
      {/* Stripes */}
      {stripes.map((src, idx) => {
        let mask = "";
        if (idx === 0)
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";
        else if (idx === 3)
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)";
        else
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";

        let filter = "hue-rotate(0deg) saturate(1) brightness(1) contrast(0.8)";
        if (idx === 0)
          filter =
            "hue-rotate(-40deg) saturate(2.2) brightness(1.1) contrast(1.1)";
        if (idx === 1)
          filter =
            "hue-rotate(220deg) saturate(1.9) brightness(1.0) contrast(1.9)";
        if (idx === 2)
          filter =
            "hue-rotate(-19deg) saturate(1.1) brightness(1.05) contrast(1.3)";
        if (idx === 3)
          filter =
            "sepia(1) hue-rotate(20deg) saturate(1.2) brightness(1.1) contrast(0.7)";

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top:
                idx === 0
                  ? "0"
                  : idx === 1
                  ? "15dvh"
                  : idx === 2
                  ? "49dvh"
                  : "calc(100dvh - 28dvh)",
              left: 0,
              width: "100vw",
              height: idx === 1 ? "50dvh" : idx === 2 ? "40dvh" : "28dvh",
              zIndex: idx,
            }}
          >
            {[false, true].map((flipped, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  WebkitMaskImage: mask,
                  maskImage: mask,
                  filter: filter,
                  opacity: 0.5,
                  transform: flipped ? "scaleX(-1)" : "none",
                }}
              />
            ))}
          </div>
        );
      })}

      {/* Numbers */}
      <div style={{ ...numberStyle, top: "2vh", left: "50%", transform: "translateX(-50%) scaleX(-1)" }}>8</div>
      <div style={{ ...numberStyle, bottom: "2vh", left: "50%", transform: "translateX(-50%)" }}>6</div>
      <div style={{ ...numberStyle, top: "50%", right: "2vw", transform: "translateY(-50%)" }}>3</div>
      <div style={{ ...numberStyle, top: "50%", left: "2vw", transform: "translateY(-50%)" }}>9</div>

      {/* Clock face + hands */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: "transparent",
          zIndex: 10,
        }}
      >
        {/* Hour hand */}
        <div style={handStyle("0.5rem", "25%", "25%", hourDeg)} />

        {/* Minute hand */}
        <div style={handStyle("0.35rem", "35%", "15%", minuteDeg)} />

        {/* Second hand */}
        <div style={handStyle("0.2rem", "40%", "10%", secondDeg)} />
      </div>
    </div>
  );
}
