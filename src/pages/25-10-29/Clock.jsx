import React, { useRef, useEffect, useState } from "react";
import videoFile from "./esp.mp4";
import videoWebM from "./esp.mp4"; // Add WebM for compatibility
import fallbackImg from "./words.jpg";

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = (e) => {
      console.error("Video error:", e);
      setVideoFailed(true);
    };

    const onCanPlay = () => setVideoFailed(false); // Reset if playable

    v.addEventListener("error", onError);
    v.addEventListener("stalled", onError);
    v.addEventListener("canplay", onCanPlay);

    const playPromise = v.play?.();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(onError);
    }

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onError);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    minHeight: "100vh",
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
  };

  return (
    <div style={containerStyle} role="region" aria-label="Background video">
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
        {videoFailed && (
          <span style={{ display: "none" }}>Fallback background image</span>
        )}
      </div>
    </div>
  );
}