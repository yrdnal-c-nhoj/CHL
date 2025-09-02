import React, { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(getTime());
  const [previousTime, setPreviousTime] = useState(time);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviousTime(time);
      setTime(getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  function addZero(i) {
    return i < 10 ? "0" + i : "" + i;
  }

  function getTime() {
    const d = new Date();
    let h = d.getHours();
    let ampm;
    if (h > 12) {
      h = h - 12;
      ampm = "pm";
    } else if (h === 12) {
      ampm = "pm";
    } else if (h === 0) {
      h = 12;
      ampm = "am";
    } else {
      ampm = "am";
    }
    h = addZero(h);
    const m = addZero(d.getMinutes());
    const s = addZero(d.getSeconds());
    return {
      hours: h.split(""),
      minutes: m.split(""),
      seconds: s.split(""),
      ampm,
    };
  }

  // Reusable flip logic with better visibility
  function renderFlip(id, current, previous) {
    const shouldAnimate = current !== previous;
    
    const commonStyle = {
      position: "absolute",
      width: "14.667%",
      height: "42.8%",
      overflow: "hidden",
      borderRadius: "10px",
      boxShadow: "inset 0 -8px 12px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.2)",
      backfaceVisibility: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "bold",
      color: "#ffffff",
      fontSize: "4rem",
      backgroundColor: "#2c2c2c",
      border: "2px solid #444",
    };

    return (
      <div style={{ position: "relative", width: "14.667%", height: "42.8%" }}>
        {/* Top Half */}
        <div
          className={shouldAnimate ? "flip-top" : ""}
          style={{
            ...commonStyle,
            top: "0",
            borderRadius: "10px 10px 2px 2px",
            zIndex: shouldAnimate ? 3 : 1,
            transformOrigin: "bottom",
            clipPath: "inset(0 0 50% 0)",
          }}
        >
          <span style={{ margin: 0, transform: "translateY(25%)" }}>{current}</span>
        </div>
        
        {/* Bottom Half */}
        <div
          className={shouldAnimate ? "flip-bottom" : ""}
          style={{
            ...commonStyle,
            bottom: "0",
            borderRadius: "2px 2px 10px 10px",
            zIndex: shouldAnimate ? 2 : 1,
            transformOrigin: "top",
            clipPath: "inset(50% 0 0 0)",
          }}
        >
          <span style={{ margin: 0, transform: "translateY(-25%)" }}>{current}</span>
        </div>
      </div>
    );
  }

  const digitPositions = {
    hoursTens: "3%",
    hoursOnes: "18%",
    minutesTens: "35%",
    minutesOnes: "50%",
    secondsTens: "67.4%",
    secondsOnes: "82.4%",
  };

  return (
    <>
      <style>
        {`
          .flip-top {
            animation: flipTop 0.6s ease-in-out;
          }
          .flip-bottom {
            animation: flipBottom 0.6s ease-in-out;
          }
          
          @keyframes flipTop {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(-90deg); }
            100% { transform: rotateX(-90deg); }
          }
          
          @keyframes flipBottom {
            0% { transform: rotateX(90deg); }
            50% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
          }
        `}
      </style>
      
      <div
        style={{
          perspective: "1000px",
          position: "relative",
          marginTop: "5vh",
          borderRadius: "1rem",
          background: "linear-gradient(145deg, #e6d0b8, #c8a882)",
          height: "30vh",
          width: "90vw",
          minWidth: "600px",
          maxWidth: "900px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)",
          display: "flex",
          justifyContent: "space-between",
          margin: "5vh auto",
        }}
      >
        {/* AM/PM */}
        <div
          style={{
            color: "#2c2c2c",
            position: "absolute",
            top: "2vh",
            left: "3.5vw",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            zIndex: 10,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {time.ampm}
        </div>

        {/* Separators */}
        <div style={{
          position: "absolute",
          left: "31%",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "3rem",
          color: "#2c2c2c",
          fontWeight: "bold",
          zIndex: 5
        }}>:</div>
        <div style={{
          position: "absolute",
          left: "63%",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "3rem",
          color: "#2c2c2c",
          fontWeight: "bold",
          zIndex: 5
        }}>:</div>

        {/* Hours */}
        <div style={{ position: "absolute", left: digitPositions.hoursTens, top: "28%" }}>
          {renderFlip("hoursTens", time.hours[0], previousTime.hours?.[0])}
        </div>
        <div style={{ position: "absolute", left: digitPositions.hoursOnes, top: "28%" }}>
          {renderFlip("hoursOnes", time.hours[1], previousTime.hours?.[1])}
        </div>

        {/* Minutes */}
        <div style={{ position: "absolute", left: digitPositions.minutesTens, top: "28%" }}>
          {renderFlip("minutesTens", time.minutes[0], previousTime.minutes?.[0])}
        </div>
        <div style={{ position: "absolute", left: digitPositions.minutesOnes, top: "28%" }}>
          {renderFlip("minutesOnes", time.minutes[1], previousTime.minutes?.[1])}
        </div>

        {/* Seconds */}
        <div style={{ position: "absolute", left: digitPositions.secondsTens, top: "28%" }}>
          {renderFlip("secondsTens", time.seconds[0], previousTime.seconds?.[0])}
        </div>
        <div style={{ position: "absolute", left: digitPositions.secondsOnes, top: "28%" }}>
          {renderFlip("secondsOnes", time.seconds[1], previousTime.seconds?.[1])}
        </div>
      </div>
    </>
  );
}