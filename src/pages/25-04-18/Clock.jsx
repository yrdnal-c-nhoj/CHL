import React, { useEffect, useRef } from "react";
import backgroundImg from "./Antarctica.jpg"; // Make sure this file exists in the same folder

const AntarcticaClock = () => {
  const clockRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const clock = clockRef.current;

    // Create tick marks
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      if (i % 5 === 0) tick.classList.add("major");
      tick.style.transform = `rotate(${i * 6}deg)`;
      clock.appendChild(tick);
    }

    // Append hands
    clock.appendChild(hourRef.current);
    clock.appendChild(minuteRef.current);
    clock.appendChild(secondRef.current);

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();

      const hourAngle = hours * 30 + minutes / 2;
      const minuteAngle = minutes * 6 + seconds / 10;
      const baseSecondAngle = seconds * 6;
      const progress = ms / 1000;
      const secondAngle = baseSecondAngle + (progress < 0.3 ? progress * 12 : 0);

      hourRef.current.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
      minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
      secondRef.current.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <>
      <style>
        {`
          .tick {
            position: absolute;
            width: 0.1vw;
            height: 37.5vh;
            background-color: #b6eef6;
            top: 1.2vh;
            left: 50%;
            transform-origin: 50% 14.5vh;
          }

          .tick.major {
            height: 58vh;
            width: 0.1vw;
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom;
            background-color: #b3edf2;
          }

          .hour-hand {
            width: 3.7vw;
            height: 17vh;
          }

          .minute-hand {
            width: 2vw;
            height: 33vh;
          }

          .second-hand {
            width: 0.3vw;
            height: 100vh;
            background-color: rgb(72, 219, 242);
          }

          .center {
            position: absolute;
            width: 1.5vh;
            height: 1.5vh;
            background-color: #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          @keyframes slow-rotate {
            0% {
              transform: rotate(0deg) scale(1.5);
            }
            100% {
              transform: rotate(-360deg) scale(1.5);
            }
          }

          .bgimage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(0.4);
            z-index: -1;
            animation: slow-rotate 440s linear infinite;
            transform-origin: center center;
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          margin: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img src={backgroundImg} alt="Antarctica" className="bgimage" />
        <div
          ref={clockRef}
          className="clock"
          style={{
            position: "relative",
            width: "50vh",
            height: "30vh",
            borderRadius: "50%",
          }}
        >
          <div className="center" />
          <div ref={hourRef} className="hand hour-hand" />
          <div ref={minuteRef} className="hand minute-hand" />
          <div ref={secondRef} className="hand second-hand" />
        </div>
      </div>
    </>
  );
};

export default AntarcticaClock;
