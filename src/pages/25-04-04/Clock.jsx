import { useEffect, useRef } from "react";
import hand1 from "./hand1.webp";
import hand2 from "./hand2.webp";
import hand3 from "./hand3.webp";
import inst from "./inst.webp";

const BoringClock = () => {
  const secondRef = useRef(null);
  const minuteRef = useRef(null);
  const hourRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const milliseconds = now.getMilliseconds();
      const seconds = now.getSeconds() + milliseconds / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() + minutes / 60;

      const secondDegrees = ((seconds / 60) * 360) + 90;
      const minuteDegrees = ((minutes / 60) * 360) + 90;
      const hourDegrees = ((hours / 12) * 360) + 90;

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDegrees}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDegrees}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDegrees}deg)`;

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div style={styles.body}>
  
      <img src={inst} alt="border" style={styles.borer2} />

      <div style={styles.clock}>
        <img src={hand2} alt="second hand" ref={secondRef} style={{ ...styles.hand, ...styles.secondHand }} />
        <img src={hand1} alt="hour hand" ref={hourRef} style={{ ...styles.hand, ...styles.hourHand }} />
        <img src={hand3} alt="minute hand" ref={minuteRef} style={{ ...styles.hand, ...styles.minHand }} />
      </div>
    </div>
  );
};

export default BoringClock;

const styles = {
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    width: "100vw",
    backgroundColor: "rgb(154, 110, 53)",
    position: "relative",
    overflow: "hidden",
  },

  borer2: {
    position: "absolute",
    opacity: 0.5,
    filter: "contrast(130%) brightness(200%)",
    width: "180vw",
    height: "140vh",
    zIndex: 1,
    pointerEvents: "none",
  },
  clock: {
    width: "80vw",
    height: "80vh",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  hand: {
    position: "absolute",
    top: "40%",
    right: "50%",
    transformOrigin: "100%",
    transform: "rotate(90deg)",
    zIndex: 9,
    opacity: 0.5,
    transition: "transform 0s linear",
  },
  hourHand: {
    zIndex: 8,
    width: "6rem",
    height: "5rem",
    filter: "contrast(170%) brightness(200%)",
  },
  minHand: {
    zIndex: 6,
    width: "10rem",
    height: "4rem",
    filter: "contrast(170%) brightness(200%)",
    transform: "scaleX(-1)",
  },
  secondHand: {
    zIndex: 7,
    width: "14rem",
    height: "5rem",
    filter: "contrast(170%) brightness(200%)",
  },
};
