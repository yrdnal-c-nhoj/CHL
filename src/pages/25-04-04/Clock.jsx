import React, { useEffect, useRef } from "react";
import beat4 from "./images/beat4.webp";
import tumblrImg from "./images/tumblr_eb7034da88f87c02b8539374dca9c92e_746715e1_500.webp";

const HeartbeatClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secDeg = seconds * 6;
      const minDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = (hours % 12) * 30 + minutes * 0.5;

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const bodyStyle = {
    margin: 0,
    overflow: "hidden",
    position: "relative",
    height: "100dvh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${beat4})`,
    filter: "saturate(300%)",
    backgroundRepeat: "repeat",
    backgroundSize: "6%",
    zIndex: 0,
  };

  const clockStyle = {
    position: "relative",
    width: "50vh",
    height: "50vh",
    backgroundImage: `url(${tumblrImg})`,
    filter: "hue-rotate(200deg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "2px solid #eb0808",
    borderRadius: "50%",
    boxShadow: "0 0 400px #8e4dff",
    animation: "heartbeat 1s infinite",
    transformOrigin: "center",
    zIndex: 10,
  };

  const handBaseStyle = {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    transform: "rotate(0deg)",
  };

  const hourStyle = {
    ...handBaseStyle,
    width: "7px",
    height: "70px",
    background: "transparent",
    borderRadius: "10px",
    boxShadow: "0 0 3px #F80D3CFF",
    zIndex: 3,
  };

  const minuteStyle = {
    ...handBaseStyle,
    width: "6px",
    height: "140px",
    background: "transparent",
    borderRadius: "6px",
      boxShadow: "0 0 3px #F80D3CFF",
    zIndex: 2,
  };

  const secondStyle = {
    ...handBaseStyle,
    width: "4px",
    height: "150px",
    background: "#588944FF",
    borderRadius: "4px",
    zIndex: 1,
  };

  const centerDotStyle = {
    width: "30px",
    height: "30px",
    background: "#ff333f",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
    boxShadow: "0 0 5px #fff",
  };

  return (
    <>
      <style>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.2);
          }
          40% {
            transform: scale(0.95);
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(1.03);
          }
        }
      `}</style>
      <div style={bodyStyle}>
        <div style={backgroundStyle} />
        <div style={clockStyle}>
          <div ref={hourRef} style={hourStyle} />
          <div ref={minuteRef} style={minuteStyle} />
          <div ref={secondRef} style={secondStyle} />
          <div style={centerDotStyle} />
        </div>
      </div>
    </>
  );
};

export default HeartbeatClock;
