// DigitalClock.jsx (Optimized for FOUT Prevention)
import React, { useState, useEffect, useRef, useCallback } from "react";
import font251130 from "./nono.ttf";
import backgroundImg from "./crax.jpg";

export default function DigitalClock() {
  const [now, setNow] = useState(() => new Date());
  const [fontReady, setFontReady] = useState(false); // New state to control rendering
  const injected = useRef(false);

  // Use a simple, safe font-family name
  const fontFamily = "ClockFont2025_12_01";
  const styleId = "ClockFontStyle_2025_12_01";
  const FONT_FALLBACK = 'monospace'; // Fallback font for interim display

  // --- 1. Font Injection and Loading (Optimized) ---
  useEffect(() => {
    if (injected.current) return;

    // 1a. Inject global CSS (Viewports & @font-face definition)
    const css = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${font251130}') format('truetype');
        font-display: swap; /* Tells browser to use fallback then swap */
      }
      
      /* Global Viewport Fixes */
      html, body {
        height: 100%; height: 100dvh; height: -webkit-fill-available;
        margin: 0; padding: 0; overflow: hidden;
      }
      body { min-height: 100dvh; min-height: -webkit-fill-available; }
    `;

    const tag = document.createElement("style");
    tag.id = styleId;
    tag.appendChild(document.createTextNode(css));
    document.head.appendChild(tag);
    
    // 1b. Use Font Loading API to wait for font
    // This is the key to preventing FOUT: do not render digits until font is loaded
    document.fonts.load(`1em '${fontFamily}'`)
      .then(() => {
        setFontReady(true);
      })
      .catch((err) => {
        console.error("Font loading failed, falling back.", err);
        // Render anyway, using the monospace fallback font
        setFontReady(true); 
      });

    injected.current = true;
  }, []);

  // --- 2. Clock Update (Unchanged) ---
  useEffect(() => {
    // Only start the clock interval if the font injection/loading process has started
    if (!injected.current) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 3. Time Calculations and Leetspeak (Unchanged) ---
  const digitMap = {
    "0": "1", "1": "T", "2": "m", "3": "E", "4": "F",
    "5": "r", "6": "L", "7": "2", "8": "q", "9": "C",
  };

  const sub = useCallback((str) => str.split("").map((d) => digitMap[d] || d).join(""), []);
  
  const HH = sub(String(now.getHours()).padStart(2, "0"));
  const MM = sub(String(now.getMinutes()).padStart(2, "0"));
  const SS = sub(String(now.getSeconds()).padStart(2, "0"));

  const isPhone = window.innerWidth < 600;

  // --- 4. Inline Style Definitions (Unchanged/Refined) ---

  const baseFontSize = isPhone ? "24vw" : "16vw";
  const boxWidth = isPhone ? "22vw" : "14vw";
  const boxHeight = isPhone ? "24vw" : "16vw";
  
  // Use the font family state: Fallback until loaded
  const currentFontFamily = fontReady ? `'${fontFamily}', ${FONT_FALLBACK}` : FONT_FALLBACK;
  
  const digitBox = {
    width: boxWidth,
    height: boxHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Use the dynamic font family
    fontFamily: currentFontFamily, 
    fontSize: baseFontSize,
    color: "#071A16FF",
    borderRadius: "8px",
    textShadow: `
      -1px -1px 0 #F98016FF,
       1px -1px 0 #F98016FF,
      -1px  1px 0 #F98016FF,
       1px  1px 0 #F9800FFF
    `,
    userSelect: "none",
  };

  const container = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    margin: 0,
    padding: isPhone ? "2vh 0" : "0",
    boxSizing: "border-box",
  };

  const row = {
    display: "flex",
    flexDirection: "row",
    gap: "3vw", // Consistent gap using vw
    alignItems: "center",
  };

  const column = {
    display: "flex",
    flexDirection: "column",
    gap: "4vh", // Gap using vh
    alignItems: "center",
  };

  const renderPair = (digits) => (
    <div style={{ display: "flex", gap: isPhone ? "2vw" : "1vw" }}>
      <div style={digitBox}>{digits[0]}</div>
      <div style={digitBox}>{digits[1]}</div>
    </div>
  );

  // --- 5. Conditional Render (The FOUT solution) ---
  if (!fontReady) {
    // Render a minimal placeholder or nothing while waiting for the font
    return (
        <div style={container}>
            <div style={{color: "white", fontSize: "4vh"}}>Loading...</div>
        </div>
    );
  }

  return (
    <div style={container}>
      {isPhone ? (
        <div style={column}>
          {renderPair(HH)}
          {renderPair(MM)}
          {renderPair(SS)}
        </div>
      ) : (
        <div style={row}>
          {renderPair(HH)}
          {renderPair(MM)}
          {renderPair(SS)}
        </div>
      )}
    </div>
  );
}