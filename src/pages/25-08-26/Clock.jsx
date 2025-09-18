import React, { useState, useEffect } from "react";
import clockFont from "./root.ttf";
import bg0 from "./rrr.webp"; // bottom-most
import bg1 from "./ro.gif";   // middle
import bg3 from "./root.webp"; // top foreground

export default function DigitalClock() {
  const [time, setTime] = useState(getTimeParts);
  const [isReady, setIsReady] = useState(false);

  // Preload font and images
  useEffect(() => {
    let fontLoaded = false;
    let imagesLoaded = 0;

    const checkReady = () => {
      if (fontLoaded && imagesLoaded === 3) setIsReady(true);
    };

    // Load font
    const font = new FontFace("ClockFontScoped_18_09_25", `url(${clockFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      fontLoaded = true;
      checkReady();
    });

    // Preload images
    [bg0, bg1, bg3].forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded++;
        checkReady();
      };
    });
  }, []);

  // Clock ticking
  useEffect(() => {
    if (!isReady) return;
    const tick = () => setTime(getTimeParts());
    const now = Date.now();
    const delay = 1000 - (now % 1000);

    const align = setTimeout(() => {
      tick();
      const id = setInterval(tick, 1000);
      (window.__digitalClockIntervals ||= new Set()).add(id);
    }, delay);

    return () => {
      clearTimeout(align);
      if (window.__digitalClockIntervals) {
        for (const id of window.__digitalClockIntervals) clearInterval(id);
        window.__digitalClockIntervals.clear();
      }
    };
  }, [isReady]);

  if (!isReady) {
    // Black screen while font/images load
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "black" }} />;
  }

  const styles = {
    root: {
      position: "relative",
      height: "100dvh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'ClockFontScoped_18_09_25', sans-serif",
      overflow: "hidden",
    },
    clock: {
      fontVariantNumeric: "tabular-nums lining-nums",
      fontSize: "14vw",
      lineHeight: 1,
      letterSpacing: "-0.05em",
      color: "#BFBBAAFF",
      textShadow: `
        0.2rem 0.2rem 0 #373635FF,
        -0.2rem -0.1rem 0.4rem #6B5D48FF,
        0.1rem -0.2rem 0.4rem #403A30FF,
        -0.1rem 0.2rem 0.4rem #3C362FFF
      `,
      transform: "rotate(-1deg) skewX(-2deg) skewY(1deg)",
      zIndex: 4,
      userSelect: "none",
      filter: "contrast(1.2) saturate(2.0)",
    },
    layer: ({
      img,
      opacity = 1,
      zIndex = 0,
      brightness = 1,
      saturation = 1,
      invert = 0,
      hueRotate = 0,
      transform = undefined,
      width = "100%",
      height = "100%",
      top = 0,
      left = 0,
      backgroundSize = "cover",
      backgroundPosition = "center",
    }) => ({
      position: "absolute",
      top,
      left,
      width,
      height,
      backgroundImage: `url(${img})`,
      backgroundSize,
      backgroundPosition,
      backgroundRepeat: "no-repeat",
      opacity,
      zIndex,
      pointerEvents: "none",
      filter: `brightness(${brightness}) saturate(${saturation}) invert(${invert}%) hue-rotate(${hueRotate}deg)`,
      transform,
    }),
    styleTag: {
      fontFace: `@font-face { font-family: 'ClockFontScoped_18_09_25'; src: url(${clockFont}) format('truetype'); }`,
    },
  };

  const layers = [
    { img: bg0, opacity: 1, zIndex: 1, width: "120%", height: "110%", top: "-5%", left: "-10%" },
    { img: bg1, zIndex: 8, width: "100%", height: "120%", top: "-10%", left: "0%" },
    { img: bg3, opacity: 0.8, zIndex: 6, invert: 90, brightness: 0.9, saturation: 0.4, width: "100%", height: "170%", top: "0%", left: "0%" },
  ];

  return (
    <div style={styles.root}>
      <style>{styles.styleTag.fontFace}</style>

      {layers.map((layerProps, i) => {
        if (i === 1) {
          return (
            <React.Fragment key={i}>
              <div style={styles.layer(layerProps)} />
              <div style={styles.layer({ ...layerProps, transform: "scaleX(-1)" })} />
            </React.Fragment>
          );
        }
        return <div key={i} style={styles.layer(layerProps)} />;
      })}

      <div style={styles.clock}>
        {time.hh}{time.mm}{time.period}
      </div>
    </div>
  );
}

function getTimeParts() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const period = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return { hh: String(h), mm: String(m).padStart(2, "0"), period };
}
