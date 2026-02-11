import React, { useEffect, useState, useMemo } from "react";
import bgVideo from "../../../assets/images/26-01-14/kuro.mp4";
import fallbackImg from "../../../assets/images/26-01-14/kuro.webp";
import romanFont from "../../../assets/fonts/26-01-14-kuro.otf";

const FONT_NAME = "RomanClockFont";
const CLOCK_GRADIENT = "linear-gradient(180deg, #DCCFE1, #AFB1B3)";

export default function KurosawaClock() {
  const [now, setNow] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const font = new FontFace(FONT_NAME, `url(${romanFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    // Preload video fallback image to avoid flash if video errors or is slow
    const img = new Image();
    const done = () => setMediaReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = fallbackImg;
    const timeout = setTimeout(done, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const styles = {
    wrapper: {
      height: "100dvh",
      width: "100vw",
      overflow: "hidden",
      position: "relative",
      background: "#000",
      boxSizing: "border-box",
    },
    media: {
      position: "absolute",
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    },
    // CHANGED: The container no longer uses absolute positioning to center itself.
    // It now behaves like a normal flex child within the clock instance.
    container: {
      display: "flex",
      gap: "0", 
      pointerEvents: "none",
    },
    digit: {
      width: "calc(100vw / 18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: `${FONT_NAME}, sans-serif`,
      fontSize: "min(12dvh, 8vw)",
      background: CLOCK_GRADIENT,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
    }
  };

  const clocksWrapper = {
    display: 'flex',
    justifyContent: 'center', // Centers the row of clocks
    alignItems: 'flex-start', // Pin to top
    width: '100%',
    position: 'absolute',
    top: -10,
    left: 0,
    zIndex: 10,
    gap: '0', // No space between the three clocks
    // paddingTop: '-2dvh',
  };

  const Clock = ({ time }) => {
    const clockDigits = useMemo(() => {
      const timeString = time.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return timeString.replace(/:/g, "").split("");
    }, [time]);

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {fontLoaded && (
          <div style={styles.container} aria-hidden="true">
            {clockDigits.map((digit, index) => (
              <div key={`${index}-${digit}`} style={styles.digit}>
                {digit}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const leftTime = new Date(now.getTime() - 3600000);
  const rightTime = new Date(now.getTime() + 3600000);

  const ready = fontLoaded && (mediaReady || videoError);

  return (
    <main style={{ ...styles.wrapper, opacity: ready ? 1 : 0, visibility: ready ? 'visible' : 'hidden', transition: 'opacity 0.35s ease' }}>
      {!videoError ? (
        <video
          src={bgVideo}
          muted autoPlay loop playsInline
          onError={() => setVideoError(true)}
          style={styles.media}
        />
      ) : (
        <img decoding="async" loading="lazy" src={fallbackImg} alt="" style={styles.media} />
      )}
      
      <div style={clocksWrapper}>
        <Clock time={leftTime} />
        <Clock time={now} />
        <Clock time={rightTime} />
      </div>
    </main>
  );
}
