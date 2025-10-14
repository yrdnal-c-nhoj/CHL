import React, { useEffect, useState, useRef } from "react";
import bgImage from "./roundhay.webp";
import bgImage2 from "./ro.jpg"; // second background
import roundhayFont from "./roundhay.ttf";
import importantFont from "./line.otf";

export default function Clock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date());
  const tickRef = useRef(null);

  // Base font size for digits/labels, responsive with clamp
  const fontSizeVH = "clamp(3vh, 4vw, 6vh)";
  const dividerScale = 1.1; 

  const z = (n) => (n < 10 ? `0${n}` : `${n}`);

  const sharedTextStyle = {
    color: "#ffcc33",
    textShadow: `
      1px 0px 0 #ff00ff,
      -1px 0px 0 #00ffff
    `,
    fontFamily: "'RoundhayFont', serif",
  };

  const digitBoxStyle = {
    ...sharedTextStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    fontSize: fontSizeVH,
    width: "auto",
    minWidth: "2.5ch", // keeps digits consistent
    height: "auto",
    padding: "0.2em 0.3em",
  };

  const labelStyle = {
    ...sharedTextStyle,
    fontSize: fontSizeVH,
  };

  const dividerStyle = {
    ...sharedTextStyle,
    fontFamily: "'ImportantFont', serif",
    fontSize: `calc(${fontSizeVH} * ${dividerScale})`,
    opacity: 0.8,
    color: "#00ccff",
    textShadow: `
      1px 1px 0 #ff0066,
      1px 1px 0 #ffcc00
    `,
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a0b2e",
    backgroundImage: `url(${bgImage}), url(${bgImage2})`,
    backgroundSize: "contain, cover",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "66% center, center",
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
    padding: "2vh",
    boxSizing: "border-box",
  };

  const lineStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1vw",
    lineHeight: "1",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const digitsRowStyle = {
    display: "flex",
    gap: "0.5vw",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  useEffect(() => {
    let mounted = true;
    let imageLoaded = false;
    let image2Loaded = false;
    let font1Loaded = false;
    let font2Loaded = false;

    const checkReady = () => {
      if (imageLoaded && image2Loaded && font1Loaded && font2Loaded && mounted) setReady(true);
    };

    const img1 = new Image();
    img1.src = bgImage;
    img1.onload = img1.onerror = () => {
      imageLoaded = true;
      checkReady();
    };

    const img2 = new Image();
    img2.src = bgImage2;
    img2.onload = img2.onerror = () => {
      image2Loaded = true;
      checkReady();
    };

    const f1 = new FontFace("RoundhayFont", `url(${roundhayFont})`);
    f1.load().then((font) => {
      document.fonts.add(font);
      font1Loaded = true;
      checkReady();
    }).catch(() => {
      font1Loaded = true;
      checkReady();
    });

    const f2 = new FontFace("ImportantFont", `url(${importantFont})`);
    f2.load().then((font) => {
      document.fonts.add(font);
      font2Loaded = true;
      checkReady();
    }).catch(() => {
      font2Loaded = true;
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
      {String(value).split("").map((digit, i) => (
        <div key={i} style={digitBoxStyle}>{digit}</div>
      ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Hours */}
      <div style={lineStyle}>
        {renderDigits(z(hours24))}
        <div style={labelStyle}>&nbsp;Hours</div>
      </div>
      <div style={dividerStyle}>h</div>

      {/* Minutes */}
      <div style={lineStyle}>
        {renderDigits(z(minutes))}
        <div style={labelStyle}>&nbsp;Minutes</div>
      </div>
      <div style={dividerStyle}>h</div>

      {/* Seconds */}
      <div style={lineStyle}>
        {renderDigits(z(seconds))}
        <div style={labelStyle}>&nbsp;Seconds</div>
      </div>
      <div style={dividerStyle}>h</div>

      {/* Milliseconds */}
      <div style={lineStyle}>
        {renderDigits(milliseconds)}
        <div style={labelStyle}>&nbsp;Milliseconds</div>
      </div>
      <div style={dividerStyle}>j</div>

      {/* AM/PM */}
      <div style={lineStyle}>
        <div
          style={{
            ...digitBoxStyle,
            width: "auto",
            height: "auto",
            whiteSpace: "nowrap",
            padding: "0 0.5vh",
          }}
        >
          {isAM ? "Ante Meridiem" : "Post Meridiem"}
        </div>
      </div>
    </div>
  );
}
