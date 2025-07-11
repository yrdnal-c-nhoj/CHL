import React, { useEffect, useRef } from "react";
import sys1 from "./images/sys1.gif";
import sys2 from "./images/sys2.gif";
import sys3 from "./images/sys3.gif";

const SolarSystemClock = ({ backgroundColor = "#0C0D53FF" }) => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const secAngle = seconds * 6;
      const minAngle = minutes * 6 + seconds * 0.1;
      const hourAngle = hours * 30 + minutes * 0.5;

      if (clockRef.current && hourRef.current && minuteRef.current && secondRef.current) {
        setBallPosition(secondRef.current, secAngle, 20);
        setBallPosition(minuteRef.current, minAngle, 15);
        setBallPosition(hourRef.current, hourAngle, 10);
      } else {
        console.warn("Refs not ready:", {
          clockRef: clockRef.current,
          hourRef: hourRef.current,
          minuteRef: minuteRef.current,
          secondRef: secondRef.current,
        });
      }
    };

    const setBallPosition = (ball, angle, radiusVh) => {
      if (!ball || !clockRef.current) return;

      const rad = (angle - 90) * (Math.PI / 180);
      const clockRect = clockRef.current.getBoundingClientRect();
      const centerX = clockRect.width / 2;
      const centerY = clockRect.height / 2;
      const radiusPx = (radiusVh / 100) * window.innerHeight;
      const x = centerX + radiusPx * Math.cos(rad);
      const y = centerY + radiusPx * Math.sin(rad);

      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="solar-system-clock-container unique-solar-clock"
      style={{
        all: "unset",
        display: "block",
        width: "100%",
        height: "100%",
        isolation: "isolate",
        boxSizing: "border-box",
        backgroundColor, // <-- Apply controlled background color here
        position: "relative",
      }}
    >
      <div style={styles.body}>
        <img src={sys1} alt="Layer 1" style={styles.image1} />
        <img src={sys2} alt="Layer 2" style={styles.image2} />
        <img src={sys3} alt="Layer 3" style={styles.image3} />
        <div className="clock unique-solar-clock" style={styles.clock} ref={clockRef}>
          <div
            className="ball hour unique-solar-clock"
            style={{ ...styles.ball, ...styles.hour }}
            ref={hourRef}
          ></div>
          <div
            className="ball minute unique-solar-clock"
            style={{ ...styles.ball, ...styles.minute }}
            ref={minuteRef}
          ></div>
          <div
            className="ball second unique-solar-clock"
            style={{ ...styles.ball, ...styles.second }}
            ref={secondRef}
          ></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    boxSizing: "border-box",
  },
  image1: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "122vh",
    objectFit: "cover",
    opacity: 0.2,
    filter: "saturate(99.5) brightness(90%) contrast(150%)",
    pointerEvents: "none",
    zIndex: 4,
    boxSizing: "border-box",
  },
  image2: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "105vh",
    objectFit: "cover",
    opacity: 0.8,
    filter: "saturate(2.5) brightness(100%) contrast(100%)",
    pointerEvents: "none",
    zIndex: 3,
    boxSizing: "border-box",
  },
  image3: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "100vh",
    objectFit: "cover",
    opacity: 0.8,
    pointerEvents: "none",
    zIndex: 2,
    boxSizing: "border-box",
  },
  clock: {
    position: "absolute",
    width: "60vh",
    height: "60vh",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
    boxSizing: "border-box",
  },
  ball: {
    position: "absolute",
    width: "9vh",
    height: "9vh",
    opacity: 1,
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9,
    border: "1px solid black",
    boxSizing: "border-box",
  },
  hour: {
    background: "rgb(55, 68, 239)",
  },
  minute: {
    background: "#3f3",
  },
  second: {
    background: "rgb(250, 7, 3)",
  },
};

export default SolarSystemClock;
