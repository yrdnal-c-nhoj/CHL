import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const drawClock = () => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Calculate angles (in radians, 0 = 12 o'clock, clockwise)
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);

    // Clock parameters
    const centerX = 40;
    const centerY = 20;
    const radius = 18;

    // Create a 2D array for the display
    const display = Array(41).fill(null).map(() => Array(81).fill(' '));

    // Draw clock circle
    for (let angle = 0; angle < 360; angle += 2) {
      const rad = angle * (Math.PI / 180);
      const x = Math.round(centerX + radius * Math.cos(rad));
      const y = Math.round(centerY + radius * Math.sin(rad) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = '&';
      }
    }

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = Math.round(centerX + (radius - 2) * Math.cos(angle));
      const y = Math.round(centerY + (radius - 2) * Math.sin(angle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = i === 0 ? '12' : i.toString();
      }
    }

    // Draw hour hand
    const hourLength = 8;
    for (let i = 0; i <= hourLength; i++) {
      const x = Math.round(centerX + i * Math.cos(hourAngle));
      const y = Math.round(centerY + i * Math.sin(hourAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = '@';
      }
    }

    // Draw minute hand
    const minuteLength = 14;
    for (let i = 0; i <= minuteLength; i++) {
      const x = Math.round(centerX + i * Math.cos(minuteAngle));
      const y = Math.round(centerY + i * Math.sin(minuteAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = '%';
      }
    }

    // Draw second hand
    const secondLength = 16;
    for (let i = 0; i <= secondLength; i++) {
      const x = Math.round(centerX + i * Math.cos(secondAngle));
      const y = Math.round(centerY + i * Math.sin(secondAngle) * 0.5);
      if (y >= 0 && y < 41 && x >= 0 && x < 81) {
        display[y][x] = '#';
      }
    }

    // Draw center point
    display[centerY][centerX] = '◉';

    // Add digital time display at bottom
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timeStartX = Math.floor((81 - timeStr.length) / 2);
    for (let i = 0; i < timeStr.length; i++) {
      display[38][timeStartX + i] = timeStr[i];
    }

    return display.map(row => row.join('')).join('\n');
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        color: "#0f0",
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