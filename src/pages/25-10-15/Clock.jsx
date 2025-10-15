import React, { useEffect, useState } from "react";
import bgLayer1 from "./venus.gif";
import bgLayer2 from "./venus.webp";
import fullBg from "./ve.jpg"; 
import font20251015 from "./venus.ttf";

export default function VenusClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [clockSizeVh, setClockSizeVh] = useState(30); // default phone size

  const clockRadiusVh = clockSizeVh / 1.1;
  const symbols = ["y", "Q", "C", "D", "E", "9", "G", "H", "I", "p", "1", "5"];

  // --- Responsive clock size ---
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      if (vw < 768) setClockSizeVh(30); // phones
      else setClockSizeVh(40); // laptops/desktops
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Preload font + images ---
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
    const totalImages = 3;
    let fontLoaded = false;

    const checkReady = () => {
      if (imagesLoaded >= totalImages && fontLoaded) setReady(true);
    };

    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();
    img1.src = bgLayer1;
    img2.src = bgLayer2;
    img3.src = fullBg;
    img1.onload = img2.onload = img3.onload = () => { imagesLoaded++; checkReady(); };
    img1.onerror = img2.onerror = img3.onerror = () => { imagesLoaded++; checkReady(); };

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

  // --- Update current time ---
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  // --- Scrolling background ---
  useEffect(() => {
    if (!ready) return;
    let posX = 0;
    const speed = -0.046;
    const scroll = () => {
      posX -= speed;
      const bgEl = document.getElementById("venus-scroll-bg");
      if (bgEl) bgEl.style.backgroundPosition = `${posX}vh 50%`;
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  }, [ready]);

  if (!ready) return <div>Loading...</div>;

  // --- Styles ---
  const outerWrapperStyle = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  };

  const backgroundLayerStyle = (url, scale) => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${clockSizeVh * 1.7}vh`,
    height: `${clockSizeVh * 1.7}vh`,
    backgroundImage: `url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    mixBlendMode: "overlay",
    pointerEvents: "none",
    zIndex: 2,
    opacity: 0.7,
    filter: "brightness(1.3) contrast(0.5) hue-rotate(-60deg) saturate(2.9)",
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

  const numberStyle = (i) => {
    const angleDeg = (i / 12) * 360 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = clockRadiusVh * 0.68;
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(${Math.cos(angleRad) * r}vh, ${Math.sin(angleRad) * r}vh) translate(-50%, -50%)`,
      fontSize: `${clockSizeVh * 0.14}vh`,
      fontWeight: 900,
      fontFamily: "VenusFont, serif",
      color: "#5CC6AD",
      textShadow: `
        0.2vh 0.2vh 0.1vh #F2EBEBFF,
        -0.1vh -0.2vh 0.15vh #000000,
        0.09vh 0.09vh 0.7vh #111010FF,
        -0.09vh -0.09vh 0.8vh #ffffff
      `,
      zIndex: 7,
      userSelect: "none",
    };
  };

  const handCommonStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "50% 50%",
    borderRadius: "0.1rem",
    background: "linear-gradient(180deg, #101110FF,  #5EC0A4FF)",
    boxShadow: `
      0 0.2vh 0.5vh rgba(0,0,0,0.3),
      inset 0 0.4vh 0.2vh rgba(255,255,255,0.9)
    `,
  };

  const ticks = [];
  for (let t = 0; t < 60; t++) {
    const deg = (t / 60) * 360;
    const len = t % 5 === 0 ? 5.9 : 2.9;
    const thickness = t % 5 === 0 ? 0.01 * clockSizeVh : 0.01 * clockSizeVh;
    ticks.push(
      <div
        key={t}
        style={{
          ...tickCommon,
          width: `${thickness}vh`,
          height: `${len}vh`,
          transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-${clockRadiusVh - len / 2}vh)`,
          background: "#5CC6ADFF",
          borderRadius: "0.05rem",
          boxShadow: `
            0.2vh 0.2vh 0.25vh #F0EEEDFF,
            -0.3vh 0.3vh 0.25vh #3f2e23,
            0.1vh -0.1vh 0.25vh #3f2e23,
            -0.1vh -0.1vh 0.25vh #3f2e23
          `,
          zIndex: 8,
        }}
      />
    );
  }

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
    background: "#5CC6AD",
    transform: `translate(-50%, -50%) rotate(${secondDeg}deg)`,
    zIndex: 12,
  };

  return (
    <div style={outerWrapperStyle}>
      <img
        src={fullBg}
        alt="background"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "fill",
          zIndex: 0,
          filter: "saturate(0.1)",
          pointerEvents: "none",
        }}
      />
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
          filter: "brightness(1.1) contrast(0.7) saturate(1.2) hue-rotate(80deg)",
        }}
      />
      <div style={containerStyle}>
        {ticks}
        {symbols.map((char, i) => (
          <div key={i} style={numberStyle(i)}>{char}</div>
        ))}
        <div style={hourStyle} />
        <div style={minuteStyle} />
        <div style={secondStyle} />
      </div>
    </div>
  );
}
