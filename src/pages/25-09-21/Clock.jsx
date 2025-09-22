import React, { useEffect, useState } from "react";
import stripe2 from "./air.gif";
import stripe1 from "./fire.gif";
import stripe3 from "./h2o.gif";
import stripe4 from "./earth.webp";
import customFont from "./gre.ttf";

export default function AnalogClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontVar] = useState(`font${new Date().getTime()}`);

  useEffect(() => {
    // Inject font + shimmer animation
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: '${fontVar}';
        src: url(${customFont}) format('truetype');
        font-display: swap;
      }

      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @-webkit-keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
    `;
    document.head.appendChild(styleEl);

    const font = new FontFace(fontVar, `url(${customFont})`);
    font.load().then(() => {
      document.fonts.add(font);

      const images = [stripe1, stripe2, stripe3, stripe4];
      let loadedCount = 0;
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) setReady(true);
        };
      });
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{ width: "100vw", height: "100vh", backgroundColor: "#F2E8E8FF" }}
      />
    );
  }

  const size = "70vmin";
  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourDeg = (hour + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  const stripes = [stripe1, stripe2, stripe3, stripe4];

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh", // use vh instead of dvh for iOS compatibility
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#EFE9E9FF",
      }}
    >
      {stripes.map((src, idx) => {
        let mask = "";
        if (idx === 0)
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";
        else if (idx === 3)
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)";
        else
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";

        let filter = "hue-rotate(0deg) saturate(1) brightness(1) contrast(0.8)";
        if (idx === 0)
          filter =
            "hue-rotate(-40deg) saturate(2.2) brightness(1.1) contrast(1.1)";
        if (idx === 1)
          filter =
            "hue-rotate(220deg) saturate(1.9) brightness(1.0) contrast(1.9)";
        if (idx === 2)
          filter =
            "hue-rotate(-19deg) saturate(1.1) brightness(1.05) contrast(1.3)";
        if (idx === 3)
          filter =
            "sepia(1) hue-rotate(20deg) saturate(1.2) brightness(1.1) contrast(0.7)";

        const layers = [false, true];

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top:
                idx === 0
                  ? "0"
                  : idx === 1
                  ? "15vh"
                  : idx === 2
                  ? "49vh"
                  : "calc(100vh - 28vh)",
              left: 0,
              width: "100vw",
              height: idx === 1 ? "50vh" : idx === 2 ? "40vh" : "28vh",
              zIndex: idx,
            }}
          >
            {layers.map((flipped, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  WebkitMaskImage: mask,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  maskImage: mask,
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                  filter: filter,
                  opacity: 0.5,
                  transform: flipped ? "scaleX(-1)" : "none",
                }}
              />
            ))}
          </div>
        );
      })}

      {/* Transparent clock overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size,
          height: size,
          borderRadius: "50%",
          fontFamily: fontVar,
          zIndex: 10,
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}
      >
        {/* Numbers */}
        {[3, 6, 9, 12].map((num) => {
          const angle = (num / 12) * 2 * Math.PI;
          const radius = 28;
          const x = radius * Math.sin(angle);
          const y = -radius * Math.cos(angle);
          return (
            <div
              key={num}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}vmin)`,
                top: `calc(50% + ${y}vmin)`,
                transform: "translate(-50%, -50%)",
                fontSize: "4rem",
                zIndex: 30, // keep above hands
                fontFamily: fontVar,
                background:
                  "linear-gradient(135deg, #fdfdfd, #d8d8d8, #ffffff, #eaeaea, #d0d0d0)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                opacity: 0.5,
                WebkitTextFillColor: "transparent",
                animation: "shimmer 6s infinite linear",
                WebkitAnimation: "shimmer 6s infinite linear",
                textShadow: "0.2rem 0.2rem 0.3rem gold",
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.5rem",
            height: "25%",
            top: "25%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg)`,
            borderRadius: "0.4rem",
            zIndex: 20,
            opacity: 0.5,
            background:
              "linear-gradient(135deg, #fefcf8, #c8d2e6, #e6e1f0, #ffffff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 8s infinite linear",
            WebkitAnimation: "shimmer 8s infinite linear",
            boxShadow: "0 0.1rem 0.3rem gold",
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.35rem",
            height: "35%",
            top: "15%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${minuteDeg}deg)`,
            borderRadius: "0.25rem",
            zIndex: 20,
            opacity: 0.5,
            background:
              "linear-gradient(135deg, #fefcf8, #d4d8eb, #e1e8f5, #ffffff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 6s infinite linear",
            WebkitAnimation: "shimmer 6s infinite linear",
            boxShadow: "0 0.1rem 0.3rem gold",
          }}
        />

        {/* Second Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.2rem",
            height: "40%",
            top: "10%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${secondDeg}deg)`,
            borderRadius: "0.125rem",
            zIndex: 20,
            opacity: 0.5,
            background: "linear-gradient(135deg, #fff, #ececec, #dcdcdc, #fff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 5s infinite linear",
            WebkitAnimation: "shimmer 5s infinite linear",
            boxShadow: "0 0.1rem 0.2rem gold",
          }}
        />
      </div>
    </div>
  );
}
