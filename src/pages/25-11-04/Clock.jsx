import React, { useEffect, useRef, useState } from "react";
import bgVideo from "./sea.mp4";
import fallbackImg from "./sea.webp";
import customFont from "./naut.ttf"; // Replace with your font file

export default function OceanStorm() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoStyle, setVideoStyle] = useState({});

  // Adjust video scaling
  const adjustVideoPosition = () => {
    const video = videoRef.current;
    if (!video) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const videoAspect = video.videoWidth / video.videoHeight;
    const viewportAspect = vw / vh;

    const baseStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      objectFit: "cover",
      zIndex: 0,
      filter: "hue-rotate(30deg) saturate(1.5) brightness(1.2) contrast(1.1)",
    };

    if (viewportAspect < videoAspect) {
      setVideoStyle({ ...baseStyle, height: "100vh", width: "auto" });
    } else {
      setVideoStyle({ ...baseStyle, width: "100vw", height: "auto" });
    }
  };

  const handleVideoLoaded = () => adjustVideoPosition();
  const handleVideoError = () => setVideoFailed(true);

  useEffect(() => {
    window.addEventListener("resize", adjustVideoPosition);
    return () => window.removeEventListener("resize", adjustVideoPosition);
  }, []);

  // Clock face component
  const ClockFace = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;

    const handStyle = (width, height, angle, color) => ({
      position: "absolute",
      width,
      height,
      backgroundColor: color,
      top: "50%",
      left: "50%",
      transformOrigin: "bottom center",
      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
      borderRadius: "2vh",
    });

    // Only show 12, 3, 6, and 9
    const visibleNumbers = [12, 3, 6, 9];
    const numbers = [];
    const clockRadius = 24;

    for (let n of visibleNumbers) {
      const angle = ((n - 3) * 30 * Math.PI) / 180;
      const x = 30 + clockRadius * Math.cos(angle);
      const y = 30 + clockRadius * Math.sin(angle);

      numbers.push(
        <div
          key={n}
          style={{
            position: "absolute",
            left: `${x}vh`,
            top: `${y}vh`,
            transform: "translate(-50%, -50%)",
            fontFamily: "CustomFont, sans-serif",
            fontSize: "19vh",
            color: "#E4D5D5FF",
          }}
        >
          {n}
        </div>
      );
    }

    return (
      <div
        style={{
          position: "absolute",
          width: "60vh",
          height: "60vh",
          borderRadius: "50%",
          border: "0.6vh solid white",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      >
        {numbers}
        <div style={handStyle("1.2vh", "18vh", hourAngle, "white")}></div>
        <div style={handStyle("0.9vh", "24vh", minuteAngle, "white")}></div>
        <div style={handStyle("0.4vh", "28vh", secondAngle, "red")}></div>
      </div>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      <style>
        {`
          @font-face {
            font-family: "CustomFont";
            src: url(${customFont}) format("truetype");
          }
        `}
      </style>

      {!videoFailed ? (
        <video
          ref={videoRef}
          src={bgVideo}
          muted
          autoPlay
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={videoStyle}
        />
      ) : (
        <img
          src={fallbackImg}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "100vh",
            width: "auto",
            objectFit: "cover",
            zIndex: 0,
            filter: "hue-rotate(30deg) saturate(1.5) brightness(1.2) contrast(1.1)",
          }}
        />
      )}

      <ClockFace />
    </div>
  );
}
