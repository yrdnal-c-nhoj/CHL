// Clock.jsx
import React, { useEffect, useState } from "react";
import bgLayer1 from "./venus.gif";
import bgLayer2 from "./venus.webp";
import font20251015 from "./venus.ttf";

export default function VenusClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const clockSizeVh = 55;
  const clockRadiusVh = clockSizeVh / 2;

  const symbols = ["y", "Q", "C", "D", "E", "9", "G", "H", "I", "p", "1", "5"];

  // Preload font + images
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-venus-font", "1");
    styleEl.innerHTML = `
      @font-face {
        font-family: 'VenusFont';
        src: url('${font20251015}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(styleEl);

    let imagesLoaded = 0;
    const totalImages = 2;
    let fontLoaded = false;

    const checkReady = () => {
      if (imagesLoaded >= totalImages && fontLoaded) setReady(true);
    };

    const img1 = new Image();
    const img2 = new Image();
    img1.src = bgLayer1;
    img2.src = bgLayer2;
    img1.onload = img2.onload = () => { imagesLoaded++; checkReady(); };
    img1.onerror = img2.onerror = () => { imagesLoaded++; checkReady(); };

    try {
      const fontFace = new FontFace("VenusFont", `url(${font20251015})`);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        fontLoaded = true;
        checkReady();
      }).catch(() => { fontLoaded = true; checkReady(); });
    } catch {
      fontLoaded = true;
      checkReady();
    }

    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  // Update current time every second
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  const outerWrapperStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    background: "radial-gradient(circle at 30% 40%, #e3f0ec 0%, #b7d2ca 50%, #8fb0a0 90%)",
  };

  const backgroundLayerStyle = (url, scale) => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${clockSizeVh * 1.6}vh`,
    height: `${clockSizeVh * 1.6}vh`,
    backgroundImage: `url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    mixBlendMode: "overlay",
    pointerEvents: "none",
    zIndex: 2,
    filter: "brightness(1.3) contrast(2.2) hue-rotate(-80deg) saturate(0.8)",
  });

  const containerStyle = {
    width: `${clockSizeVh}vh`,
    height: `${clockSizeVh}vh`,
    position: "relative",
    zIndex: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "VenusFont, serif",
  };

  const tickCommon = { position: "absolute", left: "50%", top: "50%", transformOrigin: "center" };

  // --- 3D metal digits ---
  const numberStyle = (i) => {
    const angleDeg = (i / 12) * 360 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = clockRadiusVh * 0.78;

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(${Math.cos(angleRad) * r}vh, ${Math.sin(angleRad) * r}vh) translate(-50%, -50%)`,
      fontSize: `${clockSizeVh * 0.13}vh`,
      fontWeight: 900,
      fontFamily: "VenusFont, serif",
      color: "#35C98EFF", // copper base
      textShadow: `
        0.15vh 0.15vh 0.3vh #3f2e23,
        -0.15vh 0.15vh 0.3vh #3f2e23,
        0.15vh -0.15vh 0.3vh #3f2e23,
        -0.15vh -0.15vh 0.3vh #3f2e23,
        0 0 0.4vh rgba(0,0,0,0.5)
      `,
      zIndex: 7,
      userSelect: "none",
    };
  };

  // --- 3D metal ticks ---
  const ticks = [];
  for (let t = 0; t < 60; t++) {
    const deg = (t / 60) * 360;
    const len = t % 5 === 0 ? 2.6 : 1.4;
    const thickness = t % 5 === 0 ? 0.02 * clockSizeVh : 0.01 * clockSizeVh;
    ticks.push(
      <div
        key={t}
        style={{
          ...tickCommon,
          width: `${thickness}vh`,
          height: `${len}vh`,
          transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-${clockRadiusVh - len / 2}vh)`,
          background: "#7C5C45",
          borderRadius: "0.05rem",
          boxShadow: `
            0.1vh 0.1vh 0.25vh #3f2e23,
            -0.1vh 0.1vh 0.25vh #3f2e23,
            0.1vh -0.1vh 0.25vh #3f2e23,
            -0.1vh -0.1vh 0.25vh #3f2e23
          `,
          zIndex: 8,
        }}
      />
    );
  }

  // Scrolling background animation
  useEffect(() => {
    if (!ready) return;
    let posX = 0;
    const speed = -0.04;
    const scroll = () => {
      posX -= speed;
      const bgEl = document.getElementById("venus-scroll-bg");
      if (bgEl) bgEl.style.backgroundPosition = `${posX}vh 50%`;
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  }, [ready]);

  // --- Clock Hands Styles ---
  const handCommonStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 50%",
    borderRadius: "0.1rem",
    background: "linear-gradient(180deg, #7c9a6d, #2b4a30)", // patinated copper gradient
    boxShadow: "0 0.2vh 0.5vh rgba(0,0,0,0.3)",
  };

  const hourDeg = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const minuteDeg = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const secondDeg = time.getSeconds() * 6;

  const hourStyle = {
    ...handCommonStyle,
    width: "0.8vh",
    height: `${clockRadiusVh * 0.5}vh`,
    transform: `translate(-50%, -50%) rotate(${hourDeg}deg)`,
    zIndex: 10,
  };
  const minuteStyle = {
    ...handCommonStyle,
    width: "0.5vh",
    height: `${clockRadiusVh * 0.75}vh`,
    transform: `translate(-50%, -50%) rotate(${minuteDeg}deg)`,
    zIndex: 11,
  };
  const secondStyle = {
    ...handCommonStyle,
    width: "0.25vh",
    height: `${clockRadiusVh * 0.85}vh`,
    background: "#92AC99FF",
    transform: `translate(-50%, -50%) rotate(${secondDeg}deg)`,
    zIndex: 12,
  };

  if (!ready) return <div>Loading...</div>;

  return (
    <div style={outerWrapperStyle}>
      <div style={backgroundLayerStyle(bgLayer1, 1.1)} />
      <div
        id="venus-scroll-bg"
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          width: "200%",
          height: `${clockSizeVh * 1.9}vh`,
          transform: "translateY(-50%)",
          backgroundImage: `url("${bgLayer2}"), url("${bgLayer2}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          opacity: 0.9,
          zIndex: 1,
          pointerEvents: "none",
          filter: "brightness(1.1) contrast(0.7) saturate(0.7) hue-rotate(80deg)",
        }}
      />
      <div style={containerStyle}>
        {ticks}
        {symbols.map((char, i) => (
          <div key={i} style={numberStyle(i)}>{char}</div>
        ))}

        {/* Clock Hands */}
        <div style={hourStyle} />
        <div style={minuteStyle} />
        <div style={secondStyle} />

        {/* Center pivot */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "1.2vh",
            height: "1.2vh",
            borderRadius: "50%",
            background: "linear-gradient(180deg, #7c9a6d, #2b4a30)",
            zIndex: 13,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0.3vh rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
}
