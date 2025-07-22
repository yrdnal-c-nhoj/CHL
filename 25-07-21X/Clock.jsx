import React, { useEffect, useState } from "react";
import slotFont from "./slot.otf";
import StickyNote from "../src/stickynote";
const Reel = ({ value, symbols }) => {
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const index = symbols.indexOf(value);
    const baseOffset = index * -2;
    let timeout1, timeout2;

    setSpinning(true);
    setOffset(baseOffset - 20); // spin through ~10 symbols

    timeout1 = setTimeout(() => {
      setOffset(baseOffset);
      setSpinning(false);
    }, 1000 + Math.random() * 1000); // spin duration

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [value, symbols]);

  const reelStyle = {
    height: "6rem",
    overflow: "hidden",
    fontFamily: "slot",
    fontSize: "4rem",
    lineHeight: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    transform: `translateY(${offset}rem)`,
    transition: spinning ? "transform 1s ease-in-out" : "transform 0.3s ease-out",
  };

  return (
    <div style={{ height: "6rem", width: "4rem", overflow: "hidden" }}>
      <div style={reelStyle}>
        {symbols.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
         <StickyNote />
    </div>
  );
};

const SlotMachineClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const update = () => setTime(new Date());
    const interval = setInterval(() => {
      update();
    }, 4000); // rerun every 4s: 2s spin, 2s show
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours() % 12 || 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourDigits = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteDigits = Array.from({ length: 60 }, (_, i) => i);
  const secondDigits = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'slot';
        src: url(${slotFont}) format('opentype');
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#000",
    gap: "1rem",
  };

  return (
    <div style={containerStyle}>
      <Reel value={hour} symbols={hourDigits} />
      <Reel value={minute} symbols={minuteDigits} />
      <Reel value={second} symbols={secondDigits} />
    </div>
 
  );
};

export default SlotMachineClock;