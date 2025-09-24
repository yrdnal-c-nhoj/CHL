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
  const animationFrameRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Digits array
  const digits = useMemo(
    () => [
      digit12, digit1, digit2, digit3, digit4, digit5,
      digit6, digit7, digit8, digit9, digit10, digit11
    ],
    []
  );

  // Preload images once
  useEffect(() => {
    const allImages = [...digits, hourHandImg, minuteHandImg, secondHandImg];
    Promise.all(
      allImages.map(
        src =>
          new Promise(resolve => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          })
      )
    ).then(() => setReady(true));
  }, [digits]);

  // Digit positions (static)
  const digitElements = useMemo(() => {
    return digits.map((src, i) => {
      const angle = (i / 12) * 2 * Math.PI;
      const radius = 42;
      const x = 50 + radius * Math.sin(angle);
      const y = 50 - radius * Math.cos(angle);

      return (
        <img
          key={i}
          src={src}
          alt={`digit-${i}`}
          className="clock-digit"
          style={{
            position: "absolute",
            top: `${y}%`,
            left: `${x}%`,
            transform: "translate(-50%, -50%)",
            width: "auto",
          }}
        />
      );
    });
  }, [digits]);

  // Animate hands efficiently
  useEffect(() => {
    if (!ready) return;

    const update = () => {
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

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle, rgba(123,120,120,0.8) 0%, rgba(159,116,10,0.3) 80%)",
      }}
    >
      <div className="clock-face">
        {digitElements}

        <img ref={hourRef} src={hourHandImg} alt="hour-hand" className="hour-hand" />
        <img ref={minuteRef} src={minuteHandImg} alt="minute-hand" className="minute-hand" />
        <img ref={secondRef} src={secondHandImg} alt="second-hand" className="second-hand" />
      </div>

      <style>{`
        /* Clock Face */
        .clock-face {
          position: relative;
          border-radius: 50%;
          box-shadow: inset -1.2rem -1.2rem 2.4rem rgba(0,0,0,0.35),
                      inset 1.2rem 1.2rem 2.4rem rgba(220,235,255,0.7),
                      0 1.5rem 3rem rgba(90,0,0,0.75);
          background: radial-gradient(circle at center,
                      rgba(210,260,10,0.2) 10%,
                      rgba(260,280,60,0.5) 90%);
          width: 100vw;
          height: 100vw;
        }

        /* Digits */
        .clock-digit {
          height:16vh; /* phones */
        }
        @media (min-width: 768px) {
          .clock-face {
            width: 90vh;
            height: 90vh;
          }
          .clock-digit {
            height: 12vw; /* laptops/desktops */
          }
        }

        /* Hands */
        .hour-hand, .minute-hand, .second-hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          will-change: transform;
        }

        .hour-hand {
          opacity: 0.75;
          width: 6vmin;
          height: 17vmin;
        }
        .minute-hand {
          opacity: 0.7;
          width: 12vmin;
          height: 28vmin;
        }
        .second-hand {
          width: 32vmin;
          height: 38vmin;
        }

        @media (min-width: 768px) {
          .hour-hand {
            width: 6vh;
            height: 17vh;
          }
          .minute-hand {
            width: 12vh;
            height: 28vh;
          }
          .second-hand {
            width: 32vh;
            height: 38vh;
          }
        }
      `}</style>
    </div>
  );
}
