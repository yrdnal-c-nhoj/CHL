import React, { useState, useEffect } from "react";
import kittycatFont from "./disc.ttf";
import bgOuter from "./dis.gif";
import bgInner from "./disc.gif";

const AnalogClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  const hours24 = currentTime.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  const smoothSeconds = seconds + milliseconds / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours12 + smoothMinutes / 60;

  const minutesTens = Math.floor(minutes / 10);
  const minutesOnes = minutes % 10;
  const secondsTens = Math.floor(seconds / 10);
  const secondsOnes = seconds % 10;

  const hoursRotation = -(smoothHours / 12) * 360 - 90;
  const minutesTensRotation = -(smoothMinutes / 10 / 6) * 360 - 90;
  const minutesOnesRotation = -((smoothMinutes % 10) / 10) * 360 - 90;
  const secondsTensRotation = -(smoothSeconds / 10 / 6) * 360 - 90;
  const secondsOnesRotation = -((smoothSeconds % 10) / 10) * 360 - 90;

  const createRing = (count, outerRadius, innerRadius, activeIndex, labelType, fontSize) => {
    const sections = [];
    const sectionAngle = 360 / count;

    for (let i = 0; i < count; i++) {
      const startAngle = i * sectionAngle;
      const endAngle = startAngle + sectionAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const startXOuter = 50 + outerRadius * Math.cos(startRad);
      const startYOuter = 50 + outerRadius * Math.sin(startRad);
      const endXOuter = 50 + outerRadius * Math.cos(endRad);
      const endYOuter = 50 + outerRadius * Math.sin(endRad);

      const startXInner = 50 + innerRadius * Math.cos(startRad);
      const startYInner = 50 + innerRadius * Math.sin(startRad);
      const endXInner = 50 + innerRadius * Math.cos(endRad);
      const endYInner = 50 + innerRadius * Math.sin(endRad);

      const d = `
        M ${startXOuter} ${startYOuter}
        A ${outerRadius} ${outerRadius} 0 0 1 ${endXOuter} ${endYOuter}
        L ${endXInner} ${endYInner}
        A ${innerRadius} ${innerRadius} 0 0 0 ${startXInner} ${startYInner}
        Z
      `;

      const labelAngle = startAngle + sectionAngle / 2;
      const labelRad = (labelAngle * Math.PI) / 180;
      const labelRadius = (outerRadius + innerRadius) / 2;
      const labelX = 50 + labelRadius * Math.cos(labelRad);
      const labelY = 50 + labelRadius * Math.sin(labelRad);
      const textRotation = labelAngle + 90;

      let displayValue = i;
      if (labelType === "hours") displayValue = i === 0 ? 12 : i;

      sections.push(
        <g key={i}>
          <path d={d} style={{ fill: "transparent", stroke: "none" }} />
          <text
            x={labelX}
            y={labelY}
            style={{
              textAnchor: "middle",
              alignmentBaseline: "middle",
              fontSize: fontSize,
              fontFamily: `'CustomClockFont', Arial, sans-serif`,
              fill: i === activeIndex ? "#ED1010FF" : "#69646AFF",
              fontWeight: "bold",
              textShadow:
                i === activeIndex
                  ? `2px 2px 0 #000,
                     -2px -2px 0 #000,
                     2px -2px 0 #000,
                     -2px 2px 0 #000,
                     4px 4px 10px #FF0000`
                  : "none",
            }}
            transform={`rotate(${textRotation}, ${labelX}, ${labelY})`}
          >
            {displayValue}
          </text>
        </g>
      );
    }
    return sections;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgOuter})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "contrast(0.8) opacity(0.9)",
        transform: "scaleX(-1)", // flip horizontally
      }}
    >
      {/* Custom font */}
      <style>
        {`
          @font-face {
            font-family: 'CustomClockFont';
            src: url(${kittycatFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Dark overlay over outer background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      />

      {/* Clock container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scaleX(-1)", // flip inner container too
          width: "90vmin",
          height: "90vmin",
          borderRadius: "50%",
          backgroundImage: `url(${bgInner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(2.4)",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Optional inner dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1,
          }}
        />

        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", zIndex: 2 }}>
          <g transform={`rotate(${hoursRotation}, 50, 50)`}>
            {createRing(12, 48, 38, hours12, "hours", "0.7rem")}
          </g>
          <g transform={`rotate(${minutesTensRotation}, 50, 50)`}>
            {createRing(6, 38, 30, minutesTens, "minutesTens", "0.6rem")}
          </g>
          <g transform={`rotate(${minutesOnesRotation}, 50, 50)`}>
            {createRing(10, 30, 22, minutesOnes, "minutesOnes", "0.5rem")}
          </g>
          <g transform={`rotate(${secondsTensRotation}, 50, 50)`}>
            {createRing(6, 22, 14, secondsTens, "secondsTens", "0.4rem")}
          </g>
          <g transform={`rotate(${secondsOnesRotation}, 50, 50)`}>
            {createRing(10, 14, 6, secondsOnes, "secondsOnes", "0.3rem")}
          </g>
          {/* Center circle transparent */}
          <circle cx="50" cy="50" r="6" fill="transparent" />
        </svg>
      </div>
    </div>
  );
};

export default AnalogClock;
