import React, { useEffect, useMemo, useState } from "react";
import bg3 from "./target.gif";
import bg1 from "./arrows.gif";
import bg2 from "./ar.gif";
import bg4 from "./bul.gif";
import fontFileUrl from "./targ.otf";
import hourHandImg from "./aro.gif";
import minuteHandImg from "./arrr.gif";
import secondHandImg from "./ar9.gif";

const CLOCK_FONT_FAMILY = "ClockFont__Scoped_7t3";

export default function ClockLetters({
  sizeVmin = 60,
  letters = "EPHiCUGLjgKp",
  showSecondHand = true,
}) {
  const [now, setNow] = useState(new Date());
  const [rotation, setRotation] = useState({ layer1: 0, layer2: 0 });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate rotating layers
  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation((r) => ({
        layer1: r.layer1 + 0.1, // clockwise
        layer2: r.layer2 + 0.06, // counterclockwise
        layer3: r.layer1 + 0.1, // clockwise
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
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
    background: "#ffffff",
  };

  const targetBackground = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "200vmax",
    height: "200vmax",
    transform: "translate(-50%, -50%)",
    background: `
      radial-gradient(
        circle at center,
        #DCEF07FF 0%, #CB4B4BFF 10%, /* Black bullseye */
        #ff0000 10%, #ff0000 20%, /* Red ring */
        #1E5FECFF 20%, #105EF0FF 30%, /* White ring */
        #EDD30FFF 30%, #FAEE09FF 40%, /* Black ring */
        #ff0000 40%, #ff0000 50%, /* Red ring */
        #1E4CF1FF 50%, #0C52C3FF 60%, /* White ring */
        #F6E710FF 60%, #F4E40AFF 70%, /* Black outer ring */
        transparent 70%
      )
    `,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    zIndex: 0, // Lowest z-index to place behind all elements
  };

  const backgroundLayers = [
    { url: bg1, opacity: 0.7, contrast: 8.0, zIndex: 2, size: "70%", pos: "center", saturation: 2.2, hue: 20, rotate: rotation.layer1 },
    { url: bg2, opacity: 0.9, contrast: 8.0, zIndex: 3, size: "50%", pos: "center", saturation: 2.8, hue: 10, rotate: rotation.layer2 },
    { url: bg3, opacity: 1.0, contrast: 8.0, zIndex: 1, size: "50%", pos: "center", saturation: 2.5, hue: -40 },
    { url: bg4, opacity: 0.7, contrast: 6.0, zIndex: 4, size: "50%", pos: "center", saturation: 2.5, hue: -40, rotate: rotation.layer3 },
  ];

  const bgLayerStyle = (layer) => ({
    position: "absolute",
    width: "150vw",
    height: "150vh",
    top: "50%",
    left: "50%",
    transform: layer.rotate ? `translate(-50%, -50%) rotate(${layer.rotate}deg)` : "translate(-50%, -50%)",
    transformOrigin: "center",
    backgroundImage: `url(${layer.url})`,
    backgroundSize: layer.size || "cover",
    backgroundPosition: layer.pos || "center",
    backgroundRepeat: "no-repeat",
    opacity: layer.opacity,
    zIndex: layer.zIndex,
    filter: `saturate(${layer.saturation || 1}) hue-rotate(${layer.hue || 0}deg)`,
  });

  const crosshairStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100vmax",
    height: "100vmax",
    transform: "translate(-50%, -50%)",
    zIndex: 5, // Above target background and image layers
    pointerEvents: "none",
  };

  const crosshairLineStyle = {
    position: "absolute",
    background: "rgba(0, 0, 0, 0.5)",
  };

  const targetNumberStyle = {
    position: "absolute",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#000000",
    fontSize: `${sizeVmin * 0.1}vmin`,
    textShadow: "0 0.1vmin 0.2vmin rgba(255,255,255,0.8)",
    userSelect: "none",
    zIndex: 6, // Above crosshairs
  };

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
    borderRadius: "50%",
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

  const targetNumbers = useMemo(() => {
    const numbers = [10, 9, 8, 7, 6, 5]; // Typical shooting range scoring rings
    const nodes = [];
    
    // Horizontal crosshair numbers (left and right)
    numbers.forEach((num, i) => {
      const offset = (i + 1) * 15; // Spread numbers across viewport
      // Left side
      nodes.push(
        <div
          key={`h-${num}-left`}
          style={{
            ...targetNumberStyle,
            left: `calc(50% - ${offset}vw)`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {num}
        </div>
      );
      // Right side
      nodes.push(
        <div
          key={`h-${num}-right`}
          style={{
            ...targetNumberStyle,
            left: `calc(50% + ${offset}vw)`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {num}
        </div>
      );
    });

    // Vertical crosshair numbers (top and bottom)
    numbers.forEach((num, i) => {
      const offset = (i + 1) * 15; // Spread numbers across viewport
      // Top side
      nodes.push(
        <div
          key={`v-${num}-top`}
          style={{
            ...targetNumberStyle,
            left: "50%",
            top: `calc(50% - ${offset}vh)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {num}
        </div>
      );
      // Bottom side
      nodes.push(
        <div
          key={`v-${num}-bottom`}
          style={{
            ...targetNumberStyle,
            left: "50%",
            top: `calc(50% + ${offset}vh)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {num}
        </div>
      );
    });

    return nodes;
  }, [sizeVmin]);

  const handContainerStyle = (deg, length, z) => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    transformOrigin: "0% 50%",
    transform: `rotate(${deg - 90}deg) translateX(${sizeVmin * 0.04}vmin)`,
    width: `${length}vmin`,
    height: "auto",
    zIndex: z,
    pointerEvents: "none",
  });

  const handImageStyle = {
    width: "100%",
    height: "auto",
    transform: "rotate(180deg)",
    transformOrigin: "center",
    filter: "drop-shadow(0.2vmin 0.2vmin 0.3vmin rgba(0,0,0,0.5))",
  };

  return (
    <div style={root}>
      <style>{`
        @font-face {
          font-family: '${CLOCK_FONT_FAMILY}';
          src: url(${fontFileUrl}) format('opentype');
          font-display: swap;
        }
      `}</style>

      {/* Target background behind all layers */}
      <div style={targetBackground} />

      {/* Background image layers */}
      {backgroundLayers.map((layer, i) => (
        <div key={i} style={bgLayerStyle(layer)} />
      ))}

      {/* Crosshair overlay */}
      <div style={crosshairStyle}>
        <div
          style={{
            ...crosshairLineStyle,
            width: "100%",
            height: "0.2vmin",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            ...crosshairLineStyle,
            width: "0.2vmin",
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Target numbers along crosshairs */}
      {targetNumbers}

      <div style={faceWrap}>
        <div style={face}>
          {ticks}
          {lettersNodes}
          <div style={handContainerStyle(hourDeg, sizeVmin * 0.37, 3)}>
            <img src={hourHandImg} style={handImageStyle} alt="Hour hand" />
          </div>
          <div style={handContainerStyle(minDeg, sizeVmin * 0.53, 4)}>
            <img src={minuteHandImg} style={handImageStyle} alt="Minute hand" />
          </div>
          {showSecondHand && (
            <div style={handContainerStyle(secDeg, sizeVmin * 0.6, 5)}>
              <img src={secondHandImg} style={handImageStyle} alt="Second hand" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}