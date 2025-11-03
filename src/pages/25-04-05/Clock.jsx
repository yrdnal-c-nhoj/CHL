import React, { useEffect, useState } from "react";
import hourHand from "./images/gr4.gif";
import minuteHand from "./images/gr9.png";
import secondHand from "./images/gr5.gif";
import overlayImg from "./images/gfccc.gif";

const TallClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondDeg = (time.getSeconds() / 60) * 360;
  const minuteDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  const handStyle = (deg) => ({
    position: "absolute",
    top: 0,
    left: "50%",
    width: "100%",
    height: "100%",
    transformOrigin: "50% 100%", // bottom center
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: 9,
    pointerEvents: "none",
  });

  return (
    <div style={styles.container}>
      <div style={styles.clock}>
        <div className="hand hour-hand" style={handStyle(hourDeg)}>
          <img src={hourHand} alt="Hour Hand" style={styles.handImg} />
        </div>
        <div className="hand minute-hand" style={handStyle(minuteDeg)}>
          <img src={minuteHand} alt="Minute Hand" style={styles.handImg} />
        </div>
        <div className="hand second-hand" style={handStyle(secondDeg)}>
          <img src={secondHand} alt="Second Hand" style={styles.handImg} />
        </div>
      </div>

      <div style={{ ...styles.overlay, ...styles.overlay1 }} />
      <div style={{ ...styles.overlay, ...styles.overlay2 }} />
      <div style={{ ...styles.overlay, ...styles.overlay3 }} />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#805c0d",
    margin: 0,
    padding: 0,
    width: "100vw",
    height: "100svh", // mobile-safe viewport height
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    touchAction: "none",
  },
  clock: {
    position: "relative",
    width: "min(60vw, 40vh)",
    height: "min(60vw, 40vh)",
    maxWidth: "90vmin",
    maxHeight: "90vmin",
  },
  handImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${overlayImg})`,
    backgroundRepeat: "repeat",
    zIndex: 1,
    pointerEvents: "none",
  },
  overlay1: {
    backgroundSize: "12vmin 12vmin",
    opacity: 0.8,
    zIndex: 3,
  },
  overlay2: {
    backgroundSize: "20vmin 20vmin",
    opacity: 0.5,
    zIndex: 2,
  },
  overlay3: {
    backgroundSize: "auto",
    opacity: 0.3,
    zIndex: 1,
  },
};

export default TallClock;
