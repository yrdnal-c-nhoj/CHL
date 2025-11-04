import React, { useEffect, useRef } from "react";
import bgVideo from "./sea.mp4";
import fallbackImg from "./sea.webp";
import customFont from "./naut.ttf"; // Nautical font

export default function OceanStorm() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        video.style.display = "none";
      });
    }

    // Load custom font
    const font = new FontFace("Nautical", `url(${customFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  const clockSize = "60vmin";

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#001f33",
      }}
    >
      {/* Background video with contrast & brightness filter */}
      <video
        ref={videoRef}
        src={bgVideo}
        poster={fallbackImg}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "brightness(1.5) contrast(1.4) hue-rotate(-10deg)",
        }}
      />

      {/* Fallback image for cases where video fails */}
      <img
        src={fallbackImg}
        alt="Sea Fallback"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "brightness(1.4) contrast(1.4)",
          display: "none", // only shown if video fails
        }}
        onError={(e) => (e.target.style.display = "none")}
      />

      {/* Rocking clock container (not affected by filters) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: clockSize,
          height: clockSize,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "rock 8s ease-in-out infinite",
          transformOrigin: "center center",
          zIndex: 2,
          opacity: 0.6,
        }}
      >
        <ClockFace />
      </div>

      <style>{`
        @keyframes rock {
          0% { transform: translate(-50%, -50%) rotate(-19deg); }
          50% { transform: translate(-50%, -50%) rotate(19deg); }
          100% { transform: translate(-50%, -50%) rotate(-19deg); }
        }

        /* Brass gradient text effect */
        .brass-text {
          background: linear-gradient(135deg, #b58e33 0%, #d4af37 40%, #996515 70%, #b58e33 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

function ClockFace() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const secDeg = seconds * 6;
      const minDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = hours * 30 + minutes * 0.5;

      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${minDeg}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `rotate(${secDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const brassHand = (width, height, shadow) => ({
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    width,
    height,
    background: "linear-gradient(180deg, #e0c060 0%, #b8860b 60%, #5a3e0a 100%)",
    borderRadius: "1rem",
    boxShadow: shadow,
  });

  const mainNumbers = [
    { num: 12, angle: 0 },
    { num: 3, angle: 90 },
    { num: 6, angle: 180 },
    { num: 9, angle: 270 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "90%",
        height: "90%",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Nautical, sans-serif",
        color: "white",
      }}
    >
      {/* Brass Numbers */}
      {mainNumbers.map(({ num, angle }) => {
        const x = 40 * Math.sin((angle * Math.PI) / 180);
        const y = -40 * Math.cos((angle * Math.PI) / 180);
        return (
          <div
            key={num}
            className="brass-text"
            style={{
              position: "absolute",
              left: `calc(50% + ${x}%)`,
              top: `calc(50% + ${y}%)`,
              transform: "translate(-50%, -50%)",
              fontSize: "14vh",
            }}
          >
            {num}
          </div>
        );
      })}

      {/* Brass Hands */}
      <div
        ref={hourRef}
        style={brassHand("0.8rem", "28%", "inset 0 0 0.5rem #2a1b00, 0 0 1rem rgba(255,200,100,0.5)")}
      ></div>
      <div
        ref={minuteRef}
        style={brassHand("0.5rem", "40%", "inset 0 0 0.3rem #3a2b00, 0 0 1rem rgba(255,200,80,0.4)")}
      ></div>
      <div
        ref={secondRef}
        style={brassHand("0.25rem", "45%", "inset 0 0 0.2rem #4a3400, 0 0 1rem rgba(255,200,80,0.4)")}
      ></div>

      {/* Brass Center Rivet */}
      <div
        style={{
          position: "absolute",
          width: "2vh",
          height: "2vh",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #f1c15c, #b8860b 70%, #4d3a05 100%)",
          boxShadow: "0 0 1rem rgba(255,220,120,0.6)",
        }}
      ></div>
    </div>
  );
}
