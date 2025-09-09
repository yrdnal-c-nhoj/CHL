// DigitalClock.jsx
import React, { useEffect, useRef, useState } from "react";

export default function DigitalClock({
  mode = "24",
  showAmPm = false,
  leadingZeros = true,
  showSeconds = true,
  showMilliseconds = true,
  style = {},
}) {
  const [, setTick] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const now = new Date();

  const pad = (num, length = 2) => String(num).padStart(length, "0");

  let hours = now.getHours();
  let ampm = "";
  if (mode === "12") {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const hourStr = leadingZeros ? pad(hours, 2) : String(hours);
  const minuteStr = leadingZeros ? pad(minutes, 2) : String(minutes);
  const secondStr = leadingZeros ? pad(seconds, 2) : String(seconds);
  const msStr = pad(Math.floor(ms / 10), 2); // 🔥 only two digits

  let timeStr = `${hourStr}:${minuteStr}`;
  if (showSeconds || showMilliseconds) {
    timeStr += `:${secondStr}`;
  }
  if (showMilliseconds) {
    timeStr += `.${msStr}`;
  }
  if (mode === "12" && showAmPm) {
    timeStr += ` ${ampm}`;
  }

  const defaultStyle = {
    position: "fixed",       // center in viewport
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
    fontSize: "3.5rem",
    letterSpacing: "0.05em",
    padding: "0.5rem 1rem",
    background: "rgba(0,0,0,0.06)",
    borderRadius: "10px",
    userSelect: "none",
    textAlign: "center",
    ...style,
  };

  return (
    <div style={defaultStyle} aria-live="polite">
      {timeStr}
    </div>
  );
}
