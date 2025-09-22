import React, { useEffect, useState } from "react";
import customFont from "./gre.ttf?url";
import stripe1 from "./fire.gif?url";
import stripe2 from "./air.gif?url";
import stripe3 from "./h2o.gif?url";
import stripe4 from "./earth.webp?url";

export default function AnalogClock() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(new Date());
  const [fontVar] = useState(`font${new Date().getTime()}`);

  useEffect(() => {
    // Inject font and shimmer animation
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
    `;
    document.head.appendChild(styleEl);

    // Preload font and background images
    const font = new FontFace(fontVar, `url(${customFont})`);
    const images = [stripe1, stripe2, stripe3, stripe4];
    let loadedCount = 0;
    let fontLoaded = false;

    const checkReady = () => {
      if (fontLoaded && loadedCount === images.length) {
        setReady(true);
      }
    };

    font.load()
      .then(() => {
        document.fonts.add(font);
        fontLoaded = true;
        checkReady();
      })
      .catch((err) => {
        console.error(`Font load failed: ${err}`);
        fontLoaded = true; // Proceed even if font fails
        checkReady();
      });

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        checkReady();
      };
      img.onerror = () => {
        console.error(`Image load failed: ${src}`);
        loadedCount++;
        checkReady();
      };
    });

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Loading timeout, proceeding with rendering");
      setReady(true);
    }, 5000);

    return () => {
      document.head.removeChild(styleEl); // Cleanup to avoid style leakage
      clearTimeout(timeout);
    };
  }, [fontVar]);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          backgroundColor: "black",
        }}
      />
    );
  }

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
        height: "100dvh",
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

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top:
                idx === 0
                  ? "0"
                  : idx === 1
                  ? "15dvh"
                  : idx === 2
                  ? "49dvh"
                  : "calc(100dvh - 28dvh)",
              left: 0,
              width: "100vw",
              height: idx === 1 ? "50dvh" : idx === 2 ? "40dvh" : "28dvh",
              zIndex: idx,
            }}
          >
            {[false, true].map((flipped, i) => (
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
                  maskImage: mask,
                  filter: filter,
                  opacity: 0.5,
                  transform: flipped ? "scaleX(-1)" : "none",
                }}
              />
            ))}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          fontFamily: fontVar,
          background: "transparent",
          zIndex: 10,
        }}
      >
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
                left: `calc(50% + ${x}vw)`,
                top: `calc(50% + ${y}vw)`,
                transform: "translate(-50%, -50%)",
                fontSize: "5rem",
                fontFamily: fontVar,
                background:
                  "linear-gradient(135deg, #fdfdfd, #d8d8d8, #ffffff, #eaeaea, #d0d0d0)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0.3,
                animation: "shimmer 6s infinite linear",
                textShadow: "0.2rem 0.2rem 0.3rem rgba(0, 0, 0, 0.5)",
                zIndex: 30,
              }}
            >
              {num}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            width: "0.5rem",
            height: "25%",
            top: "25%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg)`,
            background:
              "linear-gradient(135deg, #fefcf8, #c8d2e6, #e6e1f0, #ffffff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 8s infinite linear",
            borderRadius: "0.4rem",
            zIndex: 20,
            opacity: 0.5,
            boxShadow: "0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "0.35rem",
            height: "35%",
            top: "15%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${minuteDeg}deg)`,
            background:
              "linear-gradient(135deg, #fefcf8, #d4d8eb, #e1e8f5, #ffffff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 6s infinite linear",
            borderRadius: "0.25rem",
            zIndex: 20,
            opacity: 0.5,
            boxShadow: "0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "0.2rem",
            height: "40%",
            top: "10%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${secondDeg}deg)`,
            background: "linear-gradient(135deg, #fff, #ececec, #dcdcdc, #fff)",
            backgroundSize: "200% 200%",
            animation: "shimmer 5s infinite linear",
            borderRadius: "0.125rem",
            zIndex: 20,
            opacity: 0.5,
            boxShadow: "0 0.1rem 0.2rem rgba(0, 0, 0, 0.5)",
          }}
        />

        <div
          style={{
            position: "absolute",
            visibility: "hidden",
          }}
          aria-live="polite"
        >
          {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}