import React, { useEffect, useState } from "react";
import videoFile from "./esp.mp4";
import videoWebM from "./esp.mp4";
import fallbackImg from "./birds.webp";

// Import your font from the same folder
import fontUrl_20251128 from "./bird.ttf"; // <-- today's date in variable name

function DigitalTime() {
  const [timeText, setTimeText] = useState("");
  const [letters, setLetters] = useState([]);

  const ANIMATION_DURATION = 10000;
  const STAGGER_DELAY = 150;

  const updateTime = () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - ANIMATION_DURATION);
    const hours24 = pastDate.getHours();
    const minutes = pastDate.getMinutes();
    const seconds = pastDate.getSeconds();

    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;

    // Format time without AM/PM
    const formattedTime = `${String(hour12).padStart(2, "0")}${String(minutes).padStart(2, "0")}${String(seconds).padStart(2, "0")}`;

    setTimeText(formattedTime);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, ANIMATION_DURATION);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timeText) return;

    const chars = timeText.split("");
    const charCount = chars.length;
    const TOTAL_FLY_IN_TIME = charCount * STAGGER_DELAY;
    const SIT_DURATION = ANIMATION_DURATION - TOTAL_FLY_IN_TIME - charCount * STAGGER_DELAY;

    const lettersArr = chars.map((char) => ({
      char,
      style: {
        display: "inline-block",
        opacity: 0,
        transform: "translate(120vw, -25vh)",
        transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
      },
    }));
    setLetters(lettersArr);

    lettersArr.forEach((_, i) => {
      setTimeout(() => {
        setLetters((prev) => {
          const newArr = [...prev];
          newArr[i].style = {
            ...newArr[i].style,
            opacity: 1,
            transform: "translate(0, 0)",
          };
          return newArr;
        });
      }, i * STAGGER_DELAY);
    });

    const flyOutDelay = TOTAL_FLY_IN_TIME + SIT_DURATION;
    lettersArr.forEach((_, i) => {
      setTimeout(() => {
        setLetters((prev) => {
          const newArr = [...prev];
          newArr[i].style = {
            ...newArr[i].style,
            opacity: 0,
            transform: "translate(-120vw, -25vh)",
          };
          return newArr;
        });
      }, flyOutDelay + i * STAGGER_DELAY);
    });
  }, [timeText]);

  const containerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    color: "#8D6222FF",
    fontSize: "10vh",
    textAlign: "center",
    letterSpacing: "0.05em",
    textShadow: "1px 0 0 white", // 1px left-side black shadow
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "visible",
    fontFamily: `"CustomFont_20251128", sans-serif`,
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
        `}
      </style>
      <div style={containerStyle} aria-live="polite">
        {letters.map((l, idx) => (
          <span key={idx} style={l.style}>
            {l.char}
          </span>
        ))}
      </div>
    </>
  );
}

export default function BackgroundVideo() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = React.useRef(null);

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

  return (
    <div style={containerStyle} role="region" aria-label="Background video and time">
      <DigitalTime />
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
  );
}
