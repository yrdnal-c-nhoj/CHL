import React, { useEffect, useState } from "react";
import cylFont from "./cyl.ttf";

const FiligreeClock = () => {
  const [digits, setDigits] = useState(Array(16).fill("0"));

  // Load font dynamically
  useEffect(() => {
    const font = new FontFace("cyl", `url(${cylFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  // Update time digits every second
  useEffect(() => {
    const updateDigits = () => {
      const now = new Date();
      // Format HH:MM:SS as 6 digits, repeat to fill 16 digits for all faces
      const timeStr = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "");
      // Repeat time digits to fill 16 places (for each "face" digit set)
      const fullDigits = timeStr.repeat(Math.ceil(16 / timeStr.length)).slice(0, 16).split("");
      setDigits(fullDigits);
    };

    updateDigits();
    const interval = setInterval(updateDigits, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inline styles
  const styles = {
    root: {
      fontFamily: "'cyl', sans-serif",
      background:
        "radial-gradient(circle, rgba(163, 91, 111, 1) 0%, rgba(145, 81, 144, 1) 100%)",
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      perspective: "300vw",
      width: "100vw",
      height: "100vh",
    },
    box: {
      transformStyle: "preserve-3d",
      animation: "rotate 123s linear infinite",
      position: "relative",
      width: "100vw",
      height: "100vh",
    },
    face: (i) => ({
      position: "absolute",
      left: "50%",
      top: "50%",
      display: "flex",
      gap: "1rem",
      transformStyle: "preserve-3d",
      transform: `translate(-50%, -50%) rotateX(calc(${i + 1} * 22.5deg)) translateZ(15vw)`,
    }),
    digit: {
      color: "#D0C7C7FF",
      textShadow: "#14170EFF 0.2rem 0.2rem 0, #2C2D29FF -0.2rem -0.2rem 0",
      position: "relative",
      transformStyle: "preserve-3d",
      width: "0.3rem",
      height: "1rem",
      fontSize: "4.8rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    faceFront: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "4.8rem",
    },
    faceBack: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      color: "#080D01FF",
      textShadow: "#EBE7E7FF 0.3rem 0.3rem 0, #F0EEEEFF -0.3rem -0.3rem 0",
      backgroundColor: "rgba(27, 5, 117, 0.2)",
      transform: "rotateY(180deg)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "4.8rem",
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <div id="clockBox" style={styles.box}>
          {[...Array(16)].map((_, i) => (
            <div key={i} className="face" style={styles.face(i)}>
              {[...Array(6)].map((__, j) => (
                <div key={j} className="digit" style={styles.digit}>
                  <div className="face-front" style={styles.faceFront}>
                    {digits[j] || "0"}
                  </div>
                  <div className="face-back" style={styles.faceBack}>
                    {digits[j] || "0"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FiligreeClock;
