import React, { useEffect, useState, useRef } from "react";
import bgImage from "./roundhay.webp";
import dividerImage from "./line.png"; // new image between digit sets
import d20251014Font from "./roundhay.ttf";

export default function Clock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date());
  const tickRef = useRef(null);

  const z = (n) => (n < 10 ? `0${n}` : `${n}`);

  useEffect(() => {
    let mounted = true;
    let imageLoaded = false;
    let fontLoaded = false;

    const checkReady = () => {
      if (imageLoaded && fontLoaded && mounted) setReady(true);
    };

    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
    img.onerror = () => {
      imageLoaded = true;
      checkReady();
    };

    const font = new FontFace("RoundhayFont", `url(${d20251014Font})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        fontLoaded = true;
        checkReady();
      })
      .catch(() => {
        fontLoaded = true;
        checkReady();
      });

    return () => {
      mounted = false;
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    tickRef.current = setInterval(() => setNow(new Date()), 25);
    return () => clearInterval(tickRef.current);
  }, [ready]);

  if (!ready) return null;

  const hours24 = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, "0");
  const isAM = hours24 < 12;

  const renderDigits = (value) => (
    <div style={digitsRowStyle}>
      {String(value)
        .split("")
        .map((digit, i) => (
          <span key={i} style={digitStyle}>
            {digit}
          </span>
        ))}
    </div>
  );

  // --- Styles ---
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "'RoundhayFont', sans-serif",
    textAlign: "center",
  };

  const lineStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "-0.8vh 0",
    lineHeight: "1.1",
  };

  const digitsRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0.4vw",
  };

  const digitStyle = {
    display: "inline-block",
    width: "6.5vh",
    textAlign: "center",
    fontSize: "10vh",
    color: "white",
    textShadow: "0 0.4vh 0.8vh rgba(0,0,0,0.8)",
    userSelect: "none",
  };

  const labelStyle = {
    fontSize: "5.3vh",
    color: "rgba(255,255,255,0.9)",
    textShadow: "0 0.3vh 0.6vh rgba(0,0,0,0.6)",
    marginTop: "0.2vh",
  };

  const dividerStyle = {
    width: "8vw",
    height: "auto",
    margin: "1vh 0",
    opacity: 0.85,
    filter: "drop-shadow(0 0.4vh 0.6vh rgba(0,0,0,0.5))",
  };

  return (
    <div style={containerStyle}>
      <div style={lineStyle}>
        {renderDigits(z(hours24))}
        <div style={labelStyle}>Hours</div>
      </div>

      <img src={dividerImage} alt="divider" style={dividerStyle} />

      <div style={lineStyle}>
        {renderDigits(z(minutes))}
        <div style={labelStyle}>Minutes</div>
      </div>

      <img src={dividerImage} alt="divider" style={dividerStyle} />

      <div style={lineStyle}>
        {renderDigits(z(seconds))}
        <div style={labelStyle}>Seconds</div>
      </div>

      <img src={dividerImage} alt="divider" style={dividerStyle} />

      <div style={lineStyle}>
        {renderDigits(milliseconds)}
        <div style={labelStyle}>Milliseconds</div>
      </div>

      <div style={{ ...labelStyle, marginTop: "2vh" }}>
        {isAM ? "Ante Meridiem" : "Post Meridiem"}
      </div>
    </div>
  );
}
