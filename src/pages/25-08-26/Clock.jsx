import React, { useEffect, useState } from "react";
import clockFont from "./root.ttf";
import bg0 from "./rrr.webp"; // bottom-most
import bg1 from "./ro.gif";   // middle
import bg3 from "./root.webp"; // top foreground

export default function DigitalClock() {
  const [time, setTime] = useState(getTimeParts);

  useEffect(() => {
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
  }, []);

  const styles = {
    root: {
      position: "relative",
      minHeight: "100vh",
      minWidth: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'ClockFont', sans-serif",
      overflow: "hidden",
      boxSizing: "border-box",
    },
    clock: {
      position: "relative",
      fontVariantNumeric: "tabular-nums lining-nums",
      fontSize: "14vw",
      lineHeight: 1,
      letterSpacing: "-0.05em",
      color: "#A89484FF",
      textShadow: `
        2px 2px 0 #3B2E23,

        -2px -1px 0 #DCDAD8FF,
        1px -2px 1px #2E241B,
        -1px 2px 1px #2E241B
      `,
      transform: "rotate(-1deg) skewX(-2deg) skewY(1deg)",
      zIndex: 2,
      userSelect: "none",
      filter: "contrast(1.2) saturate(1.0)",
      animation: "branchFlicker 3s infinite alternate",
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
      fontFace: `@font-face { font-family: 'ClockFont'; src: url(${clockFont}) format('truetype'); }`,
    },
  };

  const layers = [
    {
      img: bg0,
      opacity: 1,
      zIndex: 1,
      width: "120%",
      height: "110%",
      top: "-5%",
      left: "-10%",
    },
    {
      img: bg1,
      opacity: 1,
      zIndex: 8,
      width: "100%",
      height: "120%",
      top: "-10%",
      left: "0",
    },
    {
      img: bg3,
      opacity: 0.9,
      zIndex: 2,
      invert: 90,
      brightness: 0.9,
      saturation: 0.4,
      width: "100%",
      height: "170%",
      top: "0%",
      left: "0%",
    },
  ];

  return (
    <div style={styles.root}>
      <style>{styles.styleTag.fontFace}</style>
      <style>{`
        @keyframes branchFlicker {
          0% { text-shadow: 2px 2px 0 #3B2E23, -2px -1px 0 #3B2E23; }
          50% { text-shadow: 3px 1px 0 #86841BFF, -1px -2px 0 #3B2E23; }
          100% { text-shadow: 2px 3px 0 #3B2E23, -2px -1px 0 #3B2E23; }
        }
      `}</style>

      {layers.map((layerProps, i) => {
        // Duplicate and flip the second layer horizontally
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
        {time.hh} {time.mm} {time.period}
      </div>
    </div>
  );
}

function getTimeParts() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const isAM = h < 12;
  const period = isAM ? "AM" : "PM";
  h = h % 12 || 12; // convert to 12-hour format
  return {
    hh: String(h),
    mm: String(m).padStart(2, "0"),
    period,
  };
}
