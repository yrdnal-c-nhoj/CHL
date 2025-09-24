import React, { useEffect, useState, useMemo, useRef } from "react";

// digits
import digit1 from "./z.gif";
import digit2 from "./z2.gif";
import digit10 from "./z3.gif";
import digit12 from "./z4.gif";
import digit5 from "./z5.gif";
import digit6 from "./z6.gif";
import digit7 from "./z7.gif";
import digit8 from "./z8.webp";
import digit9 from "./z9.webp";
import digit11 from "./z10.gif";
import digit3 from "./z11.gif";
import digit4 from "./z12.gif";

// hands
import hourHandImg from "./stteth.gif";
import minuteHandImg from "./sss.webp";
import secondHandImg from "./ste.gif";

export default function AnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const [ready, setReady] = useState(false);

  const digits = useMemo(
    () => [
      digit12, digit1, digit2, digit3, digit4, digit5,
      digit6, digit7, digit8, digit9, digit10, digit11
    ],
    []
  );

  const allImages = useMemo(
    () => [...digits, hourHandImg, minuteHandImg, secondHandImg],
    [digits]
  );

  // Preload images
  useEffect(() => {
    let loadedCount = 0;

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === allImages.length) {
          setReady(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        loadedCount += 1;
        if (loadedCount === allImages.length) {
          setReady(true);
        }
      };
    });
  }, [allImages]);

  const digitPositions = useMemo(() => {
    return digits.map((src, i) => {
      const angle = (i / 12) * 2 * Math.PI;
      const radius = 35;
      const x = 50 + radius * Math.sin(angle);
      const y = 50 - radius * Math.cos(angle);

      const dx = Math.sin(angle);
      const dy = -Math.cos(angle);
      const offset = 0.09;
      const outwardX = dx * offset;
      const outwardY = dy * offset;
      const inwardX = -dx * offset;
      const inwardY = -dy * offset;

      let shadowFilter = `
        drop-shadow(0 0 0.9rem rgba(100,150,255,0.8))
        drop-shadow(${outwardX}rem ${outwardY}rem 0 black)
        drop-shadow(${inwardX}rem ${inwardY}rem 0 white)
        drop-shadow(0.6rem 0.6rem 1.4rem rgba(0,0,0,0.25))
        drop-shadow(-0.4rem -0.4rem 0.9rem rgba(200,220,255,0.4))
      `;

      if (i === 6) {
        shadowFilter = shadowFilter.replace(
          /drop-shadow\(\-?\d+(\.\d+)?rem \-?\d+(\.\d+)?rem 0 black\)/,
          ""
        );
      }

      return { src, x, y, shadowFilter, key: i };
    });
  }, [digits]);

  const handStyle = (ref, width, height, extraShadow = "") => ({
    ref,
    position: "absolute",
    bottom: "50%",
    left: "50%",
    width,
    height,
    transformOrigin: "bottom center",
    filter: `
      drop-shadow(0.4rem 0.4rem 1.2rem rgba(0,0,0,0.55))
      drop-shadow(-0.1rem -0.1rem 0.1rem rgba(220,230,25,0.9))
      drop-shadow(0.05rem 0.05rem 0.05rem white)
      ${extraShadow || ""}
    `,
  });

  // Animate hands smoothly
  useEffect(() => {
    if (!ready) return;

    let animationFrameId;

    const animateHands = () => {
      const now = new Date();
      const ms = now.getMilliseconds() / 1000;
      const seconds = now.getSeconds() + ms;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      if (secondRef.current) {
        secondRef.current.style.transform = `translateX(-50%) rotate(${(seconds / 60) * 360}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `translateX(-50%) rotate(${(minutes / 60) * 360}deg)`;
      }
      if (hourRef.current) {
        hourRef.current.style.transform = `translateX(-50%) rotate(${(hours / 12) * 360}deg)`;
      }

      animationFrameId = requestAnimationFrame(animateHands);
    };

    animateHands();

    return () => cancelAnimationFrame(animationFrameId);
  }, [ready]);

  if (!ready) return null; // hide everything until all images loaded

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle, rgba(223, 220, 220, 0.2) 0%, rgba(159, 126, 120, 0.4) 80%)",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "80vmin",
          width: "80vmin",
          borderRadius: "50%",
          boxShadow:
            "inset -1.2rem -1.2rem 2.4rem rgba(0,0,0,0.35), inset 1.2rem 1.2rem 2.4rem rgba(220,235,255,0.3), 0 1.5rem 3rem rgba(0,0,0,0.35)",
          background:
            "radial-gradient(circle at center, rgba(210,210,210,0.2) 10%, rgba(60,60,60,0.2) 90%)",
        }}
      >
        {digitPositions.map(({ src, x, y, shadowFilter, key }) => (
          <img
            key={key}
            src={src}
            alt={`digit-${key}`}
            style={{
              position: "absolute",
              top: `${y}%`,
              left: `${x}%`,
              transform: "translate(-50%, -50%)",
              height: "6rem",
              width: "auto",
              filter: shadowFilter,
            }}
          />
        ))}

        <img
          ref={hourRef}
          src={hourHandImg}
          alt="hour-hand"
          style={{ ...handStyle(hourRef, "6vmin", "17vmin"), opacity: 0.75 }}
        />

        <img
          ref={minuteRef}
          src={minuteHandImg}
          alt="minute-hand"
          style={{ ...handStyle(minuteRef, "12.5vmin", "28vmin"), opacity: 0.7 }}
        />

        <img
          ref={secondRef}
          src={secondHandImg}
          alt="second-hand"
          style={{ ...handStyle(secondRef, "32vmin", "38vmin") }}
        />
      </div>
    </div>
  );
}
