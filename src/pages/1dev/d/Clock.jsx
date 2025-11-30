import React, { useEffect, useState } from "react";

export default function Sundial() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Get hour as angle for shadow (12 hours = 360deg)
  const hours = time.getHours() + time.getMinutes() / 60;
  const shadowAngle = (hours / 12) * 360; // degrees

  // Inline styles
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to top, #fceabb, #f8b500)", // sunlit sky
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const dialStyle = {
    position: "relative",
    width: "50vh",
    height: "50vh",
    borderRadius: "50%",
    background: "#e0dcd0",
    boxShadow: "inset 0 0 2vh rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const gnomonStyle = {
    position: "absolute",
    width: "2vh",
    height: "20vh",
    background: "#333",
    transformOrigin: "bottom center",
    bottom: "50%",
    borderRadius: "0.5vh",
    zIndex: 2,
  };

  const shadowStyle = {
    position: "absolute",
    width: "0.5vh",
    height: "25vh",
    background: "rgba(0,0,0,0.3)",
    bottom: "50%",
    transformOrigin: "bottom center",
    transform: `rotate(${shadowAngle}deg) translateY(-2.5vh)`,
    borderRadius: "0.25vh",
    zIndex: 1,
  };

  // Hour markers
  const markers = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 360;
    const markerStyle = {
      position: "absolute",
      width: "0.5vh",
      height: "2vh",
      background: "#555",
      top: "2%",
      left: "50%",
      transformOrigin: "bottom center",
      transform: `rotate(${angle}deg) translateY(-23vh)`,
      borderRadius: "0.2vh",
    };
    markers.push(<div key={i} style={markerStyle}></div>);
  }

  return (
    <div style={containerStyle}>
      <div style={dialStyle}>
        {markers}
        <div style={shadowStyle}></div>
        <div style={gnomonStyle}></div>
      </div>
    </div>
  );
}
