import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const computeClock = (t) => {
    const hours = t.getHours() % 12;
    const minutes = t.getMinutes();
    const seconds = t.getSeconds();

    const centerX = 40;
    const centerY = 18;
    const radius = 22;

    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);

    const display = Array(41)
      .fill(null)
      .map(() => Array(81).fill(" "));

    for (let angle = 0; angle < 360; angle += 2) {
      const rad = (angle * Math.PI) / 180;
      const x = Math.round(centerX + radius * Math.cos(rad));
      const y = Math.round(centerY + radius * Math.sin(rad) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = "&";
    }

    const hourNames = [
      "DEKKDU", "UNU", "DU", "TRI", "KVAR", "KVIN",
      "SES", "SEP", "OK", "NAŬ", "DEK", "DEKUNU"
    ];

    const wordData = [];
    for (let i = 0; i < 12; i++) {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const x = Math.round(centerX + (radius - 2) * Math.cos(angle));
      const y = Math.round(centerY + (radius - 2) * Math.sin(angle) * 0.5);
      const text = hourNames[i];
      wordData.push({ x, y, text });
    }

    // Hands
    for (let i = 0; i <= 8; i++) {
      const x = Math.round(centerX + i * Math.cos(hourAngle));
      const y = Math.round(centerY + i * Math.sin(hourAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = "@";
    }
    for (let i = 0; i <= 14; i++) {
      const x = Math.round(centerX + i * Math.cos(minuteAngle));
      const y = Math.round(centerY + i * Math.sin(minuteAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = "%";
    }
    for (let i = 0; i <= 16; i++) {
      const x = Math.round(centerX + i * Math.cos(secondAngle));
      const y = Math.round(centerY + i * Math.sin(secondAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = "#";
    }

    display[centerY][centerX] = "+";

    return { ascii: display.map(row => row.join("")).join("\n"), wordData };
  };

  const { ascii, wordData } = computeClock(time);

  // For responsive scaling, compute char size as a fraction of viewport
  const charWidth = `calc(100vw / 90)`; // 81 chars + margin
  const charHeight = `calc(100vh / 45)`; // 41 rows + margin

  // Total width/height in chars
  const totalWidth = 81;
  const totalHeight = 41;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        backgroundColor: "#D7F5F3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        position: "relative",
        fontSize: charHeight,
        lineHeight: 1,
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      {/* ASCII clock */}
      <pre style={{ margin: 0, zIndex: 1, fontSize: charHeight }}>{ascii}</pre>

      {/* Red Esperanto numbers overlay */}
      {wordData.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `calc(50% - (${totalHeight} / 2) * ${charHeight} + ${w.y} * ${charHeight})`,
            left: `calc(50% - (${totalWidth} / 2) * ${charWidth} + ${w.x} * ${charWidth})`,
            color: "red",
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 2,
            fontSize: charHeight,
          }}
        >
          {w.text}
        </div>
      ))}
    </div>
  );
};

export default Clock;
