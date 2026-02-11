import React, { useState, useEffect } from "react";
import dotsFontWoff2 from '../../../assets/fonts/25-05-27-dots.woff2'; // Preferred format
import dotsFontOtf from '../../../assets/fonts/25-05-27-dots.otf';    // Fallback format
import backgroundImage from "../../../assets/images/25-05-27/dot.jpg"; // Import background image

function Clock() {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [fontReady, setFontReady] = useState(false);

  // Inline FontFace loading with woff2 primary and otf fallback (no external CSS file)
  useEffect(() => {
    let cancelled = false;

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.type = 'font/woff2';
    preload.crossOrigin = 'anonymous';
    preload.href = dotsFontWoff2;
    document.head.appendChild(preload);

    const load = async () => {
      try {
        const face = new FontFace('dots', `url(${dotsFontWoff2}) format('woff2'), url(${dotsFontOtf}) format('opentype')`);
        const loaded = await face.load();
        if (!cancelled) {
          document.fonts.add(loaded);
          setFontReady(true);
        }
      } catch (err) {
        console.error('Dots font load failed, using fallback', err);
        if (!cancelled) {
          setFontReady(true); // allow render even if font fails
        }
      }
    };

    load();
    return () => {
      cancelled = true;
      if (document.head.contains(preload)) {
        document.head.removeChild(preload);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    hours = (hours % 12) || 12;
    hours = hours.toString();

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTimeParts(time);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    width: "100vw",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "0.1rem" : "0.1rem",
    overflow: "hidden",
  };

  const unitStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "0.1rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const digitBoxStyle = {
    width: "9rem",
    height: "9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11rem",
    fontFamily: "'dots', monospace",
    backgroundColor: "rgba(251, 148, 5, 0.1)",
    borderRadius: "0.2em",
    color: "rgb(4, 2, 109)",
    // Uncomment for debugging
    // border: fontReady ? '2px solid green' : '2px solid red',
    textShadow: `
      #f6320b 1px 1px 20px,
      #94f00b -1px 1px 20px,
      #f72808 1px -1px 20px,
      #a5f507 -1px -1px 20px
    `,
  };

  const renderTimeUnit = (value) => (
    <div style={unitStyle}>
      {[...value].map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digit}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", opacity: fontReady ? 1 : 0.5, transition: 'opacity 0.3s ease' }}>
        {/* Static Background Layer */}
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            filter: "hue-rotate(50deg)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: 0.6, // Adjust to your preference
          }}
        />

        {/* Foreground Clock */}
        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          {renderTimeUnit(hours)}
          {renderTimeUnit(minutes)}
          {renderTimeUnit(seconds)}
        </div>
      </div>
    </>
  );
}

export default Clock;
