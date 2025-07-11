import React, { useEffect } from "react";
import hourHand from "./images/gr4.webp";
import minuteHand from "./images/gr9.png";
import secondHand from "./images/gr5.png";
import overlayImg from "./images/gfccc.png";

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

      document.querySelector(".second-hand").style.transform = `rotate(${secondDeg}deg)`;
      document.querySelector(".minute-hand").style.transform = `rotate(${minuteDeg}deg)`;
      document.querySelector(".hour-hand").style.transform = `rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
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
  body: {
    background: "#805c0d",
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  clock: {
    position: "relative",
    width: "80vw",
    height: "60vh",
  },
  hand: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "88%",
    transformOrigin: "50% 90%",
    pointerEvents: "none",
    zIndex: 9,
  },
  handImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${overlayImg})`,
    backgroundRepeat: "repeat",
    zIndex: 2,
    top: 0,
    left: 0,
  },
  overlay1: {
    backgroundSize: "15vh 15vw",
    zIndex: 3,
  },
  overlay2: {
    backgroundSize: "10vh 10vw",
    zIndex: 2,
  },
  overlay3: {
    backgroundSize: "auto",
    zIndex: 1,
  },
};

export default TallClock;
