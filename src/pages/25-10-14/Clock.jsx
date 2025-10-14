import React, { useEffect, useState, useRef } from "react";
import bgImage from "./roundhay.webp";
import bgImage2 from "./ro.jpg";
import roundhayFont from "./roundhay.ttf";
import importantFont from "./line.otf";

export default function Clock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date());
  const tickRef = useRef(null);

  const z = (n) => (n < 10 ? `0${n}` : `${n}`);

  useEffect(() => {
    let mounted = true;
    let loaded = { img1: false, img2: false, font1: false, font2: false };

    const checkReady = () => {
      if (Object.values(loaded).every(Boolean) && mounted) setReady(true);
    };

    const img1 = new Image();
    img1.src = bgImage;
    img1.onload = img1.onerror = () => {
      loaded.img1 = true;
      checkReady();
    };

    const img2 = new Image();
    img2.src = bgImage2;
    img2.onload = img2.onerror = () => {
      loaded.img2 = true;
      checkReady();
    };

    const f1 = new FontFace("RoundhayFont", `url(${roundhayFont})`);
    f1.load()
      .then((font) => {
        document.fonts.add(font);
        loaded.font1 = true;
        checkReady();
      })
      .catch(() => {
        loaded.font1 = true;
        checkReady();
      });

    const f2 = new FontFace("ImportantFont", `url(${importantFont})`);
    f2.load()
      .then((font) => {
        document.fonts.add(font);
        loaded.font2 = true;
        checkReady();
      })
      .catch(() => {
        loaded.font2 = true;
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

  // base shared style
  const sharedTextStyle = {
    color: "#ffcc33",
    textShadow: "0.2vh 0 #ff00ff, -0.2vh 0 #00ffff",
    fontFamily: "'RoundhayFont', serif",
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0b2e",
    backgroundImage: `url(${bgImage}), url(${bgImage2})`,
    backgroundSize: "cover, cover",
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat, no-repeat",
    overflow: "hidden",
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    padding: "2vh",
    boxSizing: "border-box",
  };

  const lineStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "1vw",
    margin: "1vh 0",
  };

  const digitBoxStyle = {
    ...sharedTextStyle,
    fontSize: "clamp(2.5vh, 5vw, 5vh)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    padding: "0.5vh 0.6vh",
    minWidth: "3vh",
    borderRadius: "0.5vh",
  };

  const labelStyle = {
    ...sharedTextStyle,
    fontSize: "clamp(2vh, 4vw, 4vh)",
    opacity: 0.9,
  };

  const dividerStyle = {
    ...sharedTextStyle,
    fontFamily: "'ImportantFont', serif",
    fontSize: "clamp(2.5vh, 5vw, 6vh)",
    opacity: 0.8,
    color: "#00ccff",
    textShadow: "0.2vh 0.2vh 0 #ff0066, 0.3vh 0.3vh 0 #ffcc00",
  };

  const renderDigits = (value) => (
    <div style={{ display: "flex", gap: "0.3vw" }}>
      {String(value).split("").map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digit}
        </div>
      ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={lineStyle}>
        {renderDigits(z(hours24))}
        <div style={labelStyle}>Hours</div>
      </div>
      <div style={dividerStyle}>h</div>

      <div style={lineStyle}>
        {renderDigits(z(minutes))}
        <div style={labelStyle}>Minutes</div>
      </div>
      <div style={dividerStyle}>h</div>

      <div style={lineStyle}>
        {renderDigits(z(seconds))}
        <div style={labelStyle}>Seconds</div>
      </div>
      <div style={dividerStyle}>h</div>

      <div style={lineStyle}>
        {renderDigits(milliseconds)}
        <div style={labelStyle}>Milliseconds</div>
      </div>
      <div style={dividerStyle}>j</div>

      <div style={lineStyle}>
        <div
          style={{
            ...digitBoxStyle,
            width: "auto",
            height: "auto",
            padding: "0 1vh",
            fontSize: "clamp(2vh, 3.5vw, 3.5vh)",
            whiteSpace: "nowrap",
          }}
        >
          {isAM ? "Ante Meridiem" : "Post Meridiem"}
        </div>
      </div>
    </div>
  );
}
