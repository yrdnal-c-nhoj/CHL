import React, { useEffect, useRef } from "react";
import pinMeNeedlesFont from "./pin_me_needles.ttf";

import bgImage from "./sco.webp";
import hourHandImg from "./giphy1-ezgif.com-rotate(2).gif";
import minuteHandImg from "./giphy1-ezgif.com-rotate(1).gif";
import secondHandImg from "./giphy1-ezgif.com-rotate(3).gif";

const ScorpionClock = () => {
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  useEffect(() => {
    // Inject font-face dynamically
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @font-face {
        font-family: 'pin_me_needles';
        src: url(${pinMeNeedlesFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(styleEl);

    function updateClock() {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const jitter = () => Math.random() * 2 - 1;

      const secondDeg = seconds * 6 + jitter() * 0.3;
      const minuteDeg = minutes * 6 + seconds / 10 + jitter() * 0.02;
      const hourDeg = hours * 30 + minutes / 2 + jitter() * 0.005;

      const secondScale = 1 + Math.sin((seconds * Math.PI) / 30) * 0.05;
      const minuteScale = 1 + Math.sin((minutes * Math.PI) / 30) * 0.03;
      const hourScale = 1 + Math.sin((hours * Math.PI) / 6) * 0.02;

      if (secondHandRef.current)
        secondHandRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg) scaleY(${secondScale})`;
      if (minuteHandRef.current)
        minuteHandRef.current.style.transform = `translateX(-60%) rotate(${minuteDeg}deg) scaleY(${minuteScale})`;
      if (hourHandRef.current)
        hourHandRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg) scaleY(${hourScale})`;
    }

    const interval = setInterval(updateClock, 50);
    updateClock();

    return () => {
      clearInterval(interval);
      document.head.removeChild(styleEl);
    };
  }, []);

  // Number positions in degrees for 12 numbers
  const numbers = [
    { num: 1, deg: 30 },
    { num: 2, deg: 60 },
    { num: 3, deg: 90 },
    { num: 4, deg: 120 },
    { num: 5, deg: 150 },
    { num: 6, deg: 180 },
    { num: 7, deg: 210 },
    { num: 8, deg: 240 },
    { num: 9, deg: 270 },
    { num: 10, deg: 300 },
    { num: 11, deg: 330 },
    { num: 12, deg: 0 },
  ];

  return (
    <>
      {/* Background */}
      <img
        src={bgImage}
        alt="Background"
        style={{
          position: "fixed",
          opacity: 0.7,
          top: 0,
          left: 0,
          width: "100vw",
          height: "130vh",
          objectFit: "cover",
          zIndex: -1,
          filter: "saturate(200%) contrast(200%)",
        }}
      />

      {/* Title Container */}
      <div
        style={{
          color: "#c4a693",
          textShadow: "#66ed7f 0.1rem 0",
          position: "absolute",
          top: "0.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "98%",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 6,
          fontSize: "2rem",
          fontFamily: "'Roboto Slab', serif",
        }}
      >
        <div style={{ fontSize: "1.5rem", fontStyle: "italic", fontFamily: "'Oxanium', serif", letterSpacing: "-0.1rem" }}>
          BorrowedTime
        </div>
        <div>Cubist Heart Laboratories</div>
      </div>

      {/* Date Container */}
      <div
        style={{
          color: "#7afd78",
          position: "absolute",
          bottom: "0.3rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "98%",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 6,
          fontFamily: "'Nanum Gothic Coding', monospace",
          fontSize: "1.5rem",
        }}
      >
        <a href="../slowlightning/" style={{ color: "inherit", textDecoration: "none" }}>
          05/01/25
        </a>
        <a href="../index.html" style={{ color: "inherit", textDecoration: "none", fontFamily: "'Oxanium', serif", fontSize: "1.8rem" }}>
          Scorpion
        </a>
        <a href="../petal/" style={{ color: "inherit", textDecoration: "none" }}>
          05/03/25
        </a>
      </div>

      {/* Clock Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "90vmin",
            height: "90vmin",
            borderRadius: "50%",
          }}
        >
          {/* Clock face */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            {/* Numbers */}
            {numbers.map(({ num, deg }) => (
              <div
                key={num}
                style={{
                  fontFamily: "'pin_me_needles', serif",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  fontSize: "16.5vmin",
                  color: "#c5c53e",
                  zIndex: 91,
                  textShadow: "#09f745 0.06rem 0.06rem, #080808 -0.06rem 0.06rem",
                  transform: `rotate(${deg}deg)`,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    top: "5%",
                    userSelect: "none",
                  }}
                >
                  {num}
                </div>
              </div>
            ))}

            {/* Hour hand */}
            <div
              ref={hourHandRef}
              style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                transformOrigin: "bottom",
                transition: "transform 0.05s ease-out",
                filter: "saturate(950%)",
                zIndex: 3,
                userSelect: "none",
              }}
            >
              <img
                src={hourHandImg}
                alt="Hour Hand"
                style={{
                  display: "block",
                  maxWidth: "6vmin",
                  height: "auto",
                  userSelect: "none",
                }}
              />
            </div>

            {/* Minute hand */}
            <div
              ref={minuteHandRef}
              style={{
                position: "absolute",
                bottom: "50%",
                left: "88px",
                transformOrigin: "bottom",
                transition: "transform 0.05s ease-out",
                filter: "sepia(300%) saturate(400%)",
                zIndex: 2,
                userSelect: "none",
                transform: "translateX(-60%)", // initial offset
              }}
            >
              <img
                src={minuteHandImg}
                alt="Minute Hand"
                style={{
                  display: "block",
                  maxWidth: "6vmin",
                  height: "auto",
                  userSelect: "none",
                }}
              />
            </div>

            {/* Second hand */}
            <div
              ref={secondHandRef}
              style={{
                position: "absolute",
                bottom: "50%",
                left: "50%",
                transformOrigin: "bottom",
                transition: "transform 0.05s ease-out",
                filter: "saturate(390%) contrast(200%) brightness(170%) sepia(200%)",
                zIndex: 11,
                userSelect: "none",
              }}
            >
              <img
                src={secondHandImg}
                alt="Second Hand"
                style={{
                  display: "block",
                  maxWidth: "6vmin",
                  height: "auto",
                  userSelect: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScorpionClock;
