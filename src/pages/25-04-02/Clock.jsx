import React, { useEffect, useRef } from "react";
import stars from "./stars.webp";
import backgroundGif from "./437cb739d14912acd84d65ee853b9067.gif";
import overlay1 from "./OzJtZ3Z.gif";
import overlay2 from "./2556744_d34a4.webp";
import pixelGif from "./sdswrf.gif";

const digits = {
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "6": [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "9": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
};

function DeepSpaceClock() {
  const hour1 = useRef();
  const hour2 = useRef();
  const minute1 = useRef();
  const minute2 = useRef();
  const second1 = useRef();
  const second2 = useRef();

  const makeDigit = (target, digitMatrix) => {
    const container = target.current;
    if (!container) return;
    container.innerHTML = "";
    digitMatrix.forEach((row, i) =>
      row.forEach((on, j) => {
        if (on) {
          const div = document.createElement("div");
          div.style.gridRow = `${i + 1}`;
          div.style.gridColumn = `${j + 1}`;
          div.style.height = "4vmin";
          div.style.width = "4vmin";
          div.style.backgroundImage = `url(${pixelGif})`;
          div.style.backgroundSize = "220% 250%";
          container.appendChild(div);
        }
      })
    );
  };

  useEffect(() => {
    let shownHours = -1,
      shownMinutes = -1,
      shownSeconds = -1;

    const updateClock = () => {
      const now = new Date();
      const [h, m, s] = [
        now.getHours().toString().padStart(2, "0"),
        now.getMinutes().toString().padStart(2, "0"),
        now.getSeconds().toString().padStart(2, "0"),
      ];

      if (h !== shownHours.toString()) {
        makeDigit(hour1, digits[h[0]]);
        makeDigit(hour2, digits[h[1]]);
        shownHours = h;
      }
      if (m !== shownMinutes.toString()) {
        makeDigit(minute1, digits[m[0]]);
        makeDigit(minute2, digits[m[1]]);
        shownMinutes = m;
      }
      if (s !== shownSeconds.toString()) {
        makeDigit(second1, digits[s[0]]);
        makeDigit(second2, digits[s[1]]);
        shownSeconds = s;
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${stars})`,
        backgroundSize: "cover",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: "cover",
          position: "absolute",
          inset: 0,
        }}
      />
      <div
        style={{
          backgroundImage: `url(${overlay1})`,
          backgroundSize: "cover",
          position: "fixed",
          inset: 0,
          opacity: 0.35,
          zIndex: 6,
        }}
      />
      <div
        style={{
          backgroundImage: `url(${overlay2})`,
          backgroundSize: "cover",
          position: "fixed",
          inset: 0,
          opacity: 0.15,
          zIndex: 5,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "3vw",
          animation: "spinClock 20s linear infinite",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <style>
          {`
            @keyframes spinClock {
              0% {
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
              }
 nuevamente
            }
          `}
        </style>
        <div className="digit" ref={hour1} style={digitStyle}></div>
        <div className="digit" ref={hour2} style={digitStyle}></div>
        <div className="digit" ref={minute1} style={digitStyle}></div>
        <div className="digit" ref={minute2} style={digitStyle}></div>
        <div className="digit" ref={second1} style={digitStyle}></div>
        <div className="digit" ref={second2} style={digitStyle}></div>
      </div>
    </div>
  );
}

const digitStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(5, 1fr)",
  width: "13vw",
  height: "44vh",
};

export default DeepSpaceClock;