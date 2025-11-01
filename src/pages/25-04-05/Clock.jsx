import React, { useEffect } from "react";
import hourHand from "./images/gr4.gif";
import minuteHand from "./images/gr9.png";
import secondHand from "./images/gr5.gif";
import overlayImg from "./images/gfccc.gif";

const TallClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours();

      const secondDeg = (second / 60) * 360;
      const minuteDeg = ((minute + second / 60) / 60) * 360;
      const hourDeg = ((hour % 12 + minute / 60) / 12) * 360;

      const secondHandEl = document.querySelector(".second-hand");
      const minuteHandEl = document.querySelector(".minute-hand");
      const hourHandEl = document.querySelector(".hour-hand");

      if (secondHandEl) secondHandEl.style.transform = `rotate(${secondDeg}deg)`;
      if (minuteHandEl) minuteHandEl.style.transform = `rotate(${minuteDeg}deg)`;
      if (hourHandEl) hourHandEl.style.transform = `rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.clock} className="clock">
        <div className="hand hour-hand" style={styles.hand}>
          <img src={hourHand} alt="Hour Hand" style={styles.handImg} />
        </div>
        <div className="hand minute-hand" style={styles.hand}>
          <img src={minuteHand} alt="Minute Hand" style={styles.handImg} />
        </div>
        <div className="hand second-hand" style={styles.hand}>
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
    height: "100dvh", // Chrome-safe dynamic viewport
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    touchAction: "none",
  },
  clock: {
    position: "relative",
    width: "min(60vw, 40vh)", // keep it responsive
    height: "min(60vw, 40vh)",
    maxWidth: "90vmin",
    maxHeight: "90vmin",
  },
  hand: {
    position: "absolute",
    top: "5%",
    left: "50%",
    transformOrigin: "50% 90%",
    width: "100%",
    height: "100%",
    translate: "-50% 0",
    zIndex: 9,
    pointerEvents: "none",
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
    backgroundAttachment: "fixed", // prevents weird parallax on scroll
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
