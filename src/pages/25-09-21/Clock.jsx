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
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: '${fontVar}';
        src: url(${customFont}) format('truetype');
        font-display: swap;
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
    return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "#F2E8E8FF" }} />;
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
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#EFE9E9FF",
      }}
    >
      {stripes.map((src, idx) => {
        let mask = "";
        if (idx === 0)
          mask = "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";
        else if (idx === 3)
          mask = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)";
        else
          mask =
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)";

        let filter = "hue-rotate(0deg) saturate(1) brightness(1) contrast(0.8)";
        if (idx === 0) filter = "hue-rotate(-30deg) saturate(1.7) brightness(1.1) contrast(1.1)";
        if (idx === 1) filter = "hue-rotate(18deg) saturate(0.7) brightness(1.0) contrast(1.9)";
        if (idx === 2) filter = "hue-rotate(-39deg) saturate(1.1) brightness(1.05) contrast(0.9)";
        if (idx === 3) filter = "sepia(1) hue-rotate(-30deg) saturate(3.2) brightness(1.1) contrast(0.7)";

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
                  ? "22dvh"
                  : idx === 2
                  ? "43dvh"
                  : "calc(100dvh - 28dvh)",
              left: 0,
              width: "100vw",
              height: idx === 1 ? "50dvh" : idx === 2 ? "40dvh" : "28dvh",
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

      {/* Clock overlay */}
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
        }}
      >
        {/* Clock Numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = ((i + 1) / 12) * 2 * Math.PI;
          const radius = 28;
          const x = radius * Math.sin(angle);
          const y = -radius * Math.cos(angle);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}vmin)`,
                top: `calc(50% + ${y}vmin)`,
                transform: "translate(-50%, -50%)",
                fontSize: "3rem",
                zIndex: 15,
                fontFamily: fontVar,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0.15rem 0.15rem 0.2rem gold",
              }}
            >
              {i + 1}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.1rem",
            height: "25%",
            top: "25%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg)`,
            borderRadius: "0.4rem",
            zIndex: 20,
            background: "linear-gradient(135deg, rgba(254,252,248,0.6), rgba(225,228,232,0.6), rgba(214,226,233,0.6), rgba(254,252,248,0.6))",
            boxShadow: "0 0.1rem 0.2rem gold",
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.1rem",
            height: "35%",
            top: "15%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${minuteDeg}deg)`,
            borderRadius: "0.25rem",
            zIndex: 20,
            background: "linear-gradient(135deg, rgba(254,252,248,0.6), rgba(225,228,232,0.6), rgba(214,226,233,0.6), rgba(254,252,248,0.6))",
            boxShadow: "0 0.1rem 0.2rem gold",
          }}
        />

        {/* Second Hand */}
        <div
          style={{
            position: "absolute",
            width: "0.1rem",
            height: "40%",
            top: "10%",
            left: "50%",
            transformOrigin: "50% 100%",
            transform: `rotate(${secondDeg}deg)`,
            borderRadius: "0.125rem",
            zIndex: 20,
            // background: "linear-gradient(135deg, rgba(254,252,248,0.6), rgba(225,228,232,0.6), rgba(214,226,233,0.6), rgba(254,252,248,0.6))",
            boxShadow: "0 0.1rem 0.2rem gold",
          }}
        />
      </div>
    </div>
  );
}
