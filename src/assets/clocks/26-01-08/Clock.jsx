import React, { useEffect, useState, useRef } from "react";
import videoFile from "../../assets/clocks/26-01-08/coaster.mp4";
import videoWebM from "../../assets/clocks/26-01-08/coaster.mp4";
import fallbackImg from "../../assets/clocks/26-01-08/coaster.webp";
const fontUrl_20251128 = '../../assets/fonts/25-12-28-coaster.ttf';

export default function Clock() {
  const [timeText, setTimeText] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  const updateTime = () => {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;

    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hour12}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;
    setTimeText(formattedTime);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = () => setVideoFailed(true);
    const onCanPlay = () => setVideoFailed(false);

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    v.addEventListener("canplay", onCanPlay);

    v.play?.().catch(onError);

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  };

  const fallbackStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: videoFailed ? "block" : "none",
    zIndex: 5,
  };

  const timeContainerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    color: "#ABA193",
    fontSize: "10vh",
    textAlign: "center",
    letterSpacing: "0.05em",
    textShadow: "1px 0 0 white",
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "visible",
    fontFamily: `"CustomFont_20251128", sans-serif`,
    opacity: 0.7,
  };

  const digitStyle = {
    display: "inline-block",
    animation: "jossel 1.5s infinite ease-in-out",
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: "CustomFont_20251128";
            src: url(${fontUrl_20251128}) format("woff2");
            font-weight: normal;
            font-style: normal;
          }
          
          @keyframes jossel {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            25% {
              transform: translateY(-30px) rotate(5deg);
            }
            50% {
              transform: translateY(20px) rotate(-5deg);
            }
            75% {
              transform: translateY(-10px) rotate(3deg);
            }
          }
        `}
      </style>
      <div style={containerStyle} role="region" aria-label="Background video and time">
        <div style={timeContainerStyle} aria-live="polite">
          {timeText.split('').map((char, index) => (
            <span key={index} style={{
              ...digitStyle,
              animationDelay: `${index * 0.1}s`
            }}>
              {char}
            </span>
          ))}
        </div>
        <video
          ref={videoRef}
          style={videoStyle}
          loop
          muted
          playsInline
          autoPlay
          preload="metadata"
        >
          <source src={videoFile} type="video/mp4" />
          <source src={videoWebM} type="video/webm" />
        </video>
        <div style={fallbackStyle} aria-hidden={!videoFailed}>
          {videoFailed && <span style={{ display: "none" }}>Fallback background image</span>}
        </div>
      </div>
    </>
  );
}
