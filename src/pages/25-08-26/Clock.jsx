import React, { useEffect, useState } from "react";
import clockFont from "./root.ttf";
import bg1 from "./ro.gif";
import bg2 from "./roo.gif";
import bg3 from "./root.gif";

export default function DigitalClock() {
  const [time, setTime] = useState(() => getTimeParts());

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
      minHeight: "100vh",
      minWidth: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `url(${bg1}) center/cover no-repeat,
                   url(${bg2}) center/cover no-repeat,
                   url(${bg3}) center/cover no-repeat`,
      backgroundBlendMode: "overlay",
      padding: "4vh",
      boxSizing: "border-box",
    },
    clock: {
      display: "flex",
      alignItems: "baseline",
      gap: "1.2rem",
      padding: "6vh 8vw",
      borderRadius: "2rem",
      fontFamily: "'ClockFont', sans-serif",
    },
    time: {
      fontVariantNumeric: "tabular-nums lining-nums",
      fontWeight: 700,
      fontSize: "12vw",
      lineHeight: 1,
      letterSpacing: "0.01em",
      color: "#0D8352FF", // single color variable for digits + AM/PM
      textShadow: "0 .2rem .6rem #0D8352FF",
      userSelect: "none",
    },
    styleTag: {
      fontFace: `@font-face { font-family: 'ClockFont'; src: url(${clockFont}) format('truetype'); }`,
    },
  };

  return (
    <div style={styles.root}>
      <style>{styles.styleTag.fontFace}</style>
      <div style={styles.clock} aria-label={`Current time ${time.hh}:${time.mm} ${time.period}`}>
        <div style={styles.time}>
          {time.hh}{time.mm}{time.period}
        </div>
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
  h = h % 12;
  if (h === 0) h = 12;
  return {
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    period,
  };
}
