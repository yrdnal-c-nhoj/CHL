import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const drawClock = () => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);

    const centerX = 40;
    const centerY = 18;
    const radius = 22;

    const display = Array(41).fill(null).map(() => Array(81).fill(' '));

    // Clock circle
    for (let angle = 0; angle < 360; angle += 2) {
      const rad = angle * (Math.PI / 180);
      const x = Math.round(centerX + radius * Math.cos(rad));
      const y = Math.round(centerY + radius * Math.sin(rad) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = '&';
      }
    }

    // Hour markers (Esperanto names)
    const hourNames = [
      'DEKKDU', 'UNU', 'DU', 'TRI', 'KVAR', 'KVIN',
      'SES', 'SEP', 'OK', 'NAŬ', 'DEK', 'DEKUNU'
    ];
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = Math.round(centerX + (radius - 2) * Math.cos(angle));
      const y = Math.round(centerY + (radius - 2) * Math.sin(angle) * 0.5);
      const text = hourNames[i];
      const startX = x - Math.floor(text.length / 2);
      if (y >= 0 && y < 41) {
        for (let j = 0; j < text.length; j++) {
          const xx = startX + j;
          if (xx >= 0 && xx < 81) {
            display[y][xx] = text[j];
          }
        }
      }
    }

    // Hour hand
    for (let i = 0; i <= 8; i++) {
      const x = Math.round(centerX + i * Math.cos(hourAngle));
      const y = Math.round(centerY + i * Math.sin(hourAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = '@';
    }

    // Minute hand
    for (let i = 0; i <= 14; i++) {
      const x = Math.round(centerX + i * Math.cos(minuteAngle));
      const y = Math.round(centerY + i * Math.sin(minuteAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = '%';
    }

    // Second hand
    for (let i = 0; i <= 16; i++) {
      const x = Math.round(centerX + i * Math.cos(secondAngle));
      const y = Math.round(centerY + i * Math.sin(secondAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) display[y][x] = '#';
    }

    display[centerY][centerX] = '+';

    return display.map(row => row.join('')).join('\n');
  };

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        backgroundColor: "#D7F5F3FF",
        color: "#0A110CFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        whiteSpace: "pre",
        overflow: "auto",
        fontSize: "clamp(8px, 1.5vh, 16px)",
        lineHeight: "1",
      }}
    >
      {drawClock()}
    </div>
  );
};

export default Clock;
