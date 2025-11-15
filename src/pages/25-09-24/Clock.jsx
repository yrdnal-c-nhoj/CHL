import React, { useState, useEffect } from "react";
import font20250924 from "./cora.ttf";

const HorizontalProportionalGradientClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load and persist font once
  useEffect(() => {
    let cancelled = false;

    const loadFont = async () => {
      try {
        const font = new FontFace("CustomFont", `url(${font20250924})`);
        const loaded = await font.load();

        if (!cancelled) {
          document.fonts.add(loaded);
          setFontReady(true);
        }
      } catch (err) {
        console.error("Font failed to load:", err);
      }
    };

    loadFont();
    return () => {
      cancelled = true;
    };
  }, []);

  // Clock tick animation
  useEffect(() => {
    if (!fontReady) return;

    let frame;
    const tick = () => {
      setTime(new Date());
      frame = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, [fontReady]);

  if (!fontReady) return null;

  let hours = time.getHours() % 12;
  if (hours === 0) hours = 12;

  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const numbers = [
    { value: hours, max: 12, isHour: true },
    { value: Math.floor(minutes / 10), max: 5 },
    { value: minutes % 10, max: 9 },
    { value: Math.floor(seconds / 10), max: 5 },
    { value: seconds % 10, max: 9 },
  ];

  const scaleFactor = 29;
  const adder = 2;

  const scaleDigit = (num) => {
    const normalized = num.isHour
      ? (num.value - 1) / 11
      : num.value / num.max;
    return normalized * scaleFactor + adder;
  };

  const getGray = (value, max) => {
    const gray = Math.floor((value / max) * 255);
    return `rgb(${gray}, ${gray}, ${gray})`;
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
  };

  const styles = `
    .clock-digit {
      font-family: 'CustomFont', sans-serif;
      text-shadow: -4px 0px 0px black, 2px 0px 0px white;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: flex 0.6s ease-in-out, font-size 0.6s ease-in-out,
                  background-color 0.6s ease-in-out, color 0.6s ease-in-out;
      border-right: 1px solid black;
      animation: borderFade 12s infinite linear;
      filter: saturate(300%);
    }
    .clock-digit:last-child {
      border-right: none;
    }
    @keyframes borderFade {
      0% { border-color: black; }
      50% { border-color: white; }
      100% { border-color: black; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={containerStyle}>
        {numbers.map((num, idx) => {
          const size = scaleDigit(num);
          const bgColor = getGray(num.value, num.max);

          return (
            <div
              key={idx}
              className="clock-digit"
              style={{
                flex: `${size} 1 0`,
                fontSize: `${size}vw`,
                backgroundColor: bgColor,
              }}
            >
              {num.value}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HorizontalProportionalGradientClock;
