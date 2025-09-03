import React, { useEffect, useState, useRef } from "react";
import lightningImg from "./images/lightning.webp"; // adjust path as needed
import innerFontTTF from "./fonts/Inner.ttf"; // You'll need to load this font locally or via CSS

export default function SlowLightningClock() {
  const [time, setTime] = useState({ hours: "--", minutes: "--" });
  const clockRef = useRef(null);
  const flashWhiteRef = useRef(null);
  const flashBlackRef = useRef(null);

  // Update clock time every second
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
      });
    }
    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Clock shaking animation
  function triggerClockEffect() {
    if (!clockRef.current) return;
    clockRef.current.classList.add("animate-clock");
    setTimeout(() => {
      clockRef.current && clockRef.current.classList.remove("animate-clock");
    }, 330);
  }

  // Flash effect for white or black flash
  function triggerFlash(type) {
    const el = type === "white" ? flashWhiteRef.current : flashBlackRef.current;
    if (!el) return;
    el.style.opacity = "1";
    setTimeout(() => {
      if (el) el.style.opacity = "0";
    }, 100);
  }

  // Loop random effects
  useEffect(() => {
    let isMounted = true;
    function randomEffectsLoop() {
      if (!isMounted) return;

      const rand = Math.random();

      if (rand < 0.02) {
        triggerClockEffect();
      }

      if (rand > 0.9) {
        triggerFlash(Math.random() > 0.5 ? "white" : "black");
      }

      setTimeout(randomEffectsLoop, 500);
    }
    randomEffectsLoop();
    return () => {
      isMounted = false;
    };
  }, []);

  // Inline styles (converted from your CSS)
  const styles = {
    "@font-face": {
      fontFamily: "Inner",
      src: `url(${innerFontTTF}) format('truetype')`,
    },
    body: {
      margin: 0,
      padding: 0,
      height: "100%",
      width: "100%",
      overflow: "hidden",
      backgroundColor: "black",
    },
    bgimage: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "absolute",
      height: "100dvh",
      width: "100vw",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1,
      opacity: 0.9,
      userSelect: "none",
      pointerEvents: "none",
    },
    bgimage1: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "absolute",
      height: "100vh",
      width: "100vw",
      transform: "scaleX(-1)",
      top: "50%",
      left: "50%",
      transformOrigin: "center",
      translate: "-50%, -50%",
      zIndex: 2,
      opacity: 0.9,
      userSelect: "none",
      pointerEvents: "none",
    },
    clockContainer: {
      position: "relative",
      zIndex: 7,
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    clock: {
      color: "rgb(244, 243, 230)",
      fontFamily: "'Inner', sans-serif",
      display: "flex",
      fontSize: "80vh",
      userSelect: "none",
    },
    clockSpan: {
      display: "block",
    },
    flashWhite: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 999,
      pointerEvents: "none",
      backgroundColor: "rgb(236, 241, 218)",
      opacity: 0,
      transition: "opacity 0.1s ease-out",
    },
    flashBlack: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 999,
      pointerEvents: "none",
      backgroundColor: "rgb(7, 5, 19)",
      opacity: 0,
      transition: "opacity 0.1s ease-out",
    },
    // ShakeJump animation keyframes are best handled in CSS
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Inner';
          src: url('${innerFontTTF}') format('truetype');
        }
        @keyframes shakeJump {
          0%, 100% {
            transform: translate(-50%, 190%) translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-50%, -50%) translate(-10px, -20px) rotate(-2deg);
          }
          40% {
            transform: translate(-50%, 50%) translate(10px, 10px) rotate(3deg);
          }
          60% {
            transform: translate(80%, -50%) translate(-15px, 5px) rotate(-1deg);
          }
          80% {
            transform: translate(-50%, -80%) translate(5px, -15px) rotate(2deg);
          }
        }
        .animate-clock {
          animation: shakeJump 0.33s ease-in-out;
        }
        @media (max-width: 600px) {
          #clock {
            flex-direction: column;
            align-items: center;
            gap: 2vh;
            font-size: 50vw !important;
          }
        }
      `}</style>

      {/* Background images */}
      <img src={lightningImg} alt="lightning" style={styles.bgimage} draggable={false} />
      <img src={lightningImg} alt="lightning mirrored" style={{ ...styles.bgimage, transform: "translate(-50%, -50%) scaleX(-1)", zIndex: 2 }} draggable={false} />

      <div style={styles.clockContainer}>
        <div id="clock" ref={clockRef} style={styles.clock}>
          <span style={styles.clockSpan} id="hours">
            {time.hours}
          </span>
          <span style={styles.clockSpan} id="minutes">
            {time.minutes}
          </span>
        </div>
      </div>

      <div ref={flashWhiteRef} style={styles.flashWhite} />
      <div ref={flashBlackRef} style={styles.flashBlack} />
    </>
  );
}
