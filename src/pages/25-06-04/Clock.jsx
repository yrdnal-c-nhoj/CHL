import React, { useEffect, useRef, useState } from "react";
import coffeeFont from "./cof.ttf";
import bgStill from "./coff.png";
import bgAnimated from "./coff.gif";

const CoffeeClock = () => {
  const [isReady, setIsReady] = useState(false);

  const jitterSettings = useRef([]);
  const numberRefs = useRef([]);
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  // Wait for font + images
  useEffect(() => {
    const loadFont = new Promise((resolve) => {
      const font = new FontFace("cof", `url(${coffeeFont})`);
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve();
      });
    });

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([loadFont, loadImage(bgStill), loadImage(bgAnimated)]).then(() =>
      setIsReady(true)
    );
  }, []);

  // Animate numbers jitter
  useEffect(() => {
    if (!isReady) return;

    for (let i = 0; i < 12; i++) {
      jitterSettings.current[i] = {
        phase: Math.random() * Math.PI * 2,
        freq: 1 + Math.random(),
        ampX: Math.random() * 0.12 + 0.09,
        ampY: Math.random() * 0.12 + 0.09,
        ampR: Math.random() * 2 + 0.9,
      };
    }

    const loop = () => {
      const t = performance.now() / 30;
      jitterSettings.current.forEach((j, idx) => {
        const dx = Math.sin(t * j.freq + j.phase) * j.ampX + "vw";
        const dy = Math.cos(t * j.freq + j.phase) * j.ampY + "vh";
        const rot = Math.sin(t * j.freq * 0.9 + j.phase) * j.ampR;
        const el = numberRefs.current[idx];
        if (el) {
          el.style.transform = `translate(calc(-50% + ${dx}), calc(-50% + ${dy})) rotate(${rot}deg)`;
        }
      });
      requestAnimationFrame(loop);
    };
    loop();
  }, [isReady]);

  // Clock hands
  useEffect(() => {
    if (!isReady) return;

    const updateClock = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours();

      const secDeg = sec * 6;
      const minDeg = min * 6 + sec * 0.1;
      const hrDeg = ((hr % 12) + min / 60) * 30;

      if (secondHandRef.current)
        secondHandRef.current.style.transform = `rotate(${secDeg}deg)`;
      if (minuteHandRef.current)
        minuteHandRef.current.style.transform = `rotate(${minDeg}deg)`;
      if (hourHandRef.current)
        hourHandRef.current.style.transform = `rotate(${hrDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [isReady]);

  // Styles
  const numberStyle = {
    position: "absolute",
    width: "6vh",
    height: "6vh",
    textAlign: "center",
    lineHeight: "6vh",
    fontFamily: "cof, sans-serif",
    fontWeight: "bold",
    fontSize: "13vh",
    color: "rgb(235, 190, 7)",
    textShadow: "#3f2705 0 0.6rem 0, #fdddbc 0 -0.2rem 0",
    pointerEvents: "none",
  };

  const handBase = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "left center",
    transition: "all 0.05s ease-in-out",
    background: "rgb(235, 190, 7)",
  };

  const clockStyle = {
    width: "90vmin",
    height: "90vmin",
    borderRadius: "50%",
    position: "relative",
    zIndex: 4,
    opacity: 0.8,
  };

  const dotStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "9vmin",
    height: "9vmin",
    background: "rgb(235, 190, 7)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
  };

  const bgStillStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "110vmin",
    height: "110vmin",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
  };

  const bgAnimStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "invert(100%) contrast(200%) brightness(150%)",
    zIndex: 3,
    opacity: 0.4,
  };

  // Simple fade-in transition
  const containerStyle = {
    margin: 0,
    padding: 0,
    height: "100dvh",
    width: "100vw",
    background: "#5c4106",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    opacity: isReady ? 1 : 0,
    transition: "opacity 0.8s ease-in-out",
  };

  // Loading fallback
  if (!isReady) {
    return (
      <div
        style={{
          height: "100dvh",
          width: "100vw",
          background: "#5c4106",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ebbe07",
          fontFamily: "sans-serif",
          fontSize: "2rem",
        }}
      >
        Brewing your clock ☕...
      </div>
    );
  }

  // Actual clock render
  return (
    <div style={containerStyle}>
      <img src={bgStill} alt="Still Background" style={bgStillStyle} />
      <img src={bgAnimated} alt="Animated Overlay" style={bgAnimStyle} />

      <div style={clockStyle}>
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1 - 3) * 30;
          const radius = 38;
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={i}
              ref={(el) => (numberRefs.current[i] = el)}
              style={{ ...numberStyle, left: `${x}%`, top: `${y}%` }}
            >
              {i + 1}
            </div>
          );
        })}
        <div
          ref={hourHandRef}
          style={{ ...handBase, width: "20vmin", height: "3.8vmin" }}
        ></div>
        <div
          ref={minuteHandRef}
          style={{ ...handBase, width: "30vmin", height: "1.9vmin" }}
        ></div>
        <div
          ref={secondHandRef}
          style={{ ...handBase, width: "45vmin", height: "0.9vmin" }}
        ></div>
        <div style={dotStyle}></div>
      </div>
    </div>
  );
};

export default CoffeeClock;
