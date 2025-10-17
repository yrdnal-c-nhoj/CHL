import React, { useEffect, useState } from "react";
import font20251016 from "./word.ttf";
import backgroundImage from "./words.jpg";

export default function TimeWordsClock() {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // Preload font
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "font";
    preload.href = font20251016;
    preload.type = "font/ttf";
    preload.crossOrigin = "anonymous";
    document.head.appendChild(preload);

    const family = "UserLoadedFont20251016";
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      @font-face {
        font-family: '${family}';
        src: url('${font20251016}') format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(styleTag);

    (async () => {
      try {
        if ("FontFace" in window) {
          const ff = new FontFace(family, `url(${font20251016})`);
          await ff.load();
          document.fonts.add(ff);
        } else if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setNow(new Date());
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      document.head.removeChild(preload);
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const tick = () => setNow(new Date());
    const msToNext = 1000 - (Date.now() % 1000);
    const t = setTimeout(() => {
      tick();
      const i = setInterval(tick, 1000);
      return () => clearInterval(i);
    }, msToNext);
    return () => clearTimeout(t);
  }, [ready]);

  const hourWords = [
    "twelve", "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten", "eleven"
  ];

  const smallNumberWords = [
    "zero", "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen"
  ];

  const tensWords = ["", "", "twenty", "thirty", "forty", "fifty"];

  function numberToWords(num) {
    if (num < 20) return smallNumberWords[num];
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return ones === 0 ? tensWords[tens] : `${tensWords[tens]}-${smallNumberWords[ones]}`;
  }

  function timeToWords(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let relation = "after";
    let displayMinutes = minutes;
    let displaySeconds = seconds;
    let displayHour = hours % 12 === 0 ? 12 : hours % 12;
    let period = hours >= 12 ? "PM" : "AM";

    if (minutes > 30 || (minutes === 30 && seconds > 0)) {
      relation = "before";
      displayMinutes = 60 - minutes;
      displaySeconds = seconds > 0 ? 60 - seconds : 0;
      const nextHour = (hours + 1) % 24;
      displayHour = nextHour % 12 === 0 ? 12 : nextHour % 12;
    }

    const hourWord = hourWords[displayHour % 12 === 0 ? 0 : displayHour];

    const lines = [];

    // Minutes
    if (displayMinutes > 0) {
      lines.push(`"Now, it is ${numberToWords(displayMinutes)} minute${displayMinutes !== 1 ? "s" : ""}`);
    }

    // Seconds (only if there are seconds to display)
    if (displaySeconds > 0) {
      if (displayMinutes > 0) {
        lines.push(`and ${numberToWords(displaySeconds)} second${displaySeconds !== 1 ? "s" : ""}`);
      } else {
        lines.push(`It is ${numberToWords(displaySeconds)} second${displaySeconds !== 1 ? "s" : ""}`);
      }
    }

    // Relation / hour
    lines.push(`${relation} ${hourWord} o'clock."`);

    return lines;
  }

  if (!ready || !now) return null;

  // Container
  const containerStyle = {
    width: "100vw",
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  };

  // Background image with filter and horizontal flip
  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "hue-rotate(-130deg) saturate(0.6) contrast(0.3) brightness(1.9)",
    transform: "scaleX(-1)",
    zIndex: 0,
  };

  // Text
  const textStyle = {
    position: "relative",
    zIndex: 1,
    fontFamily: "UserLoadedFont20251016, Georgia, serif",
    fontSize: "clamp(4vh, 4.5vw, 8vh)",
    color: "#050504FF",
    textAlign: "center",
    lineHeight: "1.4",
    borderRadius: "0.2vh",
    textShadow: `
      0.02em 0.02em  #DF1414FF,
     
      -0.02em -0.02em 0 rgba(255,255,255,0.9)
    `,
    padding: "2vh 4vw",
    border: "0.2vh solid rgba(255, 255, 255, 0.3)",
  };

  const lines = timeToWords(now);

  return (
    <div style={containerStyle} aria-live="polite">
      <div style={backgroundStyle}></div>
      <div style={textStyle}>
        {lines.map((line, i) => (
          <div key={i}>{line}<br />&nbsp;</div>
        ))}
      </div>
    </div>
  );
}