import React, { useEffect, useRef } from "react";
import hourImg from "./59bf80e17a216d0b052f12e3.png";
import minuteImg from "./59bf80e17a216d0b052f12e3.png";
import secondImg from "./59bf80e17a216d0b052f12e3.png";
import bgImg from "./bad.png";
import oswaldFont from "./Oswald.ttf";

const BandAidClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const clockRef = useRef(null);

  // Add numbers dynamically
  const createClockNumbers = () => {
    const clock = clockRef.current;
    const clockWidth = clock.offsetWidth;
    const radius = clockWidth * 0.45;
    const numberSize = clockWidth * 0.1;

    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x = radius * Math.sin(angle);
      const y = -radius * Math.cos(angle);

      const number = document.createElement("div");
      number.className = "number";
      number.style.left = `calc(50% + ${x}px - ${numberSize / 2}px)`;
      number.style.top = `calc(50% + ${y}px - ${numberSize / 2}px)`;
      number.textContent = i;
      clock.appendChild(number);
    }
  };

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = hours * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  };

  useEffect(() => {
    createClockNumbers();
    updateClock();
    const interval = setInterval(updateClock, 1000);

    const handleResize = () => {
      const clock = clockRef.current;
      clock.querySelectorAll(".number").forEach((el) => el.remove());
      createClockNumbers();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={styles.body}>
      <style>{`
        @font-face {
          font-family: 'Oswald';
          src: url(${oswaldFont}) format('woff2');
          font-weight: normal;
          font-style: normal;
        }

        .number {
          position: absolute;
          font-family: 'Oswald', sans-serif;
          font-size: 13vw;
          color: rgb(240, 7, 7);
          font-weight: bold;
          text-align: center;
          line-height: 3vw;
          z-index: 5;
        }
      `}</style>

      <div style={styles.clockWrapper}>
        <div ref={clockRef} style={styles.clock}>
          <img src={hourImg} ref={hourRef} style={{ ...styles.hand, ...styles.hour }} alt="Hour" />
          <img src={minuteImg} ref={minuteRef} style={{ ...styles.hand, ...styles.minute }} alt="Minute" />
          <img src={secondImg} ref={secondRef} style={{ ...styles.hand, ...styles.second }} alt="Second" />
        </div>
      </div>

      <img src={bgImg} alt="Background" style={styles.bgImage} />
    </div>
  );
};

const styles = {
  body: {
    backgroundColor: "#deab34",
    height: "100vh",
    margin: 0,
    overflow: "hidden",
    position: "relative",
    fontSize: "1rem",
  },
  clockWrapper: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 7,
  },
  clock: {
    width: "70vw",
    height: "70vw",
    maxWidth: "50vh",
    maxHeight: "50vh",
    borderRadius: "50%",
    position: "relative",
    zIndex: 8,
  },
  hand: {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    zIndex: 8,
    opacity: 0.9,
  },
  hour: {
    width: "40vw",
    height: "54vw",
    transform: "translateX(-50%)",
  },
  minute: {
    width: "12vw",
    height: "75vw",
    transform: "translateX(-50%)",
    filter: "brightness(0.9) contrast(1.2)",
  },
  second: {
    width: "7.5vw",
    height: "80vw",
    transform: "translateX(-50%)",
    filter: "brightness(1.1) contrast(0.9)",
  },
  bgImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 4,
  },
};

export default BandAidClock;
