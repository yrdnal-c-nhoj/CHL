import React, { useEffect, useState } from "react";
import clockFont from "./root.ttf";

// VITE-ready React component: 12-hour digital clock with leading zeros and a.m./p.m.
// - Inline styles with vh/vw/rem units only
// - Local custom font imported as module from same folder
// - Prevents style leakage by scoping font to component only

export default function DigitalClock() {
  const [time, setTime] = useState(() => getTimeParts());

  useEffect(() => {
    const tick = () => setTime(getTimeParts());

    // Align first tick to next whole second
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
        for (const id of window.__digitalClockIntervals) {
          clearInterval(id);
        }
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
      background: "#111",
      padding: "4vh",
      boxSizing: "border-box",
    },
    clock: {
      display: "flex",
      alignItems: "baseline",
      gap: "1.2rem",
      padding: "6vh 8vw",
      borderRadius: "2rem",
      background: "#fff",
      boxShadow: "0 1.2rem 3rem rgba(0,0,0,0.25)",
      fontFamily: "'ClockFont', sans-serif",
    },
    time: {
      fontVariantNumeric: "tabular-nums lining-nums",
      fontWeight: 700,
      fontSize: "12vw",
      lineHeight: 1,
      letterSpacing: "0.08em",
      color: "#111",
      textShadow: "0 .2rem .6rem rgba(0,0,0,0.08)",
    },
    period: {
      fontWeight: 600,
      fontSize: "4.2vw",
      lineHeight: 1,
      letterSpacing: "0.12em",
      textTransform: "lowercase",
      color: "#444",
      userSelect: "none",
    },
    styleTag: {
      fontFace: `@font-face { font-family: 'ClockFont'; src: url(${clockFont}) format('truetype'); }`,
    },
  };

  return (
    <div style={styles.root}>
      <style>{styles.styleTag.fontFace}</style>
      <div style={styles.clock} aria-label={`Current time ${time.hh}:${time.mm}:${time.ss} ${time.period}`}>
        <div style={styles.time} aria-hidden>
          {time.hh}:{time.mm}:{time.ss}
        </div>
        <div style={styles.period}>{time.period}</div>
      </div>
    </div>
  );
}

function getTimeParts() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const isAM = h < 12;
  const period = isAM ? "a.m." : "p.m.";
  h = h % 12;
  if (h === 0) h = 12;
  return {
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
    period,
  };
}
