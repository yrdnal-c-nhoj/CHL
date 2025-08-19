import React, { useEffect, useMemo, useState } from "react";
import bg1 from "./ar.gif";
import bg2 from "./arrows.gif";
import bg3 from "./arro.webp";
import bg4 from "./po.gif";
import fontFileUrl from "./targ.otf";

const CLOCK_FONT_FAMILY = "ClockFont__Scoped_7t3";

export default function ClockLetters({
  sizeVmin = 60,
  letters = "EPHiCUGLjgKp",
  showSecondHand = true,
}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { hourDeg, minDeg, secDeg } = useMemo(() => {
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();
    const second = s + ms / 1000;
    const minute = m + second / 60;
    const hour = h + minute / 60;
    return {
      hourDeg: hour * 30,
      minDeg: minute * 6,
      secDeg: second * 6,
    };
  }, [now]);

  const glyphs = useMemo(() => {
    const raw = (letters || "").toString();
    if (raw.length >= 12) return raw.slice(0, 12).split("");
    return (raw + "ABCDEFGHIJKL").slice(0, 12).split("");
  }, [letters]);

  const root = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  };

  const bgLayer = (url, opacity, z) => ({
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity,
    zIndex: z,
  });

  const faceWrap = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${sizeVmin}vmin`,
    height: `${sizeVmin}vmin`,
    display: "grid",
    placeItems: "center",
    zIndex: 10,
  };

  const face = {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%", };

  const tickBase = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "0% 50%",
    borderRadius: "0.6vmin",
    willChange: "transform",
  };

  const hourHand = {
    ...tickBase,
    width: `${sizeVmin * 0.37}vmin`,
    height: `${sizeVmin * 0.015}vmin`,
    background: "rgba(20,20,20,0.9)",
    zIndex: 3,
    transform: `rotate(${hourDeg - 90}deg) translateX(${sizeVmin * 0.04}vmin)`,
  };

  const minuteHand = {
    ...tickBase,
    width: `${sizeVmin * 0.53}vmin`,
    height: `${sizeVmin * 0.01}vmin`,
    background: "rgba(20,20,20,0.9)",
    zIndex: 4,
    transform: `rotate(${minDeg - 90}deg) translateX(${sizeVmin * 0.04}vmin)`,
  };

  const secondHand = {
    ...tickBase,
    width: `${sizeVmin * 0.6}vmin`,
    height: `${sizeVmin * 0.005}vmin`,
    background: "rgba(210,0,0,0.9)",
    zIndex: 5,
    transform: `rotate(${secDeg - 90}deg) translateX(${sizeVmin * 0.04}vmin)`,
  };

  const letterStyleBase = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: CLOCK_FONT_FAMILY,
    fontWeight: "700",
    userSelect: "none",
    textShadow:
      "0 0.2vmin 0.6vmin rgba(0,0,0,0.5), 0 0 0.2vmin rgba(255,255,255,0.9)",
    color: "rgba(15,15,15,0.95)",
    zIndex: 2,
  };

  const lettersNodes = useMemo(() => {
    const radius = sizeVmin / 2 - sizeVmin * 0.08;
    return glyphs.map((ch, i) => {
      const angle = ((i / 12) * 360 - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = sizeVmin * 0.22;
      return (
        <div
          key={i}
          style={{
            ...letterStyleBase,
            left: `calc(50% + ${x}vmin)`,
            top: `calc(50% + ${y}vmin)`,
            fontSize: `${size}vmin`,
          }}
        >
          {ch}
        </div>
      );
    });
  }, [glyphs, sizeVmin]);

  const ticks = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 60; i++) {
      const isHour = i % 5 === 0;
      const len = isHour ? sizeVmin * 0.05 : sizeVmin * 0.03;
      const thick = isHour ? sizeVmin * 0.008 : sizeVmin * 0.004;
      nodes.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${len}vmin`,
            height: `${thick}vmin`,
            background: "rgba(0,0,0,0.5)",
            transformOrigin: "0% 50%",
            transform: `rotate(${i * 6 - 90}deg) translateX(${
              sizeVmin * 0.48
            }vmin)`,
            borderRadius: "1vmin",
            opacity: isHour ? 0.9 : 0.6,
          }}
        />
      );
    }
    return nodes;
  }, [sizeVmin]);

  return (
    <div style={root}>
      <style>{`
        @font-face {
          font-family: '${CLOCK_FONT_FAMILY}';
          src: url(${fontFileUrl}) format('opentype');
          font-display: swap;
        }
      `}</style>

      {/* Four stacked backgrounds */}
      <div style={bgLayer(bg1, 0.0, 1)} />
      <div style={bgLayer(bg2, 0.009, 2)} />
      <div style={bgLayer(bg3, 0.6, 3)} />
      <div style={bgLayer(bg4, 0.3, 4)} />

      {/* Clock */}
      <div style={faceWrap}>
        <div style={face}>
          {ticks}
          {lettersNodes}
          <div style={hourHand} />
          <div style={minuteHand} />
          {showSecondHand && <div style={secondHand} />}
        </div>
      </div>
    </div>
  );
}
